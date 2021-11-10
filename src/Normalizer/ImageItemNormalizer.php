<?php

namespace Drupal\anu_lms\Normalizer;

use Drupal\image\Plugin\Field\FieldType\ImageItem;
use Drupal\rest_entity_recursive\Normalizer\ReferenceItemNormalizer;

/**
 * Add title and alt to image items.
 *
 * @package Drupal\anu_lms\Normalizer
 */
class ImageItemNormalizer extends ReferenceItemNormalizer {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = ImageItem::class;

  /**
   * {@inheritdoc}
   */
  public function normalize($field_item, $format = NULL, array $context = []) {
    return parent::normalize($field_item, $format, $context) + [
      'title' => $field_item->get('title')->getValue(),
      'alt' => $field_item->get('alt')->getValue(),
    ];
  }

}
