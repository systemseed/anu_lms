<?php

namespace Drupal\anu_lms\Normalizer;

/**
 * Converts Lesson or Quiz node object structure to a JSON array structure.
 */
class LessonNormalizer extends NodeNormalizerBase {

  /**
   * {@inheritdoc}
   */
  protected array $supportedBundles = ['module_lesson', 'module_assessment'];

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $format = NULL, array $context = []) {
    $normalized = parent::normalize($entity, $format, $context);

    /** @var \Drupal\node\NodeInterface $lesson */
    $lesson = $entity;

    /** @var \Drupal\anu_lms\Lesson $lessonHandler */
    $lessonHandler = \Drupal::service('anu_lms.lesson');
    /** @var \Drupal\anu_lms\Course $courseHandler */
    $courseHandler = \Drupal::service('anu_lms.course');

    // @todo Potentially can be moved to the course level - feels redundant
    // to have properties with same values inside of each lesson.
    $course = $lessonHandler->getLessonCourse($lesson->id());

    $normalized['finish_button_url'] = [
      'value' => $courseHandler->getFinishRedirectUrl($course)->setAbsolute()->toString(),
    ];

    return $normalized;
  }

}
