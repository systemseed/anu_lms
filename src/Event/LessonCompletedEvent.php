<?php

namespace Drupal\anu_lms\Event;

use Drupal\Core\Session\AccountInterface;
use Symfony\Component\EventDispatcher\Event;
use Drupal\Core\Entity\EntityInterface;

/**
 * Event that is fired when the Lesson is completed by the user.
 */
class LessonCompletedEvent extends Event {

  const EVENT_NAME = 'anu_lms.lesson_completed';

  /**
   * The user who completed lesson.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $account;

  /**
   * The lesson node.
   *
   * @var \Drupal\Core\Entity\EntityInterface
   */
  protected $lesson;

  /**
   * Constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The account.
   * @param \Drupal\Core\Entity\EntityInterface $lesson
   *   The lesson.
   */
  public function __construct(AccountInterface $account, EntityInterface $lesson) {
    $this->account = $account;
    $this->lesson = $lesson;
  }

  /**
   * Gets the user for which to restrict access.
   *
   * @return \Drupal\Core\Session\AccountInterface
   *   The user.
   */
  public function getAccount() {
    return $this->account;
  }

  /**
   * Gets the lesson.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   The lesson.
   */
  public function getLesson() {
    return $this->lesson;
  }

}
