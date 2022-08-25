<?php

namespace Drupal\anu_lms;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Extension\ModuleHandlerInterface;

/**
 * Methods related to settings.
 */
class Settings {

  /**
   * The module extension list.
   *
   * @var \Drupal\Core\Extension\ModuleExtensionList
   */
  protected ModuleExtensionList $moduleExtensionList;

  /**
   * The module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected ModuleHandlerInterface $moduleHandler;

  /**
   * The config factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected ConfigFactoryInterface $configFactory;

  /**
   * Creates Settings object.
   *
   * @param \Drupal\Core\Extension\ModuleExtensionList $extension_list_module
   *   The module extension list.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler service.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   */
  public function __construct(ModuleExtensionList $extension_list_module, ModuleHandlerInterface $module_handler, ConfigFactoryInterface $config_factory) {
    $this->moduleExtensionList = $extension_list_module;
    $this->moduleHandler = $module_handler;
    $this->configFactory = $config_factory;
  }

  /**
   * Returns normalized settings entity.
   */
  public function getSettings(): array {
    // At the moment there are no settings for ANU LMS.
    return [];
  }

  /**
   * Returns boolean whether the offline mode can be supported.
   *
   * @return bool
   *   Boolean indicating whether the offline mode is supported.
   */
  public function isOfflineSupported(): bool {
    return $this->moduleHandler->moduleExists('pwa');
  }

  /**
   * Returns Pwa settings.
   *
   * Code from /pwa/src/Controller/PWAController.php:151
   */
  public function getPwaSettings(): ?array {
    if (!$this->isOfflineSupported()) {
      return NULL;
    }

    // Get module configuration.
    $config = $this->configFactory->get('pwa.config');

    // Look up module release from package info.
    $pwa_module_info = $this->moduleExtensionList->getExtensionInfo('pwa');
    // Packaging script will always provide the published module version.
    // Checking for NULL is only so maintainers have something
    // predictable to test against.
    $pwa_module_version = $pwa_module_info['version'] ?? '8.x-1.x-dev';

    return [
      'current_cache' => 'pwa-main-' . $pwa_module_version . '-v' . ($config->get('cache_version') ?: 1),
    ];
  }

}
