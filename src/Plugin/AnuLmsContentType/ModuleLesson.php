<?php

namespace Drupal\anu_lms\Plugin\AnuLmsContentType;

use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\node\NodeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\anu_lms\Lesson;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation for the module_lesson.
 *
 * @AnuLmsContentType(
 *   id = "module_lesson",
 *   label = @Translation("Module lesson"),
 *   description = @Translation("Handle lesson content.")
 * )
 */
class ModuleLesson extends AnuLmsContentTypePluginBase implements ContainerFactoryPluginInterface {

  /**
   * The Lesson service.
   *
   * @var \Drupal\anu_lms\Lesson
   */
  protected $lesson;

  /**
   * Create an instance of the plugin.
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('anu_lms.lesson')
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
   * @param \Drupal\anu_lms\Lesson $lesson
   *   The Lesson service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, Lesson $lesson) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->lesson = $lesson;
  }

  /**
   * Get data for this node.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The courses page node.
   */
  public function getData(NodeInterface $node) {
    // Get data for viewed lesson.
    return $this->lesson->getPageData($node);
  }

}
