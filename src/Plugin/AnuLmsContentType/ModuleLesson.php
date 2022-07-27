<?php

namespace Drupal\anu_lms\Plugin\AnuLmsContentType;

use Drupal\anu_lms\CourseProgress;
use Drupal\anu_lms\Lesson;
use Drupal\anu_lms\CoursesPage;
use Drupal\anu_lms\Normalizer;
use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\anu_lms\Event\LessonPageDataGeneratedEvent;
use Drupal\node\NodeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Plugin implementation for the module_lesson.
 *
 * @AnuLmsContentType(
 *   id = "module_lesson",
 *   label = @Translation("Module lesson"),
 *   description = @Translation("Handle lesson content.")
 * )
 */
class ModuleLesson extends AnuLmsContentTypePluginBase implements ContainerFactoryPluginInterface {

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
  protected CoursesPage $coursesPage;

  /**
   * The Lesson service.
   *
   * @var \Drupal\anu_lms\Lesson
   */
  protected Lesson $lesson;

  /**
   * Course Progress handler.
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
      $container->get('event_dispatcher'),
      $container->get('anu_lms.normalizer'),
      $container->get('anu_lms.courses_page'),
      $container->get('anu_lms.lesson'),
      $container->get('anu_lms.course_progress')
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
   * @param \Symfony\Component\EventDispatcher\EventDispatcherInterface $dispatcher
   *   The event dispatcher.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   * @param \Drupal\anu_lms\CoursesPage $courses_page
   *   The Courses Page service.
   * @param \Drupal\anu_lms\Lesson $lesson
   *   The Lesson service.
   * @param \Drupal\anu_lms\CourseProgress $course_progress
   *   The course progress service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EventDispatcherInterface $dispatcher, Normalizer $normalizer, CoursesPage $courses_page, Lesson $lesson, CourseProgress $course_progress) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->dispatcher = $dispatcher;
    $this->normalizer = $normalizer;
    $this->coursesPage = $courses_page;
    $this->lesson = $lesson;
    $this->courseProgress = $course_progress;
  }

  /**
   * Get data for this node.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   The lesson node.
   *
   * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
   */
  public function getData(NodeInterface $lesson): array {
    $course = $this->lesson->getLessonCourse($lesson->id());

    $normalized_course = NULL;
    if (!empty($course)) {
      $normalized_course = $this->normalizer->normalizeEntity($course, ['max_depth' => 2]);
      $normalized_course['progress'] = $this->courseProgress->getCourseProgress($course);
    }

    $data = [
      $lesson->bundle() => $this->normalizer->normalizeEntity($lesson, ['max_depth' => 4]),
      'course' => $normalized_course,
      'courses_page_urls_by_course' => $this->coursesPage->getCoursesPageUrlsByCourse([$course]),
    ];

    $event = new LessonPageDataGeneratedEvent($data, $lesson);
    $this->dispatcher->dispatch(LessonPageDataGeneratedEvent::EVENT_NAME, $event);
    return $event->getPageData();
  }

}
