<?php

namespace Drupal\anu_lms;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\Entity\Node;

/**
 * Normalizer service for the given entity.
 */
class CoursesPage {

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * The taxonomy storage.
   *
   * @var \Drupal\taxonomy\TermStorageInterface
   */
  protected $taxonomyStorage;

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected $normalizer;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, Normalizer $normalizer) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->taxonomyStorage = $entity_type_manager->getStorage('taxonomy_term');
    $this->normalizer = $normalizer;
  }

  /**
   * Returns normalized Courses page data.
   *
   * @param EntityInterface $node
   *   Courses page node.
   *
   * @return array
   *   An array containing current node and list of referenced courses.
   */
  public function getCoursesPageData(EntityInterface $node) {
    $referenced_entities = $node->get('field_courses_content')->referencedEntities();

    // Get all selected categories from attached paragraphs.
    $project_category_ids = [];
    /** @var \Drupal\Core\Entity\EntityInterface[] $referenced_entities */
    foreach ($referenced_entities as $referenced_entity) {
      if ($referenced_entity->bundle() === 'course_category') {
        if (!$referenced_entity->get('field_course_category')->isEmpty()) {
          $project_category_ids[] = intval($referenced_entity->get('field_course_category')->first()->getString());
        }
      }
    }
    $project_category_ids = array_unique($project_category_ids);

    // Get list of referenced Course entities.
    $courses = $this->getCoursesByCategories($project_category_ids);
    $normalized_courses = [];
    foreach ($courses as $course) {
      $normalized_courses[] = $this->normalizer->normalizeEntity($course, ['max_depth' => 1]);
    }

    return [
      $node->bundle() => $this->normalizer->normalizeEntity($node, ['max_depth' => 3]),
      'courses' => $normalized_courses,
    ];
  }

  /**
   * Returns list of Course entities by given category ids.
   *
   * @param array $category_ids
   *   List of category ids (int).
   *
   * @return array|EntityInterface[]
   *   An array of Course entities.
   */
  protected function getCoursesByCategories(array $category_ids) {
    if (empty($category_ids)) {
      return [];
    }

    $courses = \Drupal::entityQuery('node')
      ->condition('type', 'course')
      ->condition('field_course_category', $category_ids, 'IN')
      ->sort('created')
      ->execute();

    return !empty($courses) ? Node::loadMultiple($courses) : [];
  }
}
