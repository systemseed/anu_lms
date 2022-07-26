<?php

namespace Drupal\anu_lms;

use Drupal\Core\Url;
use Drupal\node\NodeInterface;

/**
 * Group together progress-related methods.
 */
class CourseProgress {

  /**
   * The course service.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected Course $course;

  /**
   * The lesson service.
   *
   * @var \Drupal\anu_lms\Lesson
   */
  protected Lesson $lesson;

  /**
   * The courses page service.
   *
   * @var \Drupal\anu_lms\CoursesPage
   */
  protected CoursesPage $coursesPage;

  /**
   * Constructs service.
   *
   * @param \Drupal\anu_lms\Course $course
   *   The course service.
   * @param \Drupal\anu_lms\Lesson $lesson
   *   The lesson service.
   * @param \Drupal\anu_lms\CoursesPage $coursesPage
   *   The courses page service.
   */
  public function __construct(Course $course, Lesson $lesson, CoursesPage $coursesPage) {
    $this->course = $course;
    $this->lesson = $lesson;
    $this->coursesPage = $coursesPage;
  }

  /**
   * Returns progress data in a course.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course object.
   *
   * @return array
   *   Array of lesson progress data in client localStorage format.
   */
  public function getCourseProgress(NodeInterface $course) {
    $progress = [];
    $lesson_ids = $this->course->getLessonsAndQuizzes($course);
    $previous_lesson_id = 0;
    foreach ($lesson_ids as $index => $lesson_id) {
      $next_lesson_id = !empty($lesson_ids[$index + 1]) ? $lesson_ids[$index + 1] : 0;
      $progress[$lesson_id] = [
        // We can't rely on object keys order in Javascript, so we attach
        // prev/next pointers to each lesson.
        'prev' => $previous_lesson_id,
        'next' => $next_lesson_id,
        'completed' => (int) $this->lesson->isCompleted($lesson_id),
        'restricted' => (int) $this->lesson->isRestricted($lesson_id),
        'url' => (new Url('entity.node.canonical', ['node' => $lesson_id]))->toString(),
      ];

      $previous_lesson_id = $lesson_id;
    }

    return $progress;
  }

  /**
   * Returns lock status for this course.
   *
   * A course can be locked because courses previous
   * to the current one are not completed.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   * @param array $categories
   *   The context categories.
   * @param bool $requireAllCategoriesLocked
   *   To consider the course locked, it should be locked for all categories.
   *
   * @return bool
   *   Whether the given course is locked.
   */
  public function isLocked(NodeInterface $course, array $categories, $requireAllCategoriesLocked = FALSE): bool {
    $lockedCategories = [];
    foreach ($categories as $category) {
      if (!$category->field_enable_course_sequence->value) {
        continue;
      }
      $courses = $this->coursesPage->getCoursesByCategories([$category->id()]);

      // Position of the current course.
      $key = array_search($course, $courses, TRUE);

      // The course is not in this category.
      if ($key === FALSE) {
        continue;
      }

      // Search for the previous course in the sequence.
      reset($courses);
      while (key($courses) !== $key) {
        next($courses);
      }
      $previousCourse = prev($courses);

      // The first course in the sequence.
      if ($previousCourse === FALSE) {
        continue;
      }

      $isCompleted = TRUE;
      $progress = $this->getCourseProgress($previousCourse);
      foreach ($progress as $lesson) {
        if (!$lesson['completed']) {
          $isCompleted = FALSE;
          break;
        }
      }

      if (!$isCompleted && !$requireAllCategoriesLocked) {
        return TRUE;
      }
      if (!$isCompleted && $requireAllCategoriesLocked) {
        $lockedCategories[] = $category;
      }
    }
    if ($requireAllCategoriesLocked && $lockedCategories && count($categories) === count($lockedCategories)) {
      return TRUE;
    }

    return FALSE;
  }

  /**
   * Returns completed lessons in a course.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\node\NodeInterface[]
   *   Array of completed lessons.
   */
  public function getCompletedLessons(NodeInterface $course): array {
    return array_filter(
      $this->course->getLessons($course),
      [$this->lesson, 'isCompleted']
    );
  }

  /**
   * Returns completed quizzes in a course.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\node\NodeInterface[]
   *   Array of completed quizzes.
   */
  public function getCompletedQuizzes(NodeInterface $course) {
    return array_filter(
      $this->course->getQuizzes($course),
      [$this->lesson, 'isCompleted']
    );
  }

}
