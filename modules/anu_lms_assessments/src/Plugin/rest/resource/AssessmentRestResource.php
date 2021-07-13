<?php

namespace Drupal\anu_lms_assessments\Plugin\rest\resource;

use Drupal\anu_lms_assessments\Entity\AssessmentQuestionResult;
use Drupal\node\Entity\Node;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

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
class AssessmentRestResource extends ResourceBase {

  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->logger = $container->get('logger.factory')->get('assessments');
    $instance->currentUser = $container->get('current_user');
    return $instance;
  }

  /**
   * TODO: Refactor and merge the logic with QuestionRestResource.
   */
  public function post($payload) {
    try {
      $correct_answers = [];

      $assessment_nid = $payload['nid'];
      $assessment_data = $payload['data'];

      $assessment_result = \Drupal::entityTypeManager()
        ->getStorage('assessment_result')
        ->create(['aid' => $assessment_nid]);
      $assessment_result->save();

      $correct_answers_count = 0;

      foreach ($assessment_data as $question_id => $answer) {
        $question = \Drupal::entityTypeManager()
          ->getStorage('assessment_question')
          ->load($question_id);

        $question = \Drupal::service('entity.repository')
          ->getTranslationFromContext($question);

        $question_result = \Drupal::entityTypeManager()
          ->getStorage('assessment_question_result')
          ->create([
            'type' => $question->bundle(),
            'aqid' => $question,
            'arid' => $assessment_result,
          ]);

        // TODO: Refactor.
        if ($question->bundle() === 'short_answer') {
          $question_result->set('field_question_response', $answer);
          $question_result->set('is_correct', AssessmentQuestionResult::RESULT_NOT_APPLICABLE);
          $correct_answers[$question_id] = $question->field_correct_answer->getString();
          $correct_answers_count++;
        }
        elseif ($question->bundle() === 'long_answer') {
          $question_result->set('field_question_response_long', $answer);
          $question_result->set('is_correct', AssessmentQuestionResult::RESULT_NOT_APPLICABLE);
          $correct_answers[$question_id] = $question->field_correct_answer_long->getString();
          $correct_answers_count++;
        }
        elseif ($question->bundle() === 'scale') {
          $correct_answers[$question_id] = (int) $question->field_scale_correct->getString();
          $value = (int) $answer;
          $question_result->set('field_question_response_scale', $value);
          $is_correct = $correct_answers[$question_id] === $value ? AssessmentQuestionResult::RESULT_CORRECT : AssessmentQuestionResult::RESULT_INCORRECT;
          $question_result->set('is_correct', $is_correct);
          if ($is_correct) {
            $correct_answers_count++;
          }
        }
        elseif ($question->bundle() === 'multiple_choice' || $question->bundle() === 'single_choice') {
          $options = $question->field_options->referencedEntities();
          $responses = (array) $answer;
          $correct_answers[$question_id] = [];
          foreach ($options as $option) {
            $is_correct = !!$option->field_single_multi_choice_right->getString();
            if ($is_correct) {
              $correct_answers[$question_id][] = (int) $option->id();
            }
          }

          $response_entities = \Drupal::entityTypeManager()
            ->getStorage('paragraph')
            ->loadMultiple($responses);
          foreach ($response_entities as $response_entity) {
            // Setting flag for workaround for preventing re-saving
            // paragraph and changing parent_id.
            // Implementation made as patch
            // for entity_reference_revisions module.
            $response_entity->dontSave = TRUE;
          }
          $question_result->set('field_single_multi_choice', $response_entities);

          // TODO: Multiple correct values in radio?
          $is_correct = $responses == $correct_answers[$question_id] ? AssessmentQuestionResult::RESULT_CORRECT : AssessmentQuestionResult::RESULT_INCORRECT;
          $question_result->set('is_correct', $is_correct);
          if ($is_correct) {
            $correct_answers_count++;
          }
        }

        $question_result->save();
      }
    }
    catch (\Throwable $exception) {
      $this->logger->error($exception->getMessage() . ' Trace: ' . $exception->getTraceAsString());
      throw new BadRequestHttpException('An error occurred during request handling');
    }

    /** @var \Drupal\node\Entity\NodeInterface $quiz */
    $quiz = Node::load($assessment_nid);
    // Default behavior fallback.
    $hide_correct_answers = FALSE;
    if ($quiz->hasField('field_hide_correct_answers')) {
      $hide_correct_answers = (bool) $quiz->get('field_hide_correct_answers')->getString();
    }

    // Add information about the correct amount of answers to the output.
    $response = [
      'correctAnswersCount' => $correct_answers_count,
    ];

    // Return the correct answers if not set to hide them.
    if (empty($hide_correct_answers)) {
      $response['correctAnswers'] = $correct_answers;
    }

    return new ModifiedResourceResponse($response);
  }

}
