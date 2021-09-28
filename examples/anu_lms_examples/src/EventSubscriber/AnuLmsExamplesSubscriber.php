<?php

namespace Drupal\anu_lms_examples\EventSubscriber;

use Drupal\Core\Messenger\MessengerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\anu_lms\Event\CoursesPageDataGeneratedEvent;

/**
 * Anu LMS Examples event subscriber.
 */
class AnuLmsExamplesSubscriber implements EventSubscriberInterface {

  /**
   * The messenger.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * Constructs event subscriber.
   *
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger.
   */
  public function __construct(MessengerInterface $messenger) {
    $this->messenger = $messenger;
  }

  /**
   * Event handler.
   *
   * @param \Drupal\anu_lms\Event\CoursesPageDataGeneratedEvent $event
   *   Response event.
   */
  public function onDataGenerated(CoursesPageDataGeneratedEvent $event) {
    $data = $event->getPageData();
    $node = $event->getNode();
    $data['additional-example-data'] = 'test';
    $this->messenger->addStatus('Data was generated for "' . $node->label() . '": ' . count($data['courses']) . ' courses');
    $event->setPageData($data);
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      'anu_lms_courses_page_data_generated' => ['onDataGenerated'],
    ];
  }

}
