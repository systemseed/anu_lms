<?php

namespace Drupal\anu_lms;

use Drupal\config_pages\Entity\ConfigPages;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Symfony\Component\Serializer\Serializer;

/**
 * Settings service.
 */
class Settings {

  protected $entityRepository;
  protected $serializer;

  /**
   * Creates an Settings object.
   *
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Symfony\Component\Serializer\Serializer $serializer
   *   The serializer.
   */
  public function __construct(EntityRepositoryInterface $entity_repository = NULL, Serializer $serializer = NULL) {
    $this->entityRepository = $entity_repository;
    $this->serializer = $serializer;
  }

  /**
   * Returns normalized settings entity.
   */
  public function getSettings() {
    $entity = ConfigPages::config('anu_lms_settings');
    if (empty($entity)) {
      return [];
    }

    // Default configurations.
    $context = [
      'max_depth' => 1,
      'settings' => [
        'config_pages' => [
          'exclude_fields' => [
            'id',
            'entity_type',
            'entity_bundle',
            'uid',
            'uuid',
            'label',
            'type',
            'context',
            'changed',
          ],
        ],
      ],
    ];
    // Get translated version of the entity.
    $entity = $this->entityRepository->getTranslationFromContext($entity);
    return $this->serializer->normalize($entity, 'json_recursive', $context);
  }

}
