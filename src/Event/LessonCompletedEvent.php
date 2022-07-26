<?php

namespace Drupal\anu_lms\Event;

use Drupal\Core\Session\AccountInterface;
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
   * The lesson node ID.
   *
   * @var int
   */
  protected int $lessonId;

  /**
   * Constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The account.
   * @param int $lesson_id
   *   The lesson ID.
   */
  public function __construct(AccountInterface $account, int $lesson_id) {
    $this->account = $account;
    $this->lessonId = $lesson_id;
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
   * @return int
   *   The lesson ID.
   */
  public function getLessonId(): int {
    return $this->lessonId;
  }

}
