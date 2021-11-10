<?php

namespace Drupal\anu_lms_assessments\Controller;

use Drupal\anu_lms_assessments\Entity\AssessmentResultInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;

/**
 * Logic for result pages.
 */
class AssessmentResultsController extends ControllerBase {

  /**
   * Title callback for results page.
   */
  public function resultsPageTitle(NodeInterface $node) {
    return $this->t('Completed quizzes for %assessment', ['%assessment' => $node->label()]);
  }

  /**
   * Display the assessment_results view.
   */
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

  /**
   * Title callback for individual result page.
   */
  public function resultPageTitle(NodeInterface $node, AssessmentResultInterface $assessment_result) {
    $author = $assessment_result->getOwner()->getDisplayName();
    return $this->t('Question responses from %username', ['%username' => $author]);
  }

  /**
   * Display the assessment_question_responses view.
   */
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

  /**
   * Access callback.
   */
  public function checkAccess(NodeInterface $node, AccountInterface $account) {

    // The route is valid only for lesson nodes.
    if (empty($node) || $node->bundle() !== 'module_assessment') {
      return AccessResult::forbidden();
    }

    // If the current user can create / update the lesson, then they should be
    // able to see the responses to the questions.
    if ($node->access('update')) {
      return AccessResult::allowed();
    }

    return AccessResult::forbidden();
  }

}
