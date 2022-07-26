<?php

namespace Drupal\anu_lms\Normalizer;

use Drupal\file\FileInterface;
use Drupal\rest_entity_recursive\Normalizer\ContentEntityNormalizer;

/**
 * Normalizes image files.
 */
class ImageFileNormalizer extends ContentEntityNormalizer {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = FileInterface::class;

  /**
   * Array of excluded fields.
   *
   * @var array
   */
  protected array $excludedFields = [
    'langcode',
    'uid',
    'status',
    'created',
    'changed',
  ];

  /**
   * The format that the Normalizer can handle.
   *
   * @var array
   */
  protected $format = ['json_recursive'];

  /**
   * {@inheritdoc}
   */
  public function supportsNormalization($data, $format = NULL): bool {
    return parent::supportsNormalization($data, $format) &&
      strpos($data->get('filemime')->value, 'image/') !== FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $format = NULL, array $context = []) {

    if (!($entity instanceof FileInterface)) {
      return [];
    }

    // Ask REST Entity Recursive to exclude certain fields.
    $context['settings'][$entity->getEntityTypeId()]['exclude_fields'] = $this->excludedFields;

    $normalized_values = parent::normalize($entity, $format, $context);
    $normalized_values['image_styles'] = [
      'original' => file_create_url($entity->getFileUri()),
    ];

    // @todo Take from settings.
    $supported_image_styles = [
      'course_preview',
      'image_with_caption',
      'image_wide_with_caption',
      'image_thumbnail_with_caption',
      'image_bullet_list_small',
      'image_bullet_list_large',
    ];

    // Load image style entities in bulk.
    try {
      // @todo Use dependency injection.
      $image_styles = \Drupal::entityTypeManager()
        ->getStorage('image_style')
        ->loadMultiple($supported_image_styles);

      /** @var \Drupal\image\ImageStyleInterface $image_style */
      foreach ($image_styles as $image_style) {
        $normalized_values['image_styles'][$image_style->getName()] = $image_style->buildUrl($entity->getFileUri());
      }
    }
    catch (\Exception $exception) {
      // @todo catch.
    }

    // Add the current entity as a cacheable dependency to make Drupal flush
    // the cache when the entity gets updated.
    $this->addCacheableDependency($context, $entity);

    return $normalized_values;
  }

}
