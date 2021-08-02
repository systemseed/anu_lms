<?php

namespace Drupal\anu_lms_permissions\Routing;

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

    // Add a little proxy for groups to change the display of group entities
    // related to Anu LMS.
    if ($route = $collection->get('entity.group.canonical')) {
      $defaults = $route->getDefaults();
      unset($defaults['_entity_view']);
      $defaults['_controller'] = '\Drupal\anu_lms_permissions\Controller\AnulmsGroupViewController::view';
      $route->setDefaults($defaults);
    }
  }

}
