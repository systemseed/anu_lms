<?php

namespace Drupal\anu_lms;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\NodeInterface;

/**
 * Lesson service.
 */
class Lesson
{

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected $normalizer;

  /**
   * The quiz service.
   *
   * @var \Drupal\anu_lms\Quiz
   */
  protected $quiz;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   * @param \Drupal\anu_lms\Quiz $quiz
   *   The quiz.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, Normalizer $normalizer, Quiz $quiz)
  {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->normalizer = $normalizer;
    $this->quiz = $quiz;
  }

  /**
   * Returns normalized data for Lesson page.
   *
   * @param EntityInterface $node
   *   Lesson node.
   *
   * @return array
   *   An array containing current node and referenced course.
   */
  public function getLessonPageData(NodeInterface $node)
  {
    $lesson_course = $this->getLessonCourse($node);

    $data = [
      $node->bundle() => $this->normalizer->normalizeEntity($node, ['max_depth' => 4]),
      'course' => !empty($lesson_course) ? $this->normalizer->normalizeEntity($lesson_course, ['max_depth' => 2]) : NULL,
    ];

    if ($node->bundle() === 'module_assessment') {
      $this->quiz->getQuizSubmissionData($node, $data);
    }

    return $data;
  }

  /**
   * Returns Course entity for given lesson.
   *
   * @param EntityInterface $lesson
   *   Lesson object.
   *
   * @return EntityInterface
   *   Loaded Course object.
   */
  public function getLessonCourse($lesson)
  {
    if (empty($lesson)) {
      return NULL;
    }

    // Get lesson's module.
    $field_name = $lesson->bundle() === 'module_lesson' ? 'field_module_lessons' : 'field_module_assessment';
    $module = \Drupal::entityQuery('paragraph')
      ->condition('type', 'course_modules')
      ->condition($field_name, $lesson->id())
      ->sort('created', 'DESC')
      ->range(0, 1)
      ->execute();

    if (empty($module)) {
      return NULL;
    }

    // Get module's course.
    $course = $this->nodeStorage->getQuery()
      ->condition('type', 'course')
      ->condition('field_course_module', reset($module))
      ->accessCheck(FALSE)
      ->range(0, 1)
      ->execute();

    return !empty($course) ? $this->nodeStorage->load(reset($course)) : NULL;
  }
}
