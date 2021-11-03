<?php

namespace Drupal\anu_lms;

use Drupal\Core\Database\Connection;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\NodeInterface;
use Psr\Log\LoggerInterface;

/**
 * Methods that operate with lessons.
 */
class Lesson {

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * Database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $database;

  /**
   * Current user object.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected $normalizer;

  /**
   * Logger object.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected $logger;

  /**
   * The Courses page service.
   *
   * @var \Drupal\anu_lms\CoursesPage
   */
  protected $coursesPage;

  /**
   * Course handler.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected $course;

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
   * @param \Drupal\anu_lms\CoursesPage $coursesPage
   *   The Courses page service.
   * @param \Drupal\anu_lms\Course $course
   *   The Course service.
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
    CoursesPage $coursesPage,
    Course $course
  ) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->database = $database;
    $this->currentUser = $current_user;
    $this->normalizer = $normalizer;
    $this->logger = $logger;
    $this->coursesPage = $coursesPage;
    $this->course = $course;
  }

  /**
   * Returns normalized data for Lesson page.
   *
   * @param \Drupal\node\NodeInterface $node
   *   Lesson node.
   *
   * @return array
   *   An array containing current node and referenced course.
   */
  public function getPageData(NodeInterface $node) {
    $lesson_course = $this->getLessonCourse($node);

    $normalized_courses_pages = [];
    if (!empty($lesson_course)) {
      $courses_pages = $this->coursesPage->getCoursesPagesByCourse($lesson_course);
      foreach ($courses_pages as $courses_page) {
        $normalized_courses_pages[] = [
          'courses_page' => $this->normalizer->normalizeEntity($courses_page, ['max_depth' => 1]),
        ];
      }
    }

    $data = [
      $node->bundle() => $this->normalizer->normalizeEntity($node, ['max_depth' => 4]),
      'course' => !empty($lesson_course) ? $this->normalizer->normalizeEntity($lesson_course, ['max_depth' => 2]) : NULL,
      'courses_pages_by_course' => empty($lesson_course) ? [] : [
        [
          'course_id' => $lesson_course->id(),
          'courses_pages' => $normalized_courses_pages,
        ],
      ],
    ];

    return $data;
  }

  /**
   * Returns Course entity for the lesson.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   Lesson node object.
   *
   * @return \Drupal\node\NodeInterface|null
   *   Loaded Course object.
   */
  public function getLessonCourse(NodeInterface $lesson) {
    if (empty($lesson)) {
      return NULL;
    }

    // Get statically cached course.
    $course_lessons = &drupal_static('anu_lms_lesson_course_lessons', []);
    if (!empty($course_lessons[$lesson->id()])) {
      $course_nid = $course_lessons[$lesson->id()];
      /** @var NodeInterface $course */
      $course = $this->nodeStorage->load($course_nid);
      return $course;
    }

    // Get lesson's module.
    $field_name = $lesson->bundle() === 'module_lesson' ? 'field_module_lessons' : 'field_module_assessment';
    $module_nids = \Drupal::entityQuery('paragraph')
      ->condition('type', 'course_modules')
      ->condition($field_name, $lesson->id())
      ->sort('created', 'DESC')
      ->range(0, 1)
      ->execute();

    if (empty($module_nids)) {
      return NULL;
    }

    // Get module's course.
    $course_nids = $this->nodeStorage->getQuery()
      ->condition('type', 'course')
      ->condition('field_course_module', reset($module_nids))
      ->accessCheck(FALSE)
      ->range(0, 1)
      ->execute();

    if (!empty($course_nids)) {
      // Load course node for the provided lesson.
      /** @var NodeInterface $course */
      $course = $this->nodeStorage->load(reset($course_nids));
      if (empty($course)) {
        return NULL;
      }

      // Load course navigation for sake of caching.
      // To avoid further db queries, we load the whole navigation
      // and cache references between lessons and courses here.
      $lessons = $this->course->getLessonsAndQuizzes($course);
      foreach ($lessons as $lesson) {
        $course_lessons[$lesson->id()] = $course->id();
      }

      return $course;
    }

    return NULL;
  }

  /**
   * Finds the previous lesson in the course navigation.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   Lesson node object.
   *
   * @return \Drupal\node\NodeInterface|null
   *   Previous lesson node object or NULL if not found.
   */
  public function getPreviousLesson(NodeInterface $lesson) {
    // If the lesson does not belong to a course, then we can't provide
    // the previous lesson.
    $course = $this->getLessonCourse($lesson);
    if (empty($course)) {
      return NULL;
    }

    // Load sequence of lessons and quizzes from the course and find the
    // previous entity.
    $previous_lesson = NULL;
    $nodes = $this->course->getLessonsAndQuizzes($course);
    foreach ($nodes as $node) {
      if ($node->id() == $lesson->id()) {
        break;
      }
      $previous_lesson = $node;
    }

    return $previous_lesson;
  }

  /**
   * Mark the previous course lesson as completed.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   Lesson node object.
   */
  public function setPreviousLessonCompleted(NodeInterface $lesson): void {
    // If linear progress is disabled for the course, then we don't set
    // completion flag for any lesson of that course.
    $course = $this->getLessonCourse($lesson);
    if (empty($course) || !$this->course->isLinearProgressEnabled($course)) {
      return;
    }

    // Get previous lesson or quiz from the course structure.
    $previous_lesson = $this->getPreviousLesson($lesson);

    // If no previous lesson - obviously, there's nothing to do here anymore.
    if (empty($previous_lesson)) {
      return;
    }

    // If the previous lesson still has restricted access, then we can't
    // mark it as completed. It's an edge case if someone tries to access
    // a URL directly without passing linear progress as expected.
    if ($this->isRestricted($previous_lesson)) {
      $this->logger->warning('User @uid tried to access the lesson with id @nid, but the previous lesson (id: @pnid) has restricted access.', [
        '@uid' => $this->currentUser->id(),
        '@nid' => $lesson->id(),
        '@pnid' => $previous_lesson->id(),
      ]);
      return;
    }

    // If user was able to get to the current lesson, then the previous
    // can be marked as completed. The only place how user can find URL
    // of the next lesson is when they click "Next" button, which assumes
    // that the lesson was fully completed.
    // Note that we complete only lessons with this - quizzes have their
    // own handler of completion when the quiz is submitted.
    if ($previous_lesson->bundle() == 'module_lesson') {
      $this->setCompleted($previous_lesson);
    }
  }

  /**
   * Marks the lesson as completed for the current user.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   Lesson node object.
   */
  public function setCompleted(NodeInterface $lesson): void {
    // We don't want to track progress for anonymous users.
    if ($this->currentUser->isAnonymous()) {
      return;
    }

    try {
      // Insert or ignore new record about the completion of the lesson.
      $this->database->merge('anu_lms_progress')
        ->keys([
          'uid' => $this->currentUser->id(),
          'nid' => $lesson->id(),
        ])
        ->fields([
          'uid' => $this->currentUser->id(),
          'nid' => $lesson->id(),
        ])
        ->execute();
    }
    catch (\Exception $exception) {
      $this->logger->error($exception->getMessage());
    }
  }

  /**
   * Checks if the current user completed the lesson.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   Lesson node object.
   *
   * @return bool
   *   Whether the lesson is completed by the current user.
   */
  public function isCompleted(NodeInterface $lesson): bool {
    // If linear progress is not enabled for the course or the lesson does not
    // belong to a course, then we don't show the completion progress.
    $course = $this->getLessonCourse($lesson);
    if (empty($course) || !$this->course->isLinearProgressEnabled($course)) {
      return FALSE;
    }

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

    // TODO: Don't forget about translations!
    return !empty($completed_lessons[$lesson->id()]);
  }

  /**
   * Checks if the current user can view the lesson.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   Lesson node object.
   *
   * @return bool
   *   Whether the lesson has restricted access for the current user.
   */
  public function isRestricted(NodeInterface $lesson): bool {
    // If linear progress is not enabled for the course or the lesson does not
    // belong to a course, then we don't restrict access to the lesson.
    $course = $this->getLessonCourse($lesson);
    if (empty($course) || !$this->course->isLinearProgressEnabled($course)) {
      return FALSE;
    }

    // If the current lesson is completed by the current user, then
    // obviously it can't be restricted. This covers an edge case when
    // new lessons were added after users have passed some lessons.
    if ($this->isCompleted($lesson)) {
      return FALSE;
    }

    // If previous lesson does not exist then it's the first lesson
    // and the access should always be given to the current lesson.
    // Also, if the previous lesson is completed, then the current lesson
    // can be accessed as well.
    $previous_lesson = $this->getPreviousLesson($lesson);
    if (empty($previous_lesson) || $this->isCompleted($previous_lesson)) {
      return FALSE;
    }

    return TRUE;
  }

}
