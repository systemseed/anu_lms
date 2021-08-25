<?php

namespace Drupal\anu_lms\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Class RouteSubscriber.
 *
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {

    // Add a little proxy for nodes to change the display of node entities
    // related to Anu LMS.
    if ($route = $collection->get('entity.node.canonical')) {
      $route->setDefault('_controller', '\Drupal\anu_lms\Controller\AnulmsNodeViewController::view');
    }
    if ($route = $collection->get('view.sort_courses.sort_page')) {
      $route->setOption('_admin_route', TRUE);
    }
  }

}
