<?php

namespace Drupal\anu_lms\Plugin\AnuLmsContentType;

use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\node\NodeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\anu_lms\CoursesPage as CoursesPageService;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation for the courses_page.
 *
 * @AnuLmsContentType(
 *   id = "courses_page",
 *   label = @Translation("Courses Page"),
 *   description = @Translation("Handle courses page content..")
 * )
 */
class CoursesPage extends AnuLmsContentTypePluginBase implements ContainerFactoryPluginInterface {

  /**
   * The Courses page service.
   *
   * @var \Drupal\anu_lms\CoursesPage
   */
  protected $coursesPage;

  /**
   * Create an instance of the plugin.
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('anu_lms.courses_page')
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
   * @param \Drupal\anu_lms\CoursesPage $coursesPage
   *   The CoursesPageService.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, CoursesPageService $coursesPage) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->coursesPage = $coursesPage;
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
    // Get courses page data.
    // Includes normalized current node and list of referenced courses.
    return $this->coursesPage->getCoursesPageData($node);
  }

  /**
   * {@inheritdoc}
   */
  public function getAttachments() {
    return [
      'library' => ['anu_lms/courses'],
    ];
  }

}
