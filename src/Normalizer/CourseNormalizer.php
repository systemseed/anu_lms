<?php

namespace Drupal\anu_lms\Normalizer;

/**
 * Converts Course node object structure to a JSON array structure.
 */
class CourseNormalizer extends NodeNormalizerBase {

  /**
   * {@inheritdoc}
   */
  protected array $supportedBundles = ['course'];

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $format = NULL, array $context = []) {
    $normalized = parent::normalize($entity, $format, $context);

    /** @var \Drupal\anu_lms\Settings $settings */
    $settings = \Drupal::service('anu_lms.settings');
    /** @var \Drupal\anu_lms\Course $courseHandler */
    $courseHandler = \Drupal::service('anu_lms.course');

    if ($settings->isOfflineSupported()) {
      $normalized['content_urls'] = $courseHandler->getLessonsAndQuizzesUrls($entity);
      $normalized['audios'] = $courseHandler->getAudios($entity);
    }

    return $normalized;
  }

}
