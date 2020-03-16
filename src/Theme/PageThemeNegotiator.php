<?php

namespace Drupal\anu_lms\Theme;

use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Theme\ThemeNegotiatorInterface;
use Drupal\node\NodeInterface;

/**
 * Sets the selected theme on specified pages.
 */
class PageThemeNegotiator implements ThemeNegotiatorInterface {

  /**
   * Returns empty theme for module's specific pages.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match object.
   *
   * @return bool
   *   TRUE if this negotiator should be used or FALSE to let other negotiators
   *   decide.
   */
  public function applies(RouteMatchInterface $route_match) {
    global $theme;

    $default_theme = 'stable';
    $lms_node_types = ['course', 'module', 'module_lesson', 'module_assessment'];

    if ($route_match->getRouteName() == 'anu_lms.course_list_controller') {
      $theme = $default_theme;
      return TRUE;
    }
    elseif ($route_match->getRouteName() == 'entity.node.canonical') {
      $params = $route_match->getParameters();
      $node = $params->get('node');
      if ($node && $node instanceof NodeInterface && in_array($node->bundle(), $lms_node_types)) {
        $theme = $default_theme;
        return TRUE;
      }
    }

    return FALSE;
  }

  /**
   * Determine the active theme for the request.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match object.
   *
   * @return string|null
   *   The name of the theme, or NULL if other negotiators, like the configured
   *   default one, should be used instead.
   */
  public function determineActiveTheme(RouteMatchInterface $route_match) {
    // Get theme to apply on page.
    global $theme;
    // Return the actual theme name.
    return $theme;
  }

}
