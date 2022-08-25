<?php

namespace Drupal\anu_lms;

use Drupal\Core\Database\Connection;
use Drupal\node\NodeInterface;
use Drupal\Core\Url;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Entity\EntityStorageInterface;

/**
 * Methods that operate with course nodes.
 */
class Course {

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected EntityStorageInterface $nodeStorage;

  /**
   * The paragraph storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected EntityStorageInterface $paragraphStorage;

  /**
   * The file url generator.
   *
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected FileUrlGeneratorInterface $fileUrlGenerator;

  /**
   * The entity repository service.
   *
   * @var \Drupal\Core\Entity\EntityRepositoryInterface
   */
  protected EntityRepositoryInterface $entityRepository;

  /**
   * Database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected Connection $database;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_url_generator
   *   The file url generator.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Drupal\Core\Database\Connection $database
   *   Database connection object.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, FileUrlGeneratorInterface $file_url_generator, EntityRepositoryInterface $entity_repository, Connection $database) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->paragraphStorage = $entity_type_manager->getStorage('paragraph');
    $this->fileUrlGenerator = $file_url_generator;
    $this->entityRepository = $entity_repository;
    $this->database = $database;
  }

  /**
   * Load the first lesson of the course the current user has access to.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return \Drupal\node\NodeInterface|null
   *   Lesson or Quiz node object.
   */
  public function getFirstAccessibleLesson(NodeInterface $course): ?NodeInterface {
    $modules = $course->get('field_course_module')->getValue();
    foreach ($modules as $module) {
      $module_paragraph = $this->paragraphStorage->load($module['target_id']);

      // Make sure that the paragraph was successfully loaded.
      if (empty($module_paragraph)) {
        continue;
      }

      /** @var \Drupal\node\NodeInterface[] $lessons */
      $lessons = $module_paragraph->get('field_module_lessons')->getValue();
      foreach ($lessons as $lesson) {
        /** @var \Drupal\node\NodeInterface $lesson_node */
        $lesson_node = $this->nodeStorage->load($lesson['target_id']);
        if ($lesson_node && $lesson_node->access('view')) {
          return $lesson_node;
        }
      }

      // Ensure that the field with assessment exists, given that it's a part of
      // submodule anu_lms_assessments.
      if (!$module_paragraph->hasField('field_module_assessment')) {
        continue;
      }
      /** @var \Drupal\node\NodeInterface[] $quizzes */
      $quizzes = $module_paragraph->get('field_module_assessment')->getValue();
      foreach ($quizzes as $quiz) {
        /** @var \Drupal\node\NodeInterface $quiz_node */
        $quiz_node = $this->nodeStorage->load($quiz['target_id']);
        if ($quiz_node && $quiz_node->access('view')) {
          return $quiz_node;
        }
      }
    }

    return NULL;
  }

  /**
   * Returns course navigation (lessons and quizzes).
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return array
   *   Flat list of lessons and quizzes.
   */
  public function getLessonsAndQuizzes(NodeInterface $course): array {
    $nodes = &drupal_static('anu_lms_course_lessons', []);
    if (!empty($nodes[$course->id()])) {
      return $nodes[$course->id()];
    }

    // Initialize list of lessons and quizzes for the current course.
    $nodes[$course->id()] = [];

    // Get course modules.
    /** @var \Drupal\paragraphs\ParagraphInterface[] $modules */
    $modules = $course->get('field_course_module')->referencedEntities();
    foreach ($modules as $module) {
      $lesson_values = $module->get('field_module_lessons')->getValue();
      foreach ($lesson_values as $lesson_value) {
        $nodes[$course->id()][] = $lesson_value['target_id'];
      }

      // Ensure anu_lms_assessments module is enabled.
      if (!$module->hasField('field_module_assessment')) {
        continue;
      }

      $quiz_values = $module->get('field_module_assessment')->getValue();
      foreach ($quiz_values as $quiz_value) {
        $nodes[$course->id()][] = $quiz_value['target_id'];
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
   * @param \Drupal\node\NodeInterface|null $course
   *   Course node object.
   *
   * @return \Drupal\Core\Url
   *   Url object for redirect.
   */
  public function getFinishRedirectUrl(?NodeInterface $course): Url {
    $redirect = Url::fromRoute('<front>');

    if (empty($course)) {
      return $redirect;
    }

    $uri = $course->field_course_finish_button->uri;
    if (!empty($uri)) {
      return Url::fromUri($uri);
    }

    return $redirect;
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
  public function countLessons(NodeInterface $course): int {
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
  public function countQuizzes(NodeInterface $course): int {
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
  public function getLessons(NodeInterface $course): array {
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
  public function getQuizzes(NodeInterface $course): array {
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
   * Returns urls of course's lessons and quizzes for offline download.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return array
   *   List of urls.
   */
  public function getLessonsAndQuizzesUrls(NodeInterface $course): array {
    $modules = $course->get('field_course_module')->referencedEntities();
    $urls = [];

    foreach ($modules as $module) {
      /** @var \Drupal\node\NodeInterface[] $lessons */
      $lessons = $module->field_module_lessons->referencedEntities();
      foreach ($lessons as $lesson) {
        if ($lesson->access('view')) {
          $lesson = $this->entityRepository->getTranslationFromContext($lesson);
          $urls[] = $lesson->toUrl('canonical')->toString();
        }
      }

      if (!$module->field_module_assessment) {
        continue;
      }
      /** @var \Drupal\node\NodeInterface[] $quizzes */
      $quizzes = $module->field_module_assessment->referencedEntities();
      foreach ($quizzes as $quiz) {
        if ($quiz->access('view')) {
          $quiz = $this->entityRepository->getTranslationFromContext($quiz);
          $urls[] = $quiz->toUrl('canonical')->toString();
        }
      }
    }

    // Attach course finish URL.
    $urls[] = $this->getFinishRedirectUrl($course)->setAbsolute()->toString();

    return $urls;
  }

  /**
   * Returns the accessible audios.
   *
   * @param \Drupal\node\NodeInterface $course
   *   Course node object.
   *
   * @return string[]
   *   Audio URLs.
   */
  public function getAudios(NodeInterface $course): array {
    $lesson_ids = [];
    foreach ($this->getLessons($course) as $lesson) {
      $lesson_ids[] = $lesson->id();
    }
    if (empty($lesson_ids)) {
      return [];
    }

    // The select query below relies on Anu LMS data structure to avoid loading
    // all course paragraph entities.
    $query = $this->database->select('paragraphs_item_field_data', 'a');
    // Join the same table to apply conditions to parents of audios.
    $query->join('paragraphs_item_field_data', 'parent',
      'a.parent_id = parent.id'
    );
    $query
      ->condition('a.type', 'lesson_audio')
      ->condition('parent.type', 'lesson_section')
      ->condition('a.status', 1)
      ->condition('parent.status', 1)
      // Keep only audios which parent's parent is one of the course's lessons.
      ->condition('parent.parent_id', $lesson_ids, 'IN');

    $query->fields('a', ['id']);
    $query->distinct();
    $audio_ids = $query->execute()->fetchCol();
    if (empty($audio_ids)) {
      return [];
    }

    $audios_in_course = [];
    foreach ($this->paragraphStorage->loadMultiple($audio_ids) as $paragraph) {
      $uri = $paragraph->get('field_audio_file')->entity->getFileUri();
      $url = $this->fileUrlGenerator->generateAbsoluteString($uri);
      $audios_in_course[] = $url;
    }

    return $audios_in_course;
  }

}
