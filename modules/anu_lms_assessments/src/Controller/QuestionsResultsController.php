<?php

namespace Drupal\anu_lms_assessments\Controller;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;

/**
 * Page callback for question result routes.
 */
class QuestionsResultsController extends ControllerBase {

  /**
   * Title callack.
   */
  public function resultsPageTitle(NodeInterface $node) {
    return $this->t('Responses to questions for %lesson', ['%lesson' => $node->label()]);
  }

  /**
   * Page with results.
   */
  public function resultsPage(NodeInterface $node) {
    $build = [];

    // Load questions from the lesson content.
    // @todo Test for empty node.
    /** @var \Drupal\paragraphs\ParagraphInterface[] $paragraphs */
    $sections = $node->get('field_module_lesson_content')->referencedEntities();
    $question_ids = [];
    foreach ($sections as $section) {
      $paragraphs = $section->get('field_lesson_section_content')->referencedEntities();
      foreach ($paragraphs as $paragraph) {
        if (strpos($paragraph->bundle(), 'question_') !== FALSE) {
          $question_ids[] = $paragraph->get('field_question')->getString();
        }
      }
    }

    $build['lesson_questions_responses'] = [
      '#type' => 'view',
      '#name' => 'lesson_questions_responses',
      '#display_id' => 'lesson_questions_responses_embed',
    // Nid needs for generating download link.
      '#arguments' => [implode('+', $question_ids), $node->id()],
      '#embed' => TRUE,
    ];

    return $build;
  }

  /**
   * Access callback.
   */
  public function checkAccess(NodeInterface $node, AccountInterface $account) {

    // The route is valid only for lesson nodes.
    if (empty($node) || $node->bundle() !== 'module_lesson') {
      return AccessResult::forbidden();
    }

    $sections = $node->get('field_module_lesson_content')->referencedEntities();
    $has_questions = FALSE;
    foreach ($sections as $section) {
      $paragraphs = $section->get('field_lesson_section_content')->referencedEntities();
      foreach ($paragraphs as $paragraph) {
        if (strpos($paragraph->bundle(), 'question_') !== FALSE) {
          $has_questions = TRUE;
          break;
        }
      }
    }

    if (!$has_questions) {
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
