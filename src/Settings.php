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

  /**
   * Returns Pwa settings.
   *
   * Code from /pwa/src/Controller/PWAController.php:151
   */
  public function getPwaSettings() {
    if (!\Drupal::moduleHandler()->moduleExists('pwa')) {
      return NULL;
    }

    // Get module configuration.
    $config = \Drupal::config('pwa.config');

    // Look up module release from package info.
    $pwa_module_info = system_get_info('module', 'pwa');
    $pwa_module_version = $pwa_module_info['version'];

    // Packaging script will always provide the published module version. Checking
    // for NULL is only so maintainers have something predictable to test against.
    if ($pwa_module_version == null) {
      $pwa_module_version = '8.x-1.x-dev';
    }

    return [
      'current_cache' => 'pwa-main-' . $pwa_module_version . '-v' . ($config->get('cache_version') ?: 1),
    ];
  }

}
