<?php

namespace Drupal\anu_lms\Event;

use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;
use Symfony\Contracts\EventDispatcher\Event;

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
  protected AccountInterface $account;

  /**
   * The lesson node.
   *
   * @var \Drupal\node\NodeInterface
   */
  protected NodeInterface $lesson;

  /**
   * Constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The account.
   * @param \Drupal\node\NodeInterface $lesson
   *   The lesson.
   */
  public function __construct(AccountInterface $account, NodeInterface $lesson) {
    $this->account = $account;
    $this->lesson = $lesson;
  }

  /**
   * Gets the user.
   *
   * @return \Drupal\Core\Session\AccountInterface
   *   The user.
   */
  public function getAccount(): AccountInterface {
    return $this->account;
  }

  /**
   * Gets the lesson.
   *
   * @return \Drupal\node\NodeInterface
   *   The lesson.
   */
  public function getLesson(): NodeInterface {
    return $this->lesson;
  }

}
