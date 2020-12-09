<?php

namespace Drupal\anu_lms;

use Drupal\Core\Url;
use Drupal\Core\Path\PathMatcherInterface;
use Drupal\config_pages\Entity\ConfigPages;
use Symfony\Component\Serializer\Serializer;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Language\LanguageManagerInterface;

/**
 * Settings service.
 */
class Settings {

  protected $entityRepository;
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
   */
  public function __construct(EntityRepositoryInterface $entity_repository, Serializer $serializer, LanguageManagerInterface $language_manager, PathMatcherInterface $path_matcher) {
    $this->entityRepository = $entity_repository;
    $this->serializer = $serializer;
    $this->languageManager = $language_manager;
    $this->pathMatcher = $path_matcher;
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

  /**
   * Returns Site Language settings.
   */
  public function getLanguageSettings() {
    // @todo: replace with actual type.
    $type = 'language_interface';
    $route_name = $this->pathMatcher->isFrontPage() ? '<front>' : '<current>';
    $links = $this->languageManager->getLanguageSwitchLinks($type, Url::fromRoute($route_name));

    // Get current langcode.
    $current_langcode = $this->languageManager->getCurrentLanguage($type)->getId();

    $output = [
      'current_language' => $current_langcode,
      'links' => [],
    ];

    if (empty($links) || empty($links->links)) {
      return $output;
    }

    foreach ($links->links as $langcode => $link) {
      if (empty($link['url']) || empty($link['title']) || empty($link['language'])) {
        continue;
      }

      /** @var \Drupal\Core\Url $url */
      $url = $link['url'];
      $url->setOptions($link);

      // Prepare link.
      $output['links'][$langcode] = [
        'url' => $url->toString(),
        'title' => $link['title'],
        'weight' => $link['language']->getWeight(),
        'is_main' => isset($link['is_main']) ? $link['is_main'] : FALSE,
      ];
    }

    return $output;
  }

}
