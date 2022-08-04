<?php

namespace Drupal\anu_lms_assessments\Plugin\rest\resource;

use Drupal\rest\ModifiedResourceResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "assessment_rest_resource",
 *   label = @Translation("Quiz rest resource"),
 *   uri_paths = {
 *     "create" = "/assessments/assessment"
 *   }
 * )
 */
class AssessmentRestResource extends QuestionRestResource {

  /**
   * Handles quiz submission.
   *
   * @param array $data
   *   Data sent from the frontend application.
   *   Expected data structure:
   *   [
   *     // Node ID of the quiz.
   *     "nid" => 123,
   *     // Data from all quizzes on the page.
   *     "data" => [
   *       // Question ID => Answer.
   *       1234 => 15,
   *       1235 => [1, 2, 3]
   *       1236 => "Text answer",
   *     ]
   *   ].
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   Correct answers list and count.
   */
  public function post(array $data): ModifiedResourceResponse {
    $response = [];
    $this->payload = $data;

    try {
      // Make sure required argument with quiz nid exists in the payload.
      if (empty($data['nid']) || !is_numeric($data['nid'])) {
        throw new BadRequestHttpException('Required argument "nid" is missing');
      }

      // Make sure required argument with responses exists in the payload.
      if (!isset($data['data']) || !is_array($data['data'])) {
        throw new BadRequestHttpException('Required argument "data" is missing');
      }

      // Make sure nid present in the payload is actually a real quiz.
      /** @var \Drupal\node\NodeInterface $quiz */
      $quiz = $this->entityTypeManager->getStorage('node')->load($data['nid']);
      if (empty($quiz) || $quiz->bundle() != 'module_assessment') {
        throw new BadRequestHttpException('Provided node ID is not a quiz');
      }

      // Make sure the current user can access the current quiz node.
      if (!$quiz->access('view')) {
        throw new AccessDeniedHttpException('Not sufficient permissions to access the quiz');
      }

      // Save a new entity which stores information about the current
      // quiz submission attempt.
      /** @var \Drupal\anu_lms_assessments\Entity\AssessmentResultInterface $quiz_result */
      $quiz_result = $this->entityTypeManager->getStorage('assessment_result')
        ->create(['aid' => $quiz->id()]);
      $quiz_result->save();

      // Variable to gather correct responses for each of the question.
      $expected_answers = [];

      // Calculator of correct answers given by the current user.
      $correct_answers = 0;

      // Go through all answers given by the user, save them & determine if
      // they're correct or not.
      foreach ($data['data'] as $question_id => $answer) {
        [$expected_answer, $is_correct_answer] = $this->processAnswerToQuestion($answer, $question_id, $quiz_result);
        $expected_answers[$question_id] = $expected_answer;
        $correct_answers += $is_correct_answer ? 1 : 0;
      }

      // Mark the current quiz as completed for the current user.
      $this->quiz->setCompleted($quiz->id());

      // Add information about the correct amount of answers to the output.
      $response['correctAnswersCount'] = $correct_answers;

      // Return the correct answers if the quiz settings allow showing them.
      $hide_correct_answers = (bool) $quiz->get('field_hide_correct_answers')->getString();
      if (empty($hide_correct_answers)) {
        $response['correctAnswers'] = $expected_answers;
      }
    }
    catch (HttpException $exception) {
      $this->logger->error('Error on quiz submission: @message. Payload: @payload.', [
        '@message' => $exception->getMessage(),
        '@payload' => print_r($this->payload, 1),
      ]);

      // Pass on the exception.
      throw new $exception();
    }
    catch (\Throwable $exception) {
      $this->logger->error('Exception on quiz submission: @message. Payload: @payload. Trace: @trace.', [
        '@message' => $exception->getMessage(),
        '@payload' => print_r($this->payload, 1),
        '@trace' => $exception->getTraceAsString(),
      ]);

      throw new BadRequestHttpException('Unexpected error during quiz submission.');
    }

    return new ModifiedResourceResponse($response);
  }

}
