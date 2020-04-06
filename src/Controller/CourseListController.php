<?php

namespace Drupal\anu_lms\Controller;

use Drupal\anu_lms\AnulmsMenuHandler;
use Drupal\anu_lms\Settings;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Serializer\Serializer;

/**
 * Class CourseListController.
 */
class CourseListController extends ControllerBase {

  protected $serializer;
  protected $entityRepository;
  protected $anulmsMenuHandler;
  protected $anulmsSettings;

  /**
   * Creates an NodeViewController object.
   *
   * @param \Drupal\anu_lms\AnulmsMenuHandler $anulmsMenuHandler
   *   Anu LMS menu handler.
   * @param \Drupal\anu_lms\Settings $anulmsSettings
   *   Anu LMS Settings service.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Symfony\Component\Serializer\Serializer $serializer
   *   The serializer.
   */
  public function __construct(AnulmsMenuHandler $anulmsMenuHandler, Settings $anulmsSettings, EntityRepositoryInterface $entity_repository = NULL, Serializer $serializer = NULL) {
    $this->serializer = $serializer;
    $this->entityRepository = $entity_repository;
    $this->anulmsMenuHandler = $anulmsMenuHandler;
    $this->anulmsSettings = $anulmsSettings;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('anu_lms.menu_handler'),
      $container->get('anu_lms.settings'),
      $container->get('entity.repository'),
      $container->get('serializer')
    );
  }

  public function build() {
    $courses = \Drupal::entityQuery('node')
      ->condition('type', 'course')
      ->condition('status', NodeInterface::PUBLISHED)
      ->sort('created')
      ->execute();

    if (!empty($courses)) {
      $courses = Node::loadMultiple($courses);
    }

    $normalizedCourses = [];
    foreach ($courses as $course) {
      $normalizedCourse = $this->normalizeNode($course);
      if (!empty($normalizedCourse)) {
        $normalizedCourses[] = $normalizedCourse;
      }
    }

    $build['#attached']['library'][] = 'anu_lms/application';
    $build['#attached']['library'][] = 'core/drupalSettings';
    $build['#attached']['drupalSettings']['anu_settings'] = $this->anulmsSettings->getSettings();
    $build['#attached']['drupalSettings']['anu_courses'] = $normalizedCourses;
    $build['#attached']['drupalSettings']['anu_menu'] = $this->anulmsMenuHandler->getMenu();
    $build['#attached']['drupalSettings']['pwa_settings'] = $this->anulmsSettings->getPwaSettings();

    $build['application'] = [
      '#type' => 'markup',
      '#markup' => '<div id="anu-lms"></div>',
    ];

    // Disable cache for this page. @todo can be improved using cache tags.
    $build['#cache']['max-age'] = 0;
    return $build;
  }

  protected function normalizeNode(EntityInterface $node) {

    // Default configurations.
    $context = [
      'max_depth' => 1,
      'settings' => [
        'node' => [
          'exclude_fields' => [
            'uid',
            'type',
            'changed',
            'vid',
            'revision_timestamp',
            'revision_uid',
            'revision_log',
            'revision_translation_affected',
            'promote',
            'sticky',
            'menu_link',
            'default_langcode',
            'langcode',
            'content_translation_source',
            'content_translation_outdated',
            'field_course_modules',
          ],
        ],
      ],
    ];

    // Double check entity access.
    if ($node->access('view')) {
      // Get translated version of the entity.
      $node = $this->entityRepository->getTranslationFromContext($node);

      // Normalize recursively given entity.
      return $this->serializer->normalize($node, 'json_recursive', $context);
    }

    return NULL;
  }
}
