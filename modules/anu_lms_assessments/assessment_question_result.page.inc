<?php

/**
 * @file
 * Contains assessment_question_result.page.inc.
 *
 * Page callback for Assessment question result entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Assessment question result templates.
 *
 * Default template: assessment_question_result.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_assessment_question_result(array &$variables) {
  // Fetch AssessmentQuestionResult Entity Object.
  $assessment_question_result = $variables['elements']['#assessment_question_result'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
