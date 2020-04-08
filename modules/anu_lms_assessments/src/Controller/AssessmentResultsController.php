<?php

namespace Drupal\anu_lms_assessments\Controller;

use Drupal\anu_lms_assessments\Entity\AssessmentResultInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;


class AssessmentResultsController extends ControllerBase {

  public function resultsPageTitle(NodeInterface $node) {
    return t('Completed quizzes for %assessment', ['%assessment' => $node->label() ]);
  }

  public function resultsPage(NodeInterface $node) {
    $build = [];
    $build['assessment_results'] = [
      '#type' => 'view',
      '#name' => 'assessments_results',
      '#display_id' => 'assessments_results_embed',
      '#arguments' => [$node->id()],
      '#embed' => TRUE,
    ];

    return $build;
  }

  public function resultPageTitle(NodeInterface $node, AssessmentResultInterface $assessment_result) {
    $author = $assessment_result->getOwner()->getDisplayName();
    return t('Question responses from %username', ['%username' => $author]);
  }

  public function resultPage(NodeInterface $node, AssessmentResultInterface $assessment_result) {
    $build = [];
    $build['assessment_results'] = [
      '#type' => 'view',
      '#name' => 'assessments_question_responses',
      '#display_id' => 'assessment_results_embed',
      '#arguments' => [$assessment_result->id()],
      '#embed' => TRUE,
    ];

    return $build;
  }

  public function checkAccess(NodeInterface $node, AccountInterface $account) {
    if (empty($node) || $node->bundle() !== 'module_assessment') {
      return AccessResult::forbidden();
    }

    // TODO: Separate access to view the results?
    return AccessResult::allowedIfHasPermission($account, 'administer assessment question result entities');
  }

}
