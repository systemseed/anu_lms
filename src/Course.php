<?php

namespace Drupal\anu_lms;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\NodeInterface;
use Drupal\Core\Url;

/**
 * Methods that operate with course nodes.
 */
class Course {

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
  }

  /**
   * Load the first lesson of the course the current user has access to.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\node\NodeInterface|bool
   *   Lesson or Quiz node object.
   */
  public function getFirstAccessibleLesson(NodeInterface $course) {
    $modules = $course->get('field_course_module')->referencedEntities();
    foreach ($modules as $module) {

      /** @var \Drupal\node\NodeInterface[] $lessons */
      $lessons = $module->field_module_lessons->referencedEntities();
      foreach ($lessons as $lesson) {
        if ($lesson->access('view')) {
          return $lesson;
        }
      }

      if (!$module->field_module_assessment) {
        continue;
      }
      /** @var \Drupal\node\NodeInterface[] $quizzes */
      $quizzes = $module->field_module_assessment->referencedEntities();
      foreach ($quizzes as $quiz) {
        if ($quiz->access('view')) {
          return $quiz;
        }
      }
    }

    return FALSE;
  }

  /**
   * Returns course navigation (lessons and quizzes).
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\node\NodeInterface[]
   *   Flat list of lessons and quizzes.
   */
  public function getLessonsAndQuizzes(NodeInterface $course) {
    $nodes = &drupal_static('anu_lms_course_lessons', []);
    if (!empty($nodes[$course->id()])) {
      return $nodes[$course->id()];
    }

    // Get course modules.
    $modules = $course->get('field_course_module')->referencedEntities();
    foreach ($modules as $module) {

      // Get module's lessons.
      /** @var \Drupal\node\NodeInterface[] $lessons */
      $lessons = $module->field_module_lessons->referencedEntities();
      foreach ($lessons as $lesson) {
        $nodes[$course->id()][] = $lesson;
      }

      // Get module's quiz.
      if (!$module->field_module_assessment) {
        continue;
      }
      /** @var \Drupal\node\NodeInterface[] $quizzes */
      $quizzes = $module->field_module_assessment->referencedEntities();
      foreach ($quizzes as $quiz) {
        $nodes[$course->id()][] = $quiz;
      }
    }

    return $nodes[$course->id()];
  }

  /**
   * Returns status of linear progress enabling.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return bool
   *   Whether linear progress is enabled for the given course.
   */
  public function isLinearProgressEnabled(NodeInterface $course): bool {
    return (bool) $course->get('field_course_linear_progress')->getString();
  }

  /**
   * Returns the url to redirect when a user finishes a course.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\Core\Url
   *   Url object for redirect.
   */
  public function getFinishRedirectUrl(NodeInterface $course) {
    $uri = $course->field_course_finish_button->uri;
    if (!empty($uri)) {
      return Url::fromUri($uri);
    }
    return Url::fromRoute('<front>');
  }

  /**
   * Returns the text for the finish button in the last lesson of a course.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\Core\Url
   *   Url object for redirect.
   */
  public function getFinishText(NodeInterface $course) {
    return $course->field_course_finish_button->title;
  }

  /**
   * Returns the number of accesible lessons.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return int
   *   Number of quizzes and lessons.
   */
  public function countLessons(NodeInterface $course) {
    return count($this->getLessons($course));
  }

  /**
   * Returns the number of accesible quizzes.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return int
   *   Number of quizzes.
   */
  public function countQuizzes(NodeInterface $course) {
    return count($this->getQuizzes($course));
  }

  /**
   * Returns the accesible lessons.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\node\NodeInterface[]
   *   Lessons in the course.
   */
  public function getLessons(NodeInterface $course) {
    $modules = $course->get('field_course_module')->referencedEntities();
    $lessonsInCourse = [];

    foreach ($modules as $module) {

      /** @var \Drupal\node\NodeInterface[] $lessons */
      $lessons = $module->field_module_lessons->referencedEntities();
      foreach ($lessons as $lesson) {
        if ($lesson->access('view')) {
          $lessonsInCourse[] = $lesson;
        }
      }
    }
    return $lessonsInCourse;
  }

  /**
   * Returns the accesible quizzes.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\node\NodeInterface[]
   *   Quizzes in the course.
   */
  public function getQuizzes(NodeInterface $course) {
    $modules = $course->get('field_course_module')->referencedEntities();
    $quizzesInCourse = [];

    foreach ($modules as $module) {

      if (!$module->field_module_assessment) {
        continue;
      }
      /** @var \Drupal\node\NodeInterface[] $quizzes */
      $quizzes = $module->field_module_assessment->referencedEntities();
      foreach ($quizzes as $quiz) {
        if ($quiz->access('view')) {
          $quizzesInCourse[] = $quiz;
        }
      }
    }
    return $quizzesInCourse;
  }

  /**
   * Returns urls of course's lessons and quizzes.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return array
   *   List of urls.
   */
  public function getLessonsAndQuizzesUrls(NodeInterface $course) {
    $modules = $course->get('field_course_module')->referencedEntities();
    $urls = [];

    foreach ($modules as $module) {
      $lesson_ids = array_column($module->field_module_lessons->getValue(), 'target_id');
      foreach ($lesson_ids as $nid) {
        $urls[] = Url::fromRoute('entity.node.canonical', ['node' => $nid], ['absolute' => TRUE])->toString();
      }

      if (!$module->field_module_assessment) {
        continue;
      }
      $quiz_ids = array_column($module->field_module_assessment->getValue(), 'target_id');
      foreach ($quiz_ids as $nid) {
        $urls[] = Url::fromRoute('entity.node.canonical', ['node' => $nid], ['absolute' => TRUE])->toString();
      }
    }

    return $urls;
  }

}
