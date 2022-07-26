<?php

namespace Drupal\anu_lms;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Normalizer service for the given entity.
 */
class CoursesPage {

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface;
   */
  protected EntityStorageInterface $nodeStorage;

  /**
   * The paragraph storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected EntityStorageInterface $paragraphStorage;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->paragraphStorage = $entity_type_manager->getStorage('paragraph');
  }

  /**
   * Returns list of Course entities by given category ids.
   *
   * @param array $category_ids
   *   List of category ids.
   *
   * @return array|NodeInterface[]
   *   An array of Course entities.
   */
  public function getCoursesByCategories(array $category_ids): array {
    if (empty($category_ids)) {
      return [];
    }

    $courses = $this->nodeStorage->getQuery()
      ->condition('type', 'course')
      ->condition('field_course_category', $category_ids, 'IN')
      ->sort('field_weight')
      ->sort('created')
      ->execute();

    return !empty($courses) ? $this->nodeStorage->loadMultiple($courses) : [];
  }

  /**
   * Returns list of Courses page entities by given Course.
   *
   * @param NodeInterface $course
   *   Course entity.
   *
   * @return array|NodeInterface[]
   *   An array of Courses page entities.
   */
  public function getCoursesPagesByCourse(NodeInterface $course): array {
    if (empty($course)) {
      return [];
    }

    // Gathering course categories.
    $category_ids = array_column($course->get('field_course_category')->getValue(), 'target_id');

    if (empty($category_ids)) {
      return [];
    }

    // Gathering courses page's categories paragraphs.
    $courses_page_categories = \Drupal::entityQuery('paragraph')
      ->condition('type', 'course_category')
      ->condition('field_course_category', $category_ids, 'IN')
      ->execute();

    if (empty($courses_page_categories)) {
      return [];
    }

    // Gathering courses page IDs.
    $courses_page_categories = array_values($courses_page_categories);
    $courses_page_ids = $this->nodeStorage->getQuery()
      ->condition('type', 'courses_page')
      ->condition('field_courses_content', $courses_page_categories, 'IN')
      ->execute();

    return !empty($courses_page_ids) ? $this->nodeStorage->loadMultiple($courses_page_ids) : [];
  }

}
