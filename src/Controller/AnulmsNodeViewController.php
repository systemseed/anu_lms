<?php

namespace Drupal\anu_lms\Controller;
use Drupal\anu_lms\AnulmsMenuHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Controller\NodeViewController;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Serializer\Serializer;

class AnulmsNodeViewController extends NodeViewController {

  protected $serializer;
  protected $anulmsMenuHandler;

  /**
   * Creates an NodeViewController object.
   *
   * @param \Drupal\anu_lms\AnulmsMenuHandler $anulmsMenuHandler
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
  public function __construct(AnulmsMenuHandler $anulmsMenuHandler, EntityTypeManagerInterface $entity_type_manager, RendererInterface $renderer, AccountInterface $current_user = NULL, EntityRepositoryInterface $entity_repository = NULL, Serializer $serializer = NULL) {
    parent::__construct($entity_type_manager, $renderer, $current_user, $entity_repository);
    $this->anulmsMenuHandler = $anulmsMenuHandler;
    $this->serializer = $serializer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('anu_lms.menu_handler'),
      $container->get('entity_type.manager'),
      $container->get('renderer'),
      $container->get('current_user'),
      $container->get('entity.repository'),
      $container->get('serializer')
    );
  }

  public function view(EntityInterface $node, $view_mode = 'full', $langcode = NULL) {
    // Modify the output only for node types we're responsible for,
    if (!in_array($node->bundle(), ['course', 'module', 'module_lesson', 'module_assessment'])) {
      return parent::view($node, $view_mode, $langcode);
    }

    $context = ['max_depth' => 2];
    if ($node->bundle() == 'module_lesson' || $node->bundle() == 'module_assessment') {
      $context = [
        'max_depth' => 4,
        'settings' => [
          'node' => [
            'exclude_fields' => ['field_course_modules']
          ]
        ]
      ];
    }

    $build['#attached']['library'][] = 'anu_lms/application';
    $build['#attached']['library'][] = 'core/drupalSettings';
    $build['#attached']['drupalSettings']['node'] = $this->normalizeNode($node, $context);
    $build['#attached']['drupalSettings']['anu_menu'] = $this->anulmsMenuHandler->getMenu();

    $build['application'] = [
      '#type' => 'markup',
      '#markup' => '<div id="anu-lms"></div>',
    ];

    return $build;
  }

  protected function normalizeNode(EntityInterface $node, array $context = []) {

    // Default configurations.
    $default_context = [
      'max_depth' => 4,
      'settings' => [
        'user' => [
          'exclude_fields' => [
            'access', 'login', 'init', 'mail', 'name', 'roles', 'created', 'changed', 'preferred_langcode', 'preferred_admin_langcode', 'timezone', 'default_langcode', 'langcode', 'role_change',
          ],
        ],
        'node' => [
          'exclude_fields' => [
            'uid', 'type', 'changed', 'vid', 'revision_timestamp', 'revision_uid', 'revision_log', 'revision_translation_affected', 'promote', 'sticky', 'menu_link', 'default_langcode', 'langcode', 'content_translation_source', 'content_translation_outdated',
          ],
        ],
        'paragraph' => [
          'exclude_fields' => [
            'revision_id', 'revision_translation_affected', 'created', 'parent_id', 'parent_type', 'parent_field_name', 'behavior_settings', 'default_langcode', 'langcode',
          ],
        ],
        'taxonomy_term' => [
          'exclude_fields' => [
            'revision_created', 'revision_user', 'revision_log_message', 'description', 'weight', 'parent', 'changed', 'revision_translation_affected', 'path', 'default_langcode', 'langcode', 'content_translation_source', 'content_translation_outdated', 'content_translation_uid', 'content_translation_created',
          ],
        ],
      ],
    ];

    $context = array_merge($default_context, $context);

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
