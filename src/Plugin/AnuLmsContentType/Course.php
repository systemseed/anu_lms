<?php

namespace Drupal\anu_lms\Plugin\AnuLmsContentType;

use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\anu_lms\Course as CourseService;
use Drupal\anu_lms\CourseProgress;
use Drupal\node\NodeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Plugin implementation for the course.
 *
 * @AnuLmsContentType(
 *   id = "course",
 *   label = @Translation("Course"),
 *   description = @Translation("Handle courses")
 * )
 */
class Course extends AnuLmsContentTypePluginBase implements ContainerFactoryPluginInterface {

  use StringTranslationTrait;

  /**
   * The Course service.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected CourseService $course;

  /**
   * The Courses progress service.
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
      $container->get('anu_lms.course'),
      $container->get('anu_lms.course_progress')
    );
  }

  /**
   * Construct the plugin.
   *
   * @param array $configuration
   *   Plugin configuration.
   * @param string $plugin_id
   *   Plugin id.
   * @param mixed $plugin_definition
   *   Plugin definition.
   * @param \Drupal\anu_lms\Course $course
   *   The Courses page service.
   * @param \Drupal\anu_lms\CourseProgress $courseProgress
   *   The Courses progress service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, CourseService $course, CourseProgress $courseProgress) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->course = $course;
    $this->courseProgress = $courseProgress;
  }

  /**
   * Get data for this node.
   *
   * @param \Drupal\node\NodeInterface $course
   *   The course node.
   * @param string $langcode
   *   The language for the data.
   *
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public function getData(NodeInterface $course, $langcode = NULL) {
    if ($this->courseProgress->isLocked($course, $course->get('field_course_category')->referencedEntities(), TRUE)) {
      return [
        '#markup' => $this->t('This course is locked.'),
      ];
    }
    $lesson = $this->course->getFirstAccessibleLesson($course);
    if (!empty($lesson)) {
      return new RedirectResponse($lesson->toUrl('canonical', ['language' => $langcode])->toString());
    }
    return [
      '#markup' => $this->t('There are no lessons in this course yet.'),
    ];

  }

}
