<?php

namespace Drupal\anu_lms;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * AnuLmsContentType plugin manager.
 */
class AnuLmsContentTypePluginManager extends DefaultPluginManager {

  /**
   * Constructs AnuLmsContentTypePluginManager object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct(
      'Plugin/AnuLmsContentType',
      $namespaces,
      $module_handler,
      'Drupal\anu_lms\AnuLmsContentTypeInterface',
      'Drupal\anu_lms\Annotation\AnuLmsContentType'
    );
    $this->alterInfo('anu_lms_content_type_info');
    $this->setCacheBackend($cache_backend, 'anu_lms_content_type_plugins');
  }

}
