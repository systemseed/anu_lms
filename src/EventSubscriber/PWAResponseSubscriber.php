<?php

namespace Drupal\anu_lms\EventSubscriber;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Url;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Response event subscriber to inject custom service worker scripts.
 */
class PWAResponseSubscriber implements EventSubscriberInterface {

  /**
   * Entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * Module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected ModuleHandlerInterface $moduleHandler;

  /**
   * PWAResponseSubscriber constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   Entity type manager.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   Module handler.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, ModuleHandlerInterface $module_handler) {
    $this->entityTypeManager = $entity_type_manager;
    $this->moduleHandler = $module_handler;
  }

  /**
   * Handles the onKernelResponse event.
   */
  public function onKernelResponse(ResponseEvent $event) {
    if (!$event->isMasterRequest()) {
      return;
    }

    $request = $event->getRequest();

    if ($request->getPathInfo() !== '/serviceworker-pwa') {
      return;
    }

    $response = $event->getResponse();
    $content = $response->getContent();

    // Service workers don't have access to window or localStorage objects.
    // To pass settings to custom Anu service worker, we inject "drupalSettings"
    // variable in global service worker scope.
    $import_sw_scripts = [
      Url::fromRoute('anu_lms.service_worker_settings')->toString(),
    ];

    // Allow other modules to alter custom Service Worker scripts.
    // When PWA module provides this capability, this code can be deprecated.
    $this->moduleHandler->alter('anu_lms_sw_scripts', $import_sw_scripts);

    $injected_script = '"use strict";';
    foreach ($import_sw_scripts as $script) {
      $injected_script .= "\r\n";
      $injected_script .= "importScripts('$script');";
    }
    // Custom scripts are injected at the top of the PWA service worker code
    // to give other modules a chance to register specific routes before they
    // are handled by default behaviour.
    $content = str_replace('"use strict";', $injected_script, $content);
    $response->setContent($content);
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      KernelEvents::RESPONSE => ['onKernelResponse', 10],
    ];
  }

}
