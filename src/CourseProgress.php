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
    $modules = $course->get('field_course_module')->referencedEntities();
    $totalLessons = 0;
    $completedLessons = 0;
    foreach ($modules as $module) {

      /** @var \Drupal\node\NodeInterface[] $lessons */
      $lessons = $module->field_module_lessons->referencedEntities();
      foreach ($lessons as $lesson) {
        if ($lesson->access('view')) {
          $totalLessons++;
          if ($this->lesson->isCompleted($lesson)) {
            $completedLessons++;
          }
        }
      }
      if (!$module->field_module_assessment) {
        continue;
      }
      /** @var \Drupal\node\NodeInterface[] $quizzes */
      $quizzes = $module->field_module_assessment->referencedEntities();
      foreach ($quizzes as $quiz) {
        if ($quiz->access('view')) {
          $totalLessons++;
          if ($this->lesson->isCompleted($quiz)) {
            $completedLessons++;
          }
        }
      }
    }

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
  public function isLocked(NodeInterface $course, array $categories): bool {
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
      else {
        $progress = $this->getCourseProgress($previousCourse);
        if ($progress < 100) {
          return TRUE;
        }
      }
    }

    return FALSE;
  }

}
