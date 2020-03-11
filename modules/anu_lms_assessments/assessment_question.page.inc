<?php

/**
 * @file
 * Contains assessment_question.page.inc.
 *
 * Page callback for Question entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Question templates.
 *
 * Default template: assessment_question.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_assessment_question(array &$variables) {
  // Fetch AssessmentQuestion Entity Object.
  $assessment_question = $variables['elements']['#assessment_question'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
