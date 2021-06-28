<?php

namespace Drupal\anu_lms;

use Drupal\Component\Utility\Html;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Path\PathValidatorInterface;
use Drupal\Core\Routing\CurrentRouteMatch;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;
use Drupal\group\Entity\GroupContent;
use Drupal\node\NodeInterface;
use Drupal\user\Entity\User;

// @TODO: Delete.
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



    return $items;
  }

  public function getSecondaryMenu() {
    $items = [];

    // If the current page is a node page and the current user has permissions
    // to edit it, show appropriate link.
    $node = $this->currentRouteMatch->getParameter('node');
    $url_options = ['language' => \Drupal::languageManager()->getCurrentLanguage()];

    if (!empty($node) && $node instanceof NodeInterface) {
      $node = \Drupal::service('entity.repository')
        ->getTranslationFromContext($node);

      // If the current user can update the node show appropriate link.
      if ($node->access('update')) {
        $names = [
          'course' => 'Edit course',
          'module' => 'Edit module',
          'module_lesson' => 'Edit lesson',
          'module_assessment' => 'Edit quiz',
        ];

        $this->addMenuItem($items, $names[$node->bundle()], $node->toUrl('edit-form', $url_options)->toString());
      }

      if ($node->bundle() == 'course') {
        $module_add_url = $this->getReferencedNodeAddLink($node, 'field_module_course', 'module');
        $this->addMenuItem($items, 'Add module', $module_add_url);
      }
      elseif ($node->bundle() == 'module') {
        // Add a link for adding a new lesson to the module.
        $lesson_add_url = $this->getReferencedNodeAddLink($node, 'field_module_lesson_module', 'module_lesson');
        $this->addMenuItem($items, 'Add lesson', $lesson_add_url);

        // Add a link for adding a new final quiz.
        $quiz = $node->get('field_module_assessment')->first();
        if (empty($quiz)) {
          $quiz_add_url = $this->getReferencedNodeAddLink($node, 'field_module_assessment_module', 'module_assessment');
          $this->addMenuItem($items, 'Add quiz', $quiz_add_url);
        }
      }

      if ($this->moduleHandler->moduleExists('anu_lms_assessments')) {
        if ($node->bundle() == 'module_assessment') {
          $assessment_results_url = Url::fromRoute('anu_lms_assessments.assessment.results', ['node' => $node->id()])
            ->toString();
          $this->addMenuItem($items, 'Results', $assessment_results_url);
        }
        elseif ($node->bundle() == 'module_lesson') {
          $assessment_results_url = Url::fromRoute('anu_lms_assessments.question.results', ['node' => $node->id()])
            ->toString();
          $this->addMenuItem($items, 'Results', $assessment_results_url);
        }
      }
    }

    // If permissions module is enabled, we add a new link to manage organizations.
    if ($this->moduleHandler->moduleExists('anu_lms_permissions')) {

      // Load groups user has access to (only admins or orgadmins).
      $groups = \Drupal::entityQuery('group')
        ->condition('type', 'anu_organization')
        ->execute();

      if (!empty($groups)) {
        $label = $this->formatPlural(count($groups), 'Organization', 'Organizations')->render();
        $this->addMenuItem($items, $label, Url::fromRoute('anu_lms_permissions.organization_list')->toString());
      }
    }

    return $items;
  }

  protected function addMenuItem(&$items, $menu_title, $menu_url) {
    // Validation checks access to the URL as well.
    if ($this->pathValidator->isValid($menu_url)) {
      $items[] = ['id' => HTML::getId($menu_title), 'title' => $this->t($menu_title), 'url' => $menu_url];
    }
  }

  /**
   * Returns URL to create a new node with reference to the source node
   *
   * @param $source_node
   *   Source node object (i.e. course or module)
   * @param $source_reference_field
   *   Field name that references from the target node to the source node.
   * @param $target_bundle
   *   Node type to create.
   *
   * @return \Drupal\Core\GeneratedUrl|string
   */
  protected function getReferencedNodeAddLink($source_node, $source_reference_field, $target_bundle) {
    if (!$this->moduleHandler->moduleExists('group_content')) {
      $query = ['edit[' . $source_reference_field . '][widget][0][target_id]' => $source_node->id()];
      $default_url = Url::fromRoute('node.add', ['node_type' => $target_bundle], ['query' => $query])->toString();

      // If groups node module is not installed - we can just generate a usual
      // node creation link.
      if (!$this->moduleHandler->moduleExists('gnode')) {
        return $default_url;
      }

      /** @var \Drupal\group\Entity\GroupContentInterface [] $group_content */
      $group_content = GroupContent::loadByEntity($source_node);
      if (empty($group_content)) {
        return $default_url;
      }

      $group_content = reset($group_content);
      $group = $group_content->getGroup();
      if (empty($group)) {
        return $default_url;
      }

      // Link to create a node & assign it to the group
      return Url::fromRoute('entity.group_content.create_form',
        ['group' => $group->id(), 'plugin_id' => 'group_node:' . $target_bundle],
        ['query' => $query]
      )->toString();
    }
  }

}
