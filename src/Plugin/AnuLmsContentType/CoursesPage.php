<?php

namespace Drupal\anu_lms\Plugin\AnuLmsContentType;

use Drupal\node\NodeInterface;
use Drupal\taxonomy\TermStorageInterface;
use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\anu_lms\Course;
use Drupal\anu_lms\CourseProgress;
use Drupal\anu_lms\Event\CoursesPageDataGeneratedEvent;
use Drupal\anu_lms\Normalizer;
use Drupal\anu_lms\CoursesPage as CoursesPageService;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Plugin implementation for the courses_page node view.
 *
 * @AnuLmsContentType(
 *   id = "courses_page",
 *   label = @Translation("Courses Page"),
 *   description = @Translation("Handle courses page content.")
 * )
 */
class CoursesPage extends AnuLmsContentTypePluginBase implements ContainerFactoryPluginInterface {

  /**
   * The taxonomy storage.
   *
   * @var \Drupal\taxonomy\TermStorageInterface
   */
  protected TermStorageInterface $taxonomyStorage;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected LanguageManagerInterface $languageManager;

  /**
   * The event dispatcher.
   *
   * @var \Symfony\Component\EventDispatcher\EventDispatcherInterface
   */
  protected EventDispatcherInterface $dispatcher;

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected Normalizer $normalizer;

  /**
   * The Courses page service.
   *
   * @var \Drupal\anu_lms\CoursesPage
   */
  protected CoursesPageService $coursesPage;

  /**
   * The course page service.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected Course $course;

  /**
   * The course progress manager.
   *
   * @var \Drupal\anu_lms\CourseProgress
   */
  protected CourseProgress $courseProgress;

  /**
   * Create an instance of the plugin.
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('language_manager'),
      $container->get('event_dispatcher'),
      $container->get('anu_lms.normalizer'),
      $container->get('anu_lms.courses_page'),
      $container->get('anu_lms.course'),
      $container->get('anu_lms.course_progress'),
    );
  }

  /**
   * Constructs the plugin.
   *
   * @param array $configuration
   *   Plugin configuration.
   * @param string $plugin_id
   *   Plugin id.
   * @param mixed $plugin_definition
   *   Plugin definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Symfony\Component\EventDispatcher\EventDispatcherInterface $dispatcher
   *   The event dispatcher.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   * @param \Drupal\anu_lms\CoursesPage $courses_page
   *   The Courses Page service.
   * @param \Drupal\anu_lms\Course $course
   *   The Course service.
   * @param \Drupal\anu_lms\CourseProgress $course_progress
   *   The Course progress handler.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager, LanguageManagerInterface $language_manager, EventDispatcherInterface $dispatcher, Normalizer $normalizer, CoursesPageService $courses_page, Course $course, CourseProgress $course_progress) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->taxonomyStorage = $entity_type_manager->getStorage('taxonomy_term');
    $this->languageManager = $language_manager;
    $this->dispatcher = $dispatcher;
    $this->normalizer = $normalizer;
    $this->coursesPage = $courses_page;
    $this->course = $course;
    $this->courseProgress = $course_progress;
  }

  /**
   * {@inheritdoc}
   */
  public function getAttachments(): array {
    return [
      'library' => ['anu_lms/courses'],
    ];
  }

  /**
   * Get data for this node.
   *
   * @param \Drupal\node\NodeInterface $courses_page
   *   The courses page node.
   * @param string $langcode
   *   The language for the data.
   */
  public function getData(NodeInterface $courses_page, $langcode = NULL): array {
    $referenced_entities = $courses_page->get('field_courses_content')->referencedEntities();

    // Get all selected categories from attached paragraphs.
    $course_category_ids = [];
    foreach ($referenced_entities as $referenced_entity) {
      $category_id = $referenced_entity->get('field_course_category')
        ->getString();
      if (!empty($category_id && !in_array($category_id, $course_category_ids))) {
        $course_category_ids[] = $category_id;
      }
    }

    // Get list of referenced Course categories.
    $courses = $this->coursesPage->getCoursesByCategories($course_category_ids);

    $normalized_courses = [];
    foreach ($courses as $course) {
      $course_page_categories = $this->taxonomyStorage->loadMultiple($course_category_ids);
      $normalized_course = $this->normalizer->normalizeEntity($course, [
        'max_depth' => 1,
        // Pass the categories requested as context so additional logic
        // can be performed like the course being part of a sequence within
        // a category.
        // @see \Drupal\anu_lms\CourseProgress
        'course_page_categories' => $course_page_categories,
      ]);

      if (!empty($normalized_course)) {
        if ($this->course->isLinearProgressEnabled($course)) {
          $normalized_course['progress'] = $this->courseProgress->getCourseProgress($course);
        }

        if ($this->courseProgress->isLocked($course, $course_page_categories)) {
          $normalized_course['locked'] = ['value' => TRUE];
        }

        $normalized_courses[] = $normalized_course;
      }
    }

    $pageData = [
      $courses_page->bundle() => $this->normalizer->normalizeEntity($courses_page, ['max_depth' => 3]),
      'courses' => $normalized_courses,
      'courses_page_urls_by_course' => $this->coursesPage->getCoursesPageUrlsByCourse($courses),
      'first_lesson_url_by_course' => $this->getFirstLessonUrlByCourse($courses),
    ];

    $event = new CoursesPageDataGeneratedEvent($pageData, $courses_page);
    $this->dispatcher->dispatch(CoursesPageDataGeneratedEvent::EVENT_NAME, $event);
    return $event->getPageData();
  }

  /**
   * Returns URL of the first lesson for each course.
   *
   * @param array $courses
   *   List of course nodes.
   *
   * @return array
   *   URL of the first lesson for each course.
   *
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  protected function getFirstLessonUrlByCourse(array $courses): array {
    // Get first accessible Lesson URL.
    $first_lesson_url_by_course = [];
    $current_language = $this->languageManager->getCurrentLanguage();
    foreach ($courses as $course) {
      $lesson = $this->course->getFirstAccessibleLesson($course);
      if (!empty($lesson)) {
        $first_lesson_url_by_course[] = [
          'course_id' => (int) $course->id(),
          'first_lesson_url' => $lesson->toUrl('canonical', ['language' => $current_language])
            ->toString(),
        ];
      }
    }

    return $first_lesson_url_by_course;
  }

}
