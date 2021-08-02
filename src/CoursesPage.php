<?php

namespace Drupal\anu_lms;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
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
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;  

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected $normalizer;

  /**
   * The course page service.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected $course;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\anu_lms\Course $course
   *   The Course service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, LanguageManagerInterface $language_manager, Normalizer $normalizer, Course $course) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->taxonomyStorage = $entity_type_manager->getStorage('taxonomy_term');
    $this->languageManager = $language_manager;
    $this->normalizer = $normalizer;
    $this->course = $course;
  }

  /**
   * Returns normalized Courses page data.
   *
   * @param \Drupal\Core\Entity\EntityInterface $node
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
      $normalized_course = $this->normalizer->normalizeEntity($course, ['max_depth' => 3]);
      if (!empty($normalized_course)) {
        $normalized_courses[] = $normalized_course;
      }
    }

    // Get list of Courses pages for every Course.
    $courses_pages_by_course = [];
    foreach ($courses as $course) {
      $courses_pages = $this->getCoursesPagesByCourse($course);
      $normalized_courses_pages = [];
      foreach ($courses_pages as $courses_page) {
        $normalized_courses_pages[] = [
          'courses_page' =>  $this->normalizer->normalizeEntity($courses_page, ['max_depth' => 1])
        ];
      }

      $courses_pages_by_course[] = [
        'course_id' => $course->id(),
        'courses_pages' => $normalized_courses_pages,
      ];
    }

    // Get first accessible Lesson URL.
    $first_lesson_url_by_course = [];
    $current_language = $this->languageManager->getCurrentLanguage();
    foreach ($courses as $course) {
      $lesson = $this->course->getFirstAccessibleLesson($course);
      if (!empty($lesson)) {
        $first_lesson_url_by_course[] = [
          'course_id' => $course->id(),
          'first_lesson_url' => $lesson->toUrl('canonical', ['language' => $current_language])->toString(),
        ];
      }
    }

    return [
      $node->bundle() => $this->normalizer->normalizeEntity($node, ['max_depth' => 3]),
      'courses' => $normalized_courses,
      'courses_pages_by_course' => $courses_pages_by_course,
      'first_lesson_url_by_course' => $first_lesson_url_by_course,
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

  /**
   * Returns list of Courses page entities by given Course.
   *
   * @param EntityInterface $course
   *   Course entity.
   *
   * @return array|EntityInterface[]
   *   An array of Courses page entities.
   */
  public function getCoursesPagesByCourse(EntityInterface $course) {
    if (empty($course)) {
      return [];
    }

    // Gathering course categories.
    $category_ids = array_column($course->get('field_course_category')->getValue(), 'target_id');

    if (empty($category_ids)) {
      return [];
    }

    // Gathering courses page's categories parargaphs.
    $courses_page_categories = \Drupal::entityQuery('paragraph')
      ->condition('type', 'course_category')
      ->condition('field_course_category', $category_ids, 'IN')
      ->execute();

    if (empty($courses_page_categories)) {
      return [];
    }

    // Gathering courses page IDs.
    $courses_page_categories = array_values($courses_page_categories);
    $courses_page_ids = \Drupal::entityQuery('node')
      ->condition('type', 'courses_page')
      ->condition('field_courses_content', $courses_page_categories, 'IN')
      ->execute();

    return !empty($courses_page_ids) ? Node::loadMultiple($courses_page_ids) : [];
  }
}
