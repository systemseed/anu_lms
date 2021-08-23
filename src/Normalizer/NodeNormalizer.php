<?php

namespace Drupal\anu_lms\Normalizer;

use Drupal\rest_entity_recursive\Normalizer\ContentEntityNormalizer;
use Drupal\Core\Entity\EntityInterface;

/**
 * Converts the Drupal node object structure to a JSON array structure.
 */
class NodeNormalizer extends ContentEntityNormalizer {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = 'Drupal\node\NodeInterface';

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $format = NULL, array $context = []) {
    $normalized = parent::normalize($entity, $format, $context);

    // TODO: Move constant to the generic class.
    $anu_content_types = ['courses_page', 'course', 'module', 'module_lesson', 'module_assessment'];
    if (in_array($entity->bundle(), $anu_content_types)) {
      $normalized['path'] = $entity->toUrl('canonical', ['absolute' => TRUE])->toString();
    }

    /** @var \Drupal\anu_lms\Lesson $lessonHandler */
    $lessonHandler = \Drupal::service('anu_lms.lesson');
    /** @var \Drupal\anu_lms\Course $courseHandler */
    $courseHandler = \Drupal::service('anu_lms.course');

    if ($entity->bundle() == 'module_lesson' || $entity->bundle() == 'module_assessment') {
      $normalized['is_completed'] = ['value' => $lessonHandler->isCompleted($entity)];
      $normalized['is_restricted'] = ['value' => $lessonHandler->isRestricted($entity)];

      $course = $lessonHandler->getLessonCourse($entity);
      $finishText = $courseHandler->getFinishText($course);
      if (!empty($finishText)) {
        $normalized['finish_button_text'] = ['value' => $finishText];
      }
    }

    if ($entity->bundle() === 'course' && $courseHandler->isLinearProgressEnabled($entity)) {
      $normalized['progress'] = ['value' => $this->getCourseProgress($entity)];
    }

    return $normalized;
  }

  /**
   * Returns progress in a course.
   *
   * @param \Drupal\Core\Entity\EntityInterface $course
   *   Course object.
   *
   * @return float
   *   The progress as a percentage like 33.34.
   */
  protected function getCourseProgress(EntityInterface $course) {
    /** @var \Drupal\anu_lms\Lesson $lessonHandler */
    $lessonHandler = \Drupal::service('anu_lms.lesson');

    $modules = $course->get('field_course_module')->referencedEntities();
    $totalLessons = 0;
    $completedLessons = 0;
    foreach ($modules as $module) {

      /** @var \Drupal\node\NodeInterface[] $lessons */
      $lessons = $module->field_module_lessons->referencedEntities();
      foreach ($lessons as $lesson) {
        if ($lesson->access('view')) {
          $totalLessons++;
          if ($lessonHandler->isCompleted($lesson)) {
            $completedLessons++;
          }
        }
      }
      if (!$module->field_module_assessment) {
        continue;
      }
      /** @var \Drupal\node\NodeInterface[] $quizzes */
      $quizzes = $module->field_module_assessment->referencedEntities();
      foreach ($quizzes as $quiz) {
        if ($quiz->access('view')) {
          $totalLessons++;
          if ($lessonHandler->isCompleted($quiz)) {
            $completedLessons++;
          }
        }
      }
    }

    // Calculate percentage.
    if ($totalLessons > 0) {
      $progress = round($completedLessons * 100 / $totalLessons, 2);
    }
    else {
      $progress = 0;
    }

    return $progress;
  }

}
