<?php

namespace Drupal\anu_lms\Normalizer;

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

    // TODO: Move constant to the generic class.
    $anu_content_types = ['courses_page', 'course', 'module', 'module_lesson', 'module_assessment'];
    if (in_array($entity->bundle(), $anu_content_types)) {
      $normalized['path'] = $entity->toUrl('canonical', ['absolute' => TRUE])->toString();
    }

    /** @var \Drupal\anu_lms\Lesson $lessonHandler */
    $lessonHandler = \Drupal::service('anu_lms.lesson');

    if ($entity->bundle() == 'module_lesson' || $entity->bundle() == 'module_assessment') {
      $normalized['is_completed'] = ['value' => $lessonHandler->isCompleted($entity)];
      $normalized['is_restricted'] = ['value' => $lessonHandler->isRestricted($entity)];
    }

    return $normalized;
  }

}
