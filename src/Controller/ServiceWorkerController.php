<?php

namespace Drupal\anu_lms\Controller;

use Drupal\anu_lms\Settings;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Cache\CacheableResponse;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Anu service worker settings controller.
 */
class ServiceWorkerController extends ControllerBase {

  /**
   * Anu LMS settings.
   *
   * @var \Drupal\anu_lms\Settings
   */
  protected Settings $settings;

  /**
   * Creates ServiceWorkerController.
   *
   * @param \Drupal\anu_lms\Settings $settings
   *   Anu settings service.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   Module handler service.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   Config factory.
   */
  public function __construct(Settings $settings, ModuleHandlerInterface $module_handler, ConfigFactoryInterface $config_factory) {
    $this->settings = $settings;
    $this->moduleHandler = $module_handler;
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('anu_lms.settings'),
      $container->get('module_handler'),
      $container->get('config.factory'),
    );
  }

  /**
   * Exposes some Drupal settings to service worker global scope.
   */
  public function settings(): CacheableResponse {
    $data = [];
    $cache_metadata = new CacheableMetadata();
    $pwa = $this->settings->getPwaSettings();

    if ($pwa) {
      $data = array_merge($data, $pwa);

      // Invalidate this page cache on any PWA settings change.
      if ($config = $this->configFactory->get('pwa.config')) {
        $cache_metadata->addCacheableDependency($config);
      }
    }

    // Allow other modules to alter custom Service Worker settings.
    $this->moduleHandler->alter('anu_lms_sw_settings', $data, $cache_metadata);

    $json = json_encode($data, JSON_UNESCAPED_SLASHES);
    $js = "self.drupalSettings = $json";
    $response = new CacheableResponse($js, 200, [
      'Content-Type' => 'application/javascript',
    ]);

    $response->addCacheableDependency($cache_metadata);
    return $response;
  }

}
