<?php

namespace Drupal\anu_lms_permissions\Controller;

use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;
use Drupal\group\Entity\GroupInterface;

/**
 * Page responses for the group pages.
 */
class AnulmsGroupViewController {

  use StringTranslationTrait;

  /**
   * Build the page.
   */
  public function view(GroupInterface $group) {
    // If group bundle is not defined within this module, then leave the render
    // to defaults.
    if ($group->bundle() !== 'anu_organization') {
      $render_controller = \Drupal::entityTypeManager()->getViewBuilder($group->getEntityTypeId());
      return $render_controller->view($group, 'full');
    }

    $content_links = [
      [
        'title' => $this->t('View all content'),
        'description' => $this->t('View all content available within the organization.'),
        'url' => Url::fromRoute('view.group_nodes.page_1', ['group' => $group->id()]),
      ],
      [
        'title' => $this->t('Create a new course'),
        'description' => $this->t('Create a new course within the organization.'),
        'url' => Url::fromRoute('entity.group_content.create_form', [
          'group' => $group->id(),
          'plugin_id' => 'group_node:course',
        ]),
      ],
    ];

    $blocks['content'] = [
      'title' => $this->t('Content'),
      'content' => [
        '#theme' => 'admin_block_content',
      ],
    ];

    foreach ($content_links as $link) {
      if ($link['url']->access()) {
        $blocks['content']['content']['#content'][] = $link;
      }
    }

    $blocks['membership'] = [
      'title' => $this->t('Membership'),
      'content' => [
        '#theme' => 'admin_block_content',
      ],
    ];

    $user_links = [
      [
        'title' => $this->t('View all members'),
        'description' => $this->t('View all users within the organization.'),
        'url' => Url::fromRoute('view.group_members.page_1', ['group' => $group->id()]),
      ],
      [
        'title' => $this->t('Add a new user to the organization'),
        'description' => $this->t('Create a new user in the system and attache them to the organization.'),
        'url' => Url::fromRoute('entity.group_content.create_form', [
          'group' => $group->id(),
          'plugin_id' => 'group_membership',
        ]),
      ],
      [
        'title' => $this->t('Add existing user to the organization'),
        'description' => $this->t('Attach already existing user to the organization.'),
        'url' => Url::fromRoute('entity.group_content.add_form', [
          'group' => $group->id(),
          'plugin_id' => 'group_membership',
        ]),
      ],
    ];

    foreach ($user_links as $link) {
      if ($link['url']->access()) {
        $blocks['membership']['content']['#content'][] = $link;
      }
    }

    return [
      '#theme' => 'admin_page',
      '#blocks' => $blocks,
    ];
  }

}
