<?php

namespace Drupal\anu_lms_permissions\Controller;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\group\Entity\Group;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Page callbacks for orgation pages.
 */
class OrganizationListController {

  use StringTranslationTrait;

  /**
   * Build the page.
   */
  public function build() {
    $groups = $this->getAvailableGroups();

    // If a user has access only to 1 group, then redirect.
    if (count($groups) == 1) {
      $group_id = array_shift($groups);
      $group = Group::load($group_id);
      return new RedirectResponse($group->toUrl()->toString());
    }

    $blocks['groups'] = [
      'title' => $this->t('Organizations'),
      'content' => [
        '#theme' => 'admin_block_content',
      ],
    ];

    foreach ($groups as $group_id) {
      $group = Group::load($group_id);
      if ($group->access('view')) {
        $blocks['groups']['content']['#content'][] = [
          'title' => $group->label(),
          'url' => $group->toUrl(),
          'description' => $this->t('View and manage %group', ['%group' => $group->label()]),
        ];
      }
    }

    return [
      '#theme' => 'admin_page',
      '#blocks' => $blocks,
    ];
  }

  /**
   * Access callback.
   */
  public function access() {
    $groups = $this->getAvailableGroups();
    return !empty($groups) ? AccessResult::allowed() : AccessResult::forbidden();
  }

  /**
   * Helper method to fetch all anu organizations.
   */
  protected function getAvailableGroups() {
    // Load groups user has access to (only admins or orgadmins).
    return \Drupal::entityQuery('group')
      ->condition('type', 'anu_organization')
      ->execute();
  }

}
