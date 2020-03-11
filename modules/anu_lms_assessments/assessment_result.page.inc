<?php

/**
 * @file
 * Contains assessment_result.page.inc.
 *
 * Page callback for Assessment result entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Assessment result templates.
 *
 * Default template: assessment_result.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_assessment_result(array &$variables) {
  // Fetch AssessmentResult Entity Object.
  $assessment_result = $variables['elements']['#assessment_result'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
