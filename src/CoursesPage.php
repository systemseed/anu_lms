<?php

namespace Drupal\anu_lms;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Cache\CacheBackendInterface;
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
   * Cache service.
   *
   * @var \Drupal\Core\Cache\CacheBackendInterface
   */
  protected CacheBackendInterface $cache;

  /**
   * Constructs service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache
   *   Cache service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, CacheBackendInterface $cache) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->paragraphStorage = $entity_type_manager->getStorage('paragraph');
    $this->cache = $cache;
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
   * @param \Drupal\node\NodeInterface|null $course
   *   Course entity.
   *
   * @return array|\Drupal\node\NodeInterface[]
   *   An array of Courses page entities.
   */
  public function getCoursesPagesByCourse(?NodeInterface $course): array {
    if (empty($course)) {
      return [];
    }

    // Gathering course categories.
    $category_ids = array_column($course->get('field_course_category')->getValue(), 'target_id');
    if (empty($category_ids)) {
      return [];
    }

    // Given that this method can be used for every course on a courses page,
    // we cache mapping between courses pages content type and the categories
    // represented by their paragraphs.
    $cache_id = 'anu_lms:courses_pages_by_course_map';
    $courses_pages_mapping = &drupal_static($cache_id, FALSE);

    // If not found in static cache - lookup in the backend cache.
    if ($courses_pages_mapping === FALSE) {
      $cache = $this->cache->get($cache_id);
      if (!empty($cache->data)) {
        $courses_pages_mapping = $cache->data;
      }
    }

    // If mapping was not found in cache, then we need to build it from
    // scratch.
    if ($courses_pages_mapping === FALSE) {
      $courses_pages_mapping = [];
      $cacheable_metadata = new CacheableMetadata();

      // Load all courses_pages (we expected have just several pages max per
      // site, so it should be OK).
      $courses_pages = $this->nodeStorage->loadByProperties(['type' => 'courses_page']);
      foreach ($courses_pages as $courses_page) {
        $course_categories_paragraphs = $courses_page->get('field_courses_content')->referencedEntities();
        foreach ($course_categories_paragraphs as $course_categories_paragraph) {
          $course_category_tid = $course_categories_paragraph->get('field_course_category')->getString();
          $courses_pages_mapping[$course_category_tid][] = $courses_page->id();
          $cacheable_metadata->addCacheableDependency($courses_page);
        }
      }

      // Add mapping to backend cache with cache tags to trigger recalculation
      // only when content of the courses cache changes.
      $this->cache->set(
        $cache_id,
        $courses_pages_mapping,
        Cache::PERMANENT,
        $cacheable_metadata->getCacheTags()
      );
    }

    $courses_page_ids = [];
    foreach ($category_ids as $category_id) {
      if (!empty($courses_pages_mapping[$category_id])) {
        $courses_page_ids += $courses_pages_mapping[$category_id];
      }
    }

    return !empty($courses_page_ids) ? $this->nodeStorage->loadMultiple($courses_page_ids) : [];
  }

  /**
   * Load list of courses page URLs for each course.
   *
   * Note that this is needed only for offline mode.
   *
   * @param array $courses
   *   List of course nodes.
   *
   * @return array
   *   Course page URLs per course.
   *
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public function getCoursesPageUrlsByCourse(array $courses): array {
    $courses_page_urls_by_course = [];

    // Gets only not-null values.
    $courses = array_filter($courses, function ($course) {
      return !!$course;
    });

    foreach ($courses as $course) {
      $courses_pages = $this->getCoursesPagesByCourse($course);
      $courses_page_urls = [];
      foreach ($courses_pages as $courses_page_node) {
        $courses_page_urls[] = $courses_page_node->toUrl()->toString();
      }

      $courses_page_urls_by_course[] = [
        'course_id' => (int) $course->id(),
        'courses_page_urls' => $courses_page_urls,
      ];
    }

    return $courses_page_urls_by_course;
  }

}
