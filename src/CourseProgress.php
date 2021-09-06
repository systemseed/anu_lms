<?php

namespace Drupal\anu_lms;

use Drupal\node\NodeInterface;
use Drupal\Core\Url;

/**
 * Group together progress-related methods.
 */
class CourseProgress {

  /**
   * The course service.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected $course;

  /**
   * The lesson service.
   *
   * @var \Drupal\anu_lms\Lesson
   */
  protected $lesson;

  /**
   * The courses page service.
   *
   * @var \Drupal\anu_lms\CoursesPage
   */
  protected $coursesPage;

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
   * Returns progress in a course.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course object.
   *
   * @return float
   *   The progress as a percentage like 33.34.
   */
  public function getCourseProgress(NodeInterface $course) {
    $totalLessons = $this->course->countLessons($course) + $this->course->countQuizzes($course);
    $completedLessons = count($this->getCompletedLessons($course)) + count($this->getCompletedQuizzes($course));

    // Calculate percentage.
    if ($totalLessons > 0) {
      $progress = round($completedLessons * 100 / $totalLessons, 2);
    }
    else {
      $progress = 0;
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
      $progress = $this->getCourseProgress($previousCourse);
      if ($progress < 100 && !$requireAllCategoriesLocked) {
        return TRUE;
      }
      if ($progress < 100 && $requireAllCategoriesLocked) {
        $lockedCategories[] = $category;
      }
    }
    if ($requireAllCategoriesLocked && count($categories) === count($lockedCategories)) {
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
  public function getCompletedLessons(NodeInterface $course) {
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
