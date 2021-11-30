<?php

namespace Drupal\anu_lms_assessments\Plugin\rest\resource;

use Drupal\anu_lms_assessments\Entity\AssessmentQuestionResult;
use Drupal\anu_lms_assessments\Entity\AssessmentResultInterface;
use Drupal\anu_lms_assessments\Quiz;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "question_rest_resource",
 *   label = @Translation("Question rest resource"),
 *   uri_paths = {
 *     "create" = "/assessments/question"
 *   }
 * )
 */
class QuestionRestResource extends ResourceBase {

  /**
   * Payload sent from the frontend application.
   *
   * @var array
   */
  protected array $payload;

  /**
   * Quiz handler.
   *
   * @var \Drupal\anu_lms_assessments\Quiz
   */
  protected Quiz $quiz;

  /**
   * Entity type manager handler.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * Entity repository handler.
   *
   * @var \Drupal\Core\Entity\EntityRepositoryInterface
   */
  protected EntityRepositoryInterface $entityRepository;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, Quiz $quiz, EntityTypeManagerInterface $entity_type_manager, EntityRepositoryInterface $entity_repository) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->quiz = $quiz;
    $this->entityTypeManager = $entity_type_manager;
    $this->entityRepository = $entity_repository;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('anu_lms_assessments'),
      $container->get('anu_lms_assessments.quiz'),
      $container->get('entity_type.manager'),
      $container->get('entity.repository'),
    );
  }

  /**
   * Handles submission of a single question within a lesson.
   *
   * @param array $data
   *   Data sent from the frontend application.
   *   Example:
   *   [
   *     // Required field: ID of question asked.
   *     "questionId" => 123,
   *     // Required field: Answer provided by the user.
   *     // Can be of any variable type depending on the question type.
   *     "value" => 10,
   *   ].
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   Response to the user containing the expected answer for the question.
   */
  public function post(array $data): ModifiedResourceResponse {
    $this->payload = $data;

    try {
      // Make sure required argument with question ID exists in the payload.
      if (empty($data['questionId']) || !is_numeric($data['questionId'])) {
        throw new BadRequestHttpException('Required argument "questionId" is missing');
      }

      // Make sure required argument with response exists in the payload.
      if (empty($data['value'])) {
        throw new BadRequestHttpException('Required argument "data" is missing');
      }

      // Save answer & get the correct value for it.
      [$expected_answer] = $this->processAnswerToQuestion($data['value'], $data['questionId']);
    }
    catch (HttpException $exception) {
      $this->logger->error('Error on question submission: @message. Payload: @payload.', [
        '@message' => $exception->getMessage(),
        '@payload' => print_r($this->payload, 1),
      ]);

      // Pass on the exception.
      throw new $exception();
    }
    catch (\Throwable $exception) {
      $this->logger->error('Exception on question submission: @message. Payload: @payload. Trace: @trace.', [
        '@message' => $exception->getMessage(),
        '@payload' => print_r($this->payload, 1),
        '@trace' => $exception->getTraceAsString(),
      ]);

      throw new BadRequestHttpException('Unexpected error during question submission.');
    }

    return new ModifiedResourceResponse(['correctAnswer' => $expected_answer]);
  }

  /**
   * Saves the submitted answer and returns correct value for it.
   *
   * @param mixed $answer
   *   Answer value given by the user.
   *   Can be of any type (string, array, int, etc).
   * @param int $question_id
   *   ID of the question entity asked.
   * @param \Drupal\anu_lms_assessments\Entity\AssessmentResultInterface|null $quiz_result
   *   Assessment result entity. Added in case when answer belongs to
   *   quiz response instead of just a single question submission.
   *
   * @return array
   *   Array with 2 values:
   *   - Expected (correct) answer
   *   - Boolean value indicating whether this answer is correct
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  protected function processAnswerToQuestion($answer, int $question_id, AssessmentResultInterface $quiz_result = NULL): array {
    // Define some defaults for an answer.
    $is_correct_answer = FALSE;
    $expected_answer = NULL;

    // Load the question asked.
    $question = $this->entityTypeManager->getStorage('assessment_question')
      ->load($question_id);

    // Make sure the provided question exists in the system.
    if (empty($question)) {
      throw new BadRequestHttpException(sprintf('Question %s does not exist in the system', $question_id));
    }

    // Make sure the provided question is within the list of supported
    // question types.
    $supported_question_types = [
      'short_answer',
      'long_answer',
      'scale',
      'multiple_choice',
      'single_choice',
    ];
    if (!in_array($question->bundle(), $supported_question_types)) {
      throw new BadRequestHttpException(sprintf('Question %s has not supported bundle', $question_id));
    }

    // Make sure we loaded the translated version of the question.
    /** @var \Drupal\anu_lms_assessments\Entity\AssessmentQuestionInterface $question */
    $question = $this->entityRepository->getTranslationFromContext($question);

    // Create an entity which holds user's response to the question.
    $question_result = $this->entityTypeManager
      ->getStorage('assessment_question_result')
      ->create([
        'type' => $question->bundle(),
        'aqid' => $question,
        'arid' => $quiz_result,
      ]);

    // Set the fields of the question result entity depending on its type.
    if (in_array($question->bundle(), ['short_answer', 'long_answer'])) {
      // Short and long answers have slightly different name of the fields,
      // so make sure to use the right name for the given question type.
      $field_prefix = $question->bundle() == 'long_answer' ? '_long' : '';
      $question_result->set('field_question_response' . $field_prefix, $answer);

      // For the free text fields we can't precisely say if the user
      // response is correct or not, therefore we set its value to
      // "not applicable".
      $question_result->set('is_correct', AssessmentQuestionResult::RESULT_NOT_APPLICABLE);

      // Grab the answer which was set by content editors in the backend
      // as "correct" (or better say "expected") answer for the question.
      $expected_answer = $question->get('field_correct_answer' . $field_prefix)->getString();

      // Given that we can't determine if the answer is correct or not for
      // this type of question, we assume it's always correct for free
      // types of questions.
      $is_correct_answer = TRUE;
    }
    elseif ($question->bundle() === 'scale') {
      // Grab the correct value for the current question.
      // Scale type of question supports only integer values.
      $expected_answer = (int) $question->get('field_scale_correct')->getString();
      $provided_answer = (int) $answer;

      if ($provided_answer === $expected_answer) {
        $is_correct = AssessmentQuestionResult::RESULT_CORRECT;
        $is_correct_answer = TRUE;
      }
      else {
        $is_correct = AssessmentQuestionResult::RESULT_INCORRECT;
      }

      // Save user response & the status of the correctness of this answer.
      $question_result->set('is_correct', $is_correct);
      $question_result->set('field_question_response_scale', $provided_answer);
    }
    elseif (in_array($question->bundle(), ['multiple_choice', 'single_choice'])) {
      // Get list of question answer options which contain information
      // whether this option is the correct answer or not. Gather list of
      // the correct answers before comparing it with the provided response
      // by the user.
      $expected_answer = [];
      /** @var \Drupal\paragraphs\ParagraphInterface[] $options */
      $options = $question->get('field_options')->referencedEntities();
      foreach ($options as $option) {
        // Prevent paragraph from being saved since that changes the parent_id.
        // Implementation made as patch for entity_reference_revisions module.
        // See in entity_reference_revisions-dont_resave_field_item.patch.
        $option->dontSave = TRUE;

        $is_correct = (bool) $option->get('field_single_multi_choice_right')->getString();
        if ($is_correct) {
          $expected_answer[] = (int) $option->id();
        }
      }

      // Answer is an array of IDs referencing answer options (for
      // multi choice type of questions) or plan ID (for single choice
      // type of questions). We make conversion to array for compatibility
      // with multi-choice type of questions and easier handling.
      $provided_answers = [];
      foreach ((array) $answer as $option_id) {
        $provided_answers[] = (int) $option_id;
      }

      // Compare provided answers and the correct answers.
      if ($expected_answer == $provided_answers) {
        $question_result->set('is_correct', AssessmentQuestionResult::RESULT_CORRECT);
        $is_correct_answer = TRUE;
      }
      else {
        $question_result->set('is_correct', AssessmentQuestionResult::RESULT_INCORRECT);
      }

      // Validate & set answers provided by the user.
      $provided_options = [];
      foreach ($provided_answers as $option_id) {
        $provided_option = NULL;
        foreach ($options as $option) {
          if ($option->id() == $option_id) {
            $provided_option = $option;
          }
        }

        // If option from the answer wasn't found in the list of available
        // options, then something went wrong, maybe option was removed.
        if (empty($provided_option)) {
          throw new BadRequestHttpException(sprintf('Question %s has options not matching possible values.', $question_id));
        }
        $provided_options[] = $provided_option;
      }
      $question_result->set('field_single_multi_choice', $provided_options);
    }

    // When all fields are set, we can save question result entity.
    $question_result->save();

    return [$expected_answer, $is_correct_answer];
  }

}
