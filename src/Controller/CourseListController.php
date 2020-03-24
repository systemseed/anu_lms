<?php

namespace Drupal\anu_lms\Controller;

use Drupal\anu_lms\AnulmsMenuHandler;
use Drupal\config_pages\Entity\ConfigPages;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Serializer\Serializer;

/**
 * Class CourseListController.
 */
class CourseListController extends ControllerBase {

  protected $serializer;
  protected $entityRepository;
  protected $anulmsMenuHandler;

  /**
   * Creates an NodeViewController object.
   *
   * @param \Drupal\anu_lms\AnulmsMenuHandler $anulmsMenuHandler
   *   Anu LMS menu handler.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Symfony\Component\Serializer\Serializer $serializer
   *   The serializer.
   */
  public function __construct(AnulmsMenuHandler $anulmsMenuHandler, EntityRepositoryInterface $entity_repository = NULL, Serializer $serializer = NULL) {
    $this->serializer = $serializer;
    $this->entityRepository = $entity_repository;
    $this->anulmsMenuHandler = $anulmsMenuHandler;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('anu_lms.menu_handler'),
      $container->get('entity.repository'),
      $container->get('serializer')
    );
  }

  public function build() {
    // @todo: include access check into the query.
    $courses = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties([
      'type' => 'course',
      'status' => 1,
    ]);

    $normalizedCourses = [];
    foreach ($courses as $course) {
      $normalizedCourse = $this->normalizeNode($course);
      if (!empty($normalizedCourse)) {
        $normalizedCourses[] = $normalizedCourse;
      }
    }

    $build['#attached']['library'][] = 'anu_lms/application';
    $build['#attached']['library'][] = 'core/drupalSettings';
    $build['#attached']['drupalSettings']['anu_settings'] = $this->getAnuSettings();
    $build['#attached']['drupalSettings']['anu_courses'] = $normalizedCourses;
    $build['#attached']['drupalSettings']['anu_menu'] = $this->anulmsMenuHandler->getMenu();

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

  protected function getAnuSettings() {
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
    $entity = ConfigPages::config('anu_lms_settings');
    // Get translated version of the entity.
    $entity = $this->entityRepository->getTranslationFromContext($entity);
    return $this->serializer->normalize($entity, 'json_recursive', $context);
  }
}
