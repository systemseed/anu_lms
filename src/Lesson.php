<?php

namespace Drupal\anu_lms;

use Drupal\Core\Extension\ModuleHandlerInterface;
use Psr\Log\LoggerInterface;
use Drupal\anu_lms\Event\LessonCompletedEvent;
use Drupal\Component\Datetime\TimeInterface;
use Drupal\Core\Database\Connection;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\NodeInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Methods that operate with lessons.
 */
class Lesson {

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected EntityStorageInterface $nodeStorage;

  /**
   * Database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected Connection $database;

  /**
   * Current user object.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected AccountProxyInterface $currentUser;

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected Normalizer $normalizer;

  /**
   * Logger object.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected LoggerInterface $logger;

  /**
   * Course handler.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected Course $course;

  /**
   * The event dispatcher.
   *
   * @var \Symfony\Component\EventDispatcher\EventDispatcherInterface
   */
  protected EventDispatcherInterface $dispatcher;

  /**
   * The time service.
   *
   * @var \Drupal\Component\Datetime\TimeInterface
   */
  protected TimeInterface $time;

  /**
   * The module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected ModuleHandlerInterface $moduleHandler;

  /**
   * Lesson constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Database\Connection $database
   *   Database connection object.
   * @param \Drupal\Core\Session\AccountProxyInterface $current_user
   *   Current user object.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer handler.
   * @param \Psr\Log\LoggerInterface $logger
   *   Logger object.
   * @param \Drupal\anu_lms\Course $course
   *   The Course service.
   * @param \Symfony\Component\EventDispatcher\EventDispatcherInterface $dispatcher
   *   The event dispatcher.
   * @param \Drupal\Component\Datetime\TimeInterface $time
   *   The time service.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler service.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    Connection $database,
    AccountProxyInterface $current_user,
    Normalizer $normalizer,
    LoggerInterface $logger,
    Course $course,
    EventDispatcherInterface $dispatcher,
    TimeInterface $time,
    ModuleHandlerInterface $module_handler
  ) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->database = $database;
    $this->currentUser = $current_user;
    $this->normalizer = $normalizer;
    $this->logger = $logger;
    $this->course = $course;
    $this->dispatcher = $dispatcher;
    $this->time = $time;
    $this->moduleHandler = $module_handler;
  }

  /**
   * Returns module id of a lesson.
   *
   * @param int $lesson_id
   *   Lesson node ID.
   *
   * @return int|null
   *   Module's ID or NULL if the lesson is orphaned.
   */
  public function getLessonModule(int $lesson_id): ?int {
    // Get lesson's modules.
    $query = \Drupal::entityQuery('paragraph');
    $query->condition('type', 'course_modules');

    if ($this->moduleHandler->moduleExists('anu_lms_assessments')) {
      $query->condition($query->orConditionGroup()
        ->condition('field_module_lessons', $lesson_id)
        ->condition('field_module_assessment', $lesson_id)
      );
    }
    else {
      $query->condition('field_module_lessons', $lesson_id);
    }

    $module_ids = $query
      ->sort('created', 'DESC')
      ->range(0, 1)
      ->execute();

    return !empty($module_ids) ? reset($module_ids) : NULL;
  }

  /**
   * Returns Course entity for the lesson.
   *
   * @param int $lesson_id
   *   Lesson node ID.
   *
   * @return \Drupal\node\NodeInterface|null
   *   Loaded Course object.
   */
  public function getLessonCourse(int $lesson_id): ?NodeInterface {
    // Get statically cached course.
    $course_lessons = &drupal_static('anu_lms_lesson_course_lessons', []);
    if (!empty($course_lessons[$lesson_id])) {
      $course_nid = $course_lessons[$lesson_id];
      /** @var \Drupal\node\NodeInterface $course */
      $course = $this->nodeStorage->load($course_nid);
      return $course;
    }

    // First, find a module referencing the lesson.
    $module_id = $this->getLessonModule($lesson_id);
    if (empty($module_id)) {
      return NULL;
    }

    // Find a course referencing the module.
    $course_nids = $this->nodeStorage->getQuery()
      ->condition('type', 'course')
      ->condition('field_course_module', $module_id)
      ->accessCheck(FALSE)
      ->range(0, 1)
      ->execute();

    if (!empty($course_nids)) {
      // Load course node for the provided lesson.
      /** @var \Drupal\node\NodeInterface $course */
      $course = $this->nodeStorage->load(reset($course_nids));
      if (empty($course)) {
        return NULL;
      }

      // Load course navigation for sake of caching.
      // To avoid further db queries, we load the whole navigation
      // and cache references between lessons and courses here.
      $lesson_ids = $this->course->getLessonsAndQuizzes($course);
      foreach ($lesson_ids as $lesson_id) {
        $course_lessons[$lesson_id] = $course->id();
      }

      return $course;
    }

    return NULL;
  }

  /**
   * Finds the previous lesson in the course navigation.
   *
   * @param int $lesson_id
   *   Lesson node object.
   *
   * @return int|null
   *   Previous lesson node ID or NULL if not found.
   */
  public function getPreviousLessonId(int $lesson_id): ?int {
    // If the lesson does not belong to a course, then we can't provide
    // the previous lesson.
    $course = $this->getLessonCourse($lesson_id);

    // Load sequence of lessons and quizzes from the course and find the
    // previous entity.
    $previous_lesson_id = NULL;
    $course_lesson_ids = $this->course->getLessonsAndQuizzes($course);
    foreach ($course_lesson_ids as $course_lesson_id) {
      if ($lesson_id == $course_lesson_id) {
        break;
      }
      $previous_lesson_id = $course_lesson_id;
    }

    return $previous_lesson_id;
  }

  /**
   * Marks the lesson as completed for the current user.
   *
   * @param int $lesson_id
   *   Lesson node ID.
   */
  public function setCompleted(int $lesson_id): void {
    // We don't want to track progress for anonymous users.
    if ($this->currentUser->isAnonymous()) {
      return;
    }

    try {
      // Initialize static cache if it is empty.
      $completed_lessons = &drupal_static('anu_lms_lesson_is_completed');
      if (!isset($completed_lessons)) {
        $result = $this->database->select('anu_lms_progress')
          ->fields('anu_lms_progress', ['nid'])
          ->condition('uid', $this->currentUser->id())
          ->execute();

        $completed_lessons = [];
        foreach ($result as $item) {
          $completed_lessons[$item->nid] = $item->nid;
        }
      }

      // Insert or ignore new record about the completion of the lesson.
      $this->database->merge('anu_lms_progress')
        ->keys([
          'uid' => $this->currentUser->id(),
          'nid' => $lesson_id,
        ])
        ->insertFields([
          'uid' => $this->currentUser->id(),
          'nid' => $lesson_id,
          'created' => $this->time->getCurrentTime(),
          'changed' => $this->time->getCurrentTime(),
        ])
        ->updateFields([
          'changed' => $this->time->getCurrentTime(),
        ])
        ->execute();

      // Update static cache to make sure that all subsequent requests
      // have info about the completion of this lesson.
      $completed_lessons[$lesson_id] = $lesson_id;

      $event = new LessonCompletedEvent($this->currentUser, $lesson_id);
      $this->dispatcher->dispatch(LessonCompletedEvent::EVENT_NAME, $event);
    }
    catch (\Exception $exception) {
      $this->logger->error($exception->getMessage());
    }
  }

  /**
   * Checks if the current user completed the lesson.
   *
   * @param int $lesson_id
   *   Lesson node ID.
   *
   * @return bool
   *   Whether the lesson is completed by the current user.
   */
  public function isCompleted(int $lesson_id): bool {
    return $this->isCompletedByUser($lesson_id, $this->currentUser->id());
  }

  /**
   * Checks if the given user id completed the lesson.
   *
   * @param int $lesson_id
   *   Lesson node ID.
   * @param int $userId
   *   User ID.
   *
   * @return bool
   *   Whether the lesson is completed by the current user.
   */
  public function isCompletedByUser(int $lesson_id, int $userId): bool {
    // If linear progress is not enabled for the course or the lesson does not
    // belong to a course, then we don't show the completion progress.
    $course = $this->getLessonCourse($lesson_id);
    if (empty($course) || !$this->course->isLinearProgressEnabled($course)) {
      return FALSE;
    }

    $completed_lessons = &drupal_static('anu_lms_lesson_is_completed');
    if (!isset($completed_lessons)) {
      $result = $this->database->select('anu_lms_progress')
        ->fields('anu_lms_progress', ['nid'])
        ->condition('uid', $userId)
        ->execute();

      $completed_lessons = [];
      foreach ($result as $item) {
        $completed_lessons[$item->nid] = $item->nid;
      }
    }

    // @todo Don't forget about translations!
    return !empty($completed_lessons[$lesson_id]);
  }

  /**
   * Checks if the current user can view the lesson.
   *
   * @param int $lesson_id
   *   Lesson node object.
   *
   * @return bool
   *   Whether the lesson has restricted access for the current user.
   */
  public function isRestricted(int $lesson_id): bool {
    // If linear progress is not enabled for the course or the lesson does not
    // belong to a course, then we don't restrict access to the lesson.
    $course = $this->getLessonCourse($lesson_id);
    if (empty($course) || !$this->course->isLinearProgressEnabled($course)) {
      return FALSE;
    }

    // If the current lesson is completed by the current user, then
    // obviously it can't be restricted. This covers an edge case when
    // new lessons were added after users have passed some lessons.
    if ($this->isCompleted($lesson_id)) {
      return FALSE;
    }

    // If previous lesson does not exist then it's the first lesson
    // and the access should always be given to the current lesson.
    // Also, if the previous lesson is completed, then the current lesson
    // can be accessed as well.
    $previous_lesson_id = $this->getPreviousLessonId($lesson_id);
    if (empty($previous_lesson_id) || $this->isCompleted($previous_lesson_id)) {
      return FALSE;
    }

    return TRUE;
  }

}
