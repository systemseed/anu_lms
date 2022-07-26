<?php

namespace Drupal\anu_lms\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\anu_lms\AnuLmsContentTypePluginManager;
use Drupal\anu_lms\Settings;
use Drupal\node\Controller\NodeViewController;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Overrides default node view controller for ANU LMS content types.
 */
class AnulmsNodeViewController extends NodeViewController {

  use StringTranslationTrait;

  /**
   * AnuLMS settings service.
   *
   * @var \Drupal\anu_lms\Settings
   */
  protected Settings $settings;

  /**
   * The plugin manager.
   *
   * @var \Drupal\anu_lms\AnuLmsContentTypePluginManager
   */
  protected AnuLmsContentTypePluginManager $contentTypePluginManager;

  /**
   * Creates a NodeViewController object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer service.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Drupal\anu_lms\Settings $settings
   *   Anu LMS Settings service.
   * @param \Drupal\anu_lms\AnuLmsContentTypePluginManager $contentTypePluginManager
   *   The plugin manager.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    RendererInterface $renderer,
    AccountInterface $current_user,
    EntityRepositoryInterface $entity_repository,
    Settings $settings,
    AnuLmsContentTypePluginManager $contentTypePluginManager
  ) {
    parent::__construct($entity_type_manager, $renderer, $current_user, $entity_repository);
    $this->settings = $settings;
    $this->contentTypePluginManager = $contentTypePluginManager;
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
      $container->get('anu_lms.settings'),
      $container->get('plugin.manager.anu_lms_content_type')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function view(EntityInterface $node, $view_mode = 'full', $langcode = NULL) {
    /** @var \Drupal\node\NodeInterface $node */
    $node_type = $node->bundle();

    // Modify the output only for node types the module is responsible for.
    if (!$this->contentTypePluginManager->hasDefinition($node_type)) {
      return parent::view($node, $view_mode, $langcode);
    }
    $plugin = $this->contentTypePluginManager->createInstance($node_type);

    $data = [];
    // Attaches node data.
    $data['data'] = $plugin->getData($node, $langcode);

    if ($data['data'] instanceof RedirectResponse || isset($data['data']['#markup'])) {
      return $data['data'];
    }

    // Attaches general site settings.
    $data['settings'] = $this->settings->getSettings();

    // You can use `jQuery('#anu-application').data('application')`
    // in the browser console for debug.
    $build['application'] = [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#attributes' => [
        'id' => 'anu-application',
        'data-application' => Json::encode($data),
      ],
    ];
    $build['#attached'] = $plugin->getAttachments();

    // Attach PWA cache version.
    if ($this->settings->isOfflineSupported()) {
      $build['#attached']['drupalSettings']['pwa_settings'] = $this->settings->getPwaSettings();
    }

    // Disable cache for this page. @todo can be improved using cache tags.
    $build['#cache']['max-age'] = 0;
    return $build;
  }

}
