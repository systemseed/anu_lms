<?php

namespace Drupal\anu_lms\Normalizer;

use Drupal\node\NodeInterface;
use Drupal\rest_entity_recursive\Normalizer\ContentEntityNormalizer;

/**
 * Converts the Drupal node object structure to a JSON array structure.
 */
abstract class NodeNormalizerBase extends ContentEntityNormalizer {

  /**
   * List of node bundles supported by the current normalizer.
   *
   * @var array
   */
  protected array $supportedBundles;

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = NodeInterface::class;

  /**
   * {@inheritdoc}
   */
  public function supportsNormalization($data, $format = NULL) {
    if (parent::supportsNormalization($data, $format)) {
      return $data instanceof NodeInterface && in_array($data->bundle(), $this->supportedBundles);
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $format = NULL, array $context = []) {
    $normalized = parent::normalize($entity, $format, $context);
    $normalized['path'] = $entity->toUrl('canonical')->toString();
    return $normalized;
  }

}
