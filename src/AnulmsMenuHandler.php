<?php

namespace Drupal\anu_lms;

use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Path\PathValidatorInterface;
use Drupal\Core\Routing\CurrentRouteMatch;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;
use Drupal\group\Entity\Group;
use Drupal\node\NodeInterface;
use Drupal\user\Entity\User;

class AnulmsMenuHandler {

  use StringTranslationTrait;

  protected $pathValidator;
  protected $currentUser;
  protected $currentRouteMatch;
  protected $moduleHandler;

  public function __construct(PathValidatorInterface $pathValidator, AccountProxyInterface $currentUser, CurrentRouteMatch $currentRouteMatch, ModuleHandlerInterface $moduleHandler) {
    $this->pathValidator = $pathValidator;
    $this->currentUser = $currentUser;
    $this->currentRouteMatch = $currentRouteMatch;
    $this->moduleHandler = $moduleHandler;
  }

  public function getMenu() {
    return [
      'primary' => $this->getPrimaryMenu(),
      'secondary' => $this->getSecondaryMenu(),
    ];
  }

  public function getPrimaryMenu() {
    $items = [];

    $this->addMenuItem($items, 'Home', '/');

    // Add the link to the courses page only in case if the home page url is not
    // set to have the same url as courses list page.
    $homepage_url = \Drupal::configFactory()->get('system.site')->get('page.front');
    $course_list_url = Url::fromRoute('anu_lms.course_list_controller')->toString();
    if ($homepage_url != $course_list_url) {
      $this->addMenuItem($items, 'Courses', $course_list_url);
    }

    return $items;
  }

  public function getSecondaryMenu() {
    $items = [];

    // If the current page is a node page and the current user has permissions
    // to edit it, show appropriate link.
    $node = $this->currentRouteMatch->getParameter('node');
    if (!empty($node) && $node instanceof NodeInterface && $node->access('update')) {
      $this->addMenuItem($items, 'Edit page', $node->toUrl('edit-form')->toString());
    }

    // If permissions module is enabled, we add a new link to manage organizations.
    if ($this->moduleHandler->moduleExists('anu_lms_permissions')) {

      // Load groups user has access to (only admins or orgadmins).
      $groups = \Drupal::entityQuery('group')
        ->condition('type', 'anu_organization')
        ->execute();

      if (!empty($groups)) {
        $label = $this->formatPlural(count($groups), 'Organization', 'Organizations');
        $this->addMenuItem($items, $label, Url::fromRoute('anu_lms_permissions.organization_list')->toString());
      }
    }

    // Menu for authenticated user.
    if ($this->currentUser->isAuthenticated()) {
      $user = User::load($this->currentUser->id());
      $this->addMenuItem($items, 'Profile', $user->toUrl('edit-form')->toString());

      $user_logout_url = Url::fromRoute('user.logout')->toString();
      $this->addMenuItem($items, 'Logout', $user_logout_url);
    }
    // Menu for anonymous user.
    else {
      $user_login_url = Url::fromRoute('user.login')->toString();
      $this->addMenuItem($items, 'Login', $user_login_url);
    }

    return $items;
  }

  protected function addMenuItem(&$items, $menu_title, $menu_url) {
    if ($this->pathValidator->isValid($menu_url)) {
      $items[] = ['title' => $menu_title, 'url' => $menu_url];
    }
  }

}
