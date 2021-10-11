<?php

namespace Drupal\anu_lms\Plugin\AnuLmsContentType;

use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\node\NodeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\anu_lms\Lesson;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

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
    // If a user got to the current lesson, it means that
    // they hit "Next" button on the previous lesson and so
    // we can call the previous lesson completed.
    $this->lesson->setPreviousLessonCompleted($node);
    // If after setting the previous lesson a completed state the
    // current lesson still has restricted access, it means that
    // something went wrong with doing that and the user should not
    // be able to see the current page.
    if ($this->lesson->isRestricted($node)) {
      throw new AccessDeniedHttpException();
    }

    // Get data for viewed lesson.
    return $this->lesson->getPageData($node);
  }

}
