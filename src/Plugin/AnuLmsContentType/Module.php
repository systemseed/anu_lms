<?php

namespace Drupal\anu_lms\Plugin\AnuLmsContentType;

use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\anu_lms\Normalizer;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation for the module [LEGACY].
 *
 * @AnuLmsContentType(
 *   id = "module",
 *   label = @Translation("Module [LEGACY]"),
 *   description = @Translation("Handle module content.")
 * )
 */
class Module extends AnuLmsContentTypePluginBase implements ContainerFactoryPluginInterface {

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected $normalizer;

  /**
   * Create an instance of the plugin.
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('anu_lms.normalizer')
    );
  }

  /**
   * Construct the plugin.
   *
   * @param array $configuration
   *   Plugin configuration.
   * @param string $plugin_id
   *   Plugin id.
   * @param mixed $plugin_definition
   *   Plugin definition.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, Normalizer $normalizer) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->normalizer = $normalizer;
  }

  /**
   * Get data for this node.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The courses page node.
   * @param string $langcode
   *   The language for the data.
   */
  public function getData(NodeInterface $node, $langcode = NULL) {
    // Get data for viewed node.
    $context = ['max_depth' => 2];
    return $this->normalizer->normalizeEntity($node, $context);
  }

}
