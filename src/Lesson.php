<?php

namespace Drupal\anu_lms;

use Drupal\anu_lms_assessments\Entity\AssessmentQuestionResult;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\entity_reference_revisions\EntityReferenceRevisionsFieldItemList;
use Drupal\node\NodeInterface;

/**
 * Lesson service.
 */
class Lesson {

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected $normalizer;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, Normalizer $normalizer) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->normalizer = $normalizer;
  }

  /**
   * Returns normalized data for Lesson page.
   *
   * @param EntityInterface $node
   *   Lesson node.
   *
   * @return array
   *   An array containing current node and referenced course.
   */
  public function getLessonPageData(NodeInterface $node) {
    $lesson_course = $this->getLessonCourse($node);

    $data = [
      $node->bundle() => $this->normalizer->normalizeEntity($node, ['max_depth' => 4]),
      'course' => !empty($lesson_course) ? $this->normalizer->normalizeEntity($lesson_course, ['max_depth' => 2]) : NULL,
    ];

    if ($node->bundle() === 'module_assessment' && $node->hasField('field_no_multiple_submissions')) {
      $prevent_multiple_submissions = $node->get('field_no_multiple_submissions')->getString();
      if (!empty($prevent_multiple_submissions)) {

        $submitted_quiz = \Drupal::entityQuery('assessment_result')
          ->condition('user_id', \Drupal::currentUser()->id())
          ->condition('aid', $node->id())
          ->sort('created', 'DESC')
          ->range(0, 1)
          ->execute();

        $aid = reset($submitted_quiz);

        $submitted_answers = \Drupal::entityQuery('assessment_question_result')
          ->condition('arid', $aid)
          ->execute();

        /** @var AssessmentQuestionResult[] $answers */
        $answers = \Drupal::entityTypeManager()
          ->getStorage('assessment_question_result')
          ->loadMultiple($submitted_answers);
        foreach ($answers as $answer) {
          $data['results'] = [];
          $data['correct_answers'] = 0;

          $response = NULL;
          if ($answer->bundle() == 'short_answer' && $answer->hasField('field_question_response')) {
            $response = $answer->get('field_question_response')->getString();
          } elseif ($answer->bundle() == 'long_answer' && $answer->hasField('field_question_response_long')) {
            $response = $answer->get('field_question_response_long')->getString();
          } elseif ($answer->bundle() == 'scale') {
            $response = (int)$answer->get('field_question_response_scale')->getString();
          } elseif (($answer->bundle() == 'multiple_choice' || $answer->bundle() == 'single_choice') && $answer->hasField('field_single_multi_choice')) {
            /** @var EntityReferenceRevisionsFieldItemList[] $field_items */
            $field_items = $answer->get('field_single_multi_choice');
            foreach ($field_items as $value) {
              $response[] = $value->getValue()['target_id'];
            }

            if (!empty($response) && $answer->bundle() == 'single_choice') {
              $response = reset($response);
            }
          }

          if (!empty($response)) {
            $question_id = (int)$answer->get('aqid')->getString();
            $data['results'][$question_id] = $response;
          }
          $result = (int) $answer->get('is_correct')->getString();
          if ($this->isCorrectAnswer($result)) {
            $data['correct_answers'] = $data['correct_answers']++;
          }
        }
      }
    }

    return $data;
  }

  /**
   * Returns Course entity for given lesson.
   *
   * @param EntityInterface $lesson
   *   Lesson object.
   *
   * @return EntityInterface
   *   Loaded Course object.
   */
  public function getLessonCourse($lesson) {
    if (empty($lesson)) {
      return NULL;
    }

    // Get lesson's module.
    $field_name = $lesson->bundle() === 'module_lesson' ? 'field_module_lessons' : 'field_module_assessment';
    $module = \Drupal::entityQuery('paragraph')
      ->condition('type', 'course_modules')
      ->condition($field_name, $lesson->id())
      ->sort('created', 'DESC')
      ->range(0, 1)
      ->execute();

    if (empty($module)) {
      return NULL;
    }

    // Get module's course.
    $course = $this->nodeStorage->getQuery()
      ->condition('type', 'course')
      ->condition('field_course_module', reset($module))
      ->accessCheck(FALSE)
      ->range(0, 1)
      ->execute();

    return !empty($course) ? $this->nodeStorage->load(reset($course)) : NULL;
  }

  protected function isCorrectAnswer($answer){
   return !($answer == AssessmentQuestionResult::RESULT_INCORRECT);
  }
}
