<?php

namespace Drupal\anu_lms;

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
    $lessons = $this->course->getLessonsAndQuizzes($course);
    $previous_lesson_id = 0;
    foreach ($lessons as $index => $lesson) {
      $nextLesson = !empty($lessons[$index + 1]) ? $lessons[$index + 1]->id() : 0;
      $progress[$lesson->id()] = [
        'prev' => $previous_lesson_id,
        'next' => $nextLesson,
        'completed' => (int) $this->lesson->isCompleted($lesson),
        'restricted' => (int) $this->lesson->isRestricted($lesson),
      ];

      $previous_lesson_id = $lesson->id();
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

      $isCompleted = true;
      $progress = $this->getCourseProgress($previousCourse);
      foreach ($progress as $lesson) {
        if (!$lesson['completed']) {
          $isCompleted = false;
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
