<?php

namespace Drupal\anu_lms;

use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Path\PathMatcherInterface;
use Drupal\config_pages\Entity\ConfigPages;
use Symfony\Component\Serializer\Serializer;

/**
 * Methods related to settings.
 */
class Settings {

  /**
   * The entity repository.
   *
   * @var \Drupal\Core\Entity\EntityRepositoryInterface
   */
  protected $entityRepository;

  /**
   * The serializer.
   *
   * @var \Symfony\Component\Serializer\Serializer
   */
  protected $serializer;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * The path matcher.
   *
   * @var \Drupal\Core\Path\PathMatcherInterface
   */
  protected $pathMatcher;

  /**
   * The module extension list.
   *
   * @var \Drupal\Core\Extension\ModuleExtensionList
   */
  protected $moduleExtensionList;

  /**
   * Creates an Settings object.
   *
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Symfony\Component\Serializer\Serializer $serializer
   *   The serializer.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\Core\Path\PathMatcherInterface $path_matcher
   *   The path matcher.
   * @param \Drupal\Core\Extension\ModuleExtensionList $extension_list_module
   *   The module extension list.
   */
  public function __construct(EntityRepositoryInterface $entity_repository, Serializer $serializer, LanguageManagerInterface $language_manager, PathMatcherInterface $path_matcher, ModuleExtensionList $extension_list_module) {
    $this->entityRepository = $entity_repository;
    $this->serializer = $serializer;
    $this->languageManager = $language_manager;
    $this->pathMatcher = $path_matcher;
    $this->moduleExtensionList = $extension_list_module;
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
    $this->moduleExtensionList->getExtensionInfo('pwa');
    // Packaging script will always provide the published module version.
    // Checking for NULL is only so maintainers have something
    // predictable to test against.
    $pwa_module_version = $pwa_module_info['version'] ?? '8.x-1.x-dev';

    return [
      'current_cache' => 'pwa-main-' . $pwa_module_version . '-v' . ($config->get('cache_version') ?: 1),
    ];
  }

}
