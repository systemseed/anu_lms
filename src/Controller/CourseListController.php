<?php

namespace Drupal\anu_lms\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Serializer\Serializer;

/**
 * Class CourseListController.
 */
class CourseListController extends ControllerBase {

  protected $serializer;
  protected $entityRepository;

  /**
   * Creates an NodeViewController object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer service.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user. For backwards compatibility this is optional, however
   *   this will be removed before Drupal 9.0.0.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Symfony\Component\Serializer\Serializer $serializer
   *   The serializer.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, RendererInterface $renderer, AccountInterface $current_user = NULL, EntityRepositoryInterface $entity_repository = NULL, Serializer $serializer = NULL) {

    $this->serializer = $serializer;
    $this->entityRepository = $entity_repository;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('renderer'),
      $container->get('current_user'),
      $container->get('entity.repository'),
      $container->get('serializer')
    );
  }

  public function build() {
    $build['#attached']['library'][] = 'core/drupalSettings';

    $courses = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties([
      'type' => 'course',
      'status' => 1,
    ]);

    $normalizedCourses = [];
    foreach ($courses as $course) {
      $normalizedCourses[] = $this->normalizeNode($course);
    }

    $build['#attached']['drupalSettings']['courses'] = $normalizedCourses;

    $build['#attached']['library'][] = 'anu_lms/application';

    $build['application'] = [
      '#type' => 'markup',
      '#markup' => '<div id="anu-lms"></div>',
    ];

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
