<?php

namespace Drupal\anu_lms\Normalizer;

use Drupal\Core\Url;
use Drupal\rest_entity_recursive\Normalizer\ContentEntityNormalizer;

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

    // @todo Move constant to the generic class.
    $anu_content_types = [
      'courses_page',
      'course', 'module',
      'module_lesson',
      'module_assessment',
    ];
    if (in_array($entity->bundle(), $anu_content_types)) {
      $normalized['path'] = $entity->toUrl('canonical', ['absolute' => TRUE])->toString();
    }

    /** @var \Drupal\anu_lms\Lesson $lessonHandler */
    $lessonHandler = \Drupal::service('anu_lms.lesson');
    /** @var \Drupal\anu_lms\Course $courseHandler */
    $courseHandler = \Drupal::service('anu_lms.course');
    /** @var \Drupal\anu_lms\CourseProgress $courseProgressHandler */
    $courseProgressHandler = \Drupal::service('anu_lms.course_progress');

    if ($entity->bundle() == 'module_lesson' || $entity->bundle() == 'module_assessment') {

      $course = $lessonHandler->getLessonCourse($entity);
      $finishText = $course ? $courseHandler->getFinishText($course) : '';
      if (!empty($finishText)) {
        $normalized['finish_button_text'] = ['value' => $finishText];
      }

      $url = $course ? $courseHandler->getFinishRedirectUrl($course) : Url::fromRoute('<front>');
      $normalized['finish_button_url'] = [
        'value' => $url->setAbsolute()->toString(),
      ];
    }

    if ($entity->bundle() === 'course' && $courseHandler->isLinearProgressEnabled($entity)) {
      $normalized['progress'] = $courseProgressHandler->getCourseProgress($entity);
    }

    if (
      $entity->bundle() === 'course' &&
      isset($context['course_page_categories']) &&
      $courseProgressHandler->isLocked($entity, $context['course_page_categories'])
    ) {
      $normalized['locked'] = ['value' => TRUE];
    }

    return $normalized;
  }

}
