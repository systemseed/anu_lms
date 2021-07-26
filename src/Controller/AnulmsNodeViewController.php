<?php

namespace Drupal\anu_lms\Controller;

use Drupal\anu_lms\Course;
use Drupal\anu_lms\Lesson;
use Drupal\anu_lms\Quiz;
use Drupal\anu_lms\Settings;
use Drupal\anu_lms\Normalizer;
use Drupal\anu_lms\CoursesPage;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Component\Serialization\Json;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Serializer\Serializer;
use Drupal\node\Controller\NodeViewController;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class AnulmsNodeViewController extends NodeViewController {

  use StringTranslationTrait;

  /**
   * The serializer.
   *
   * @var \Symfony\Component\Serializer\Serializer
   */
  protected $serializer;

  /**
   * AnuLMS settings service.
   *
   * @var \Drupal\anu_lms\Settings
   */
  protected $anulmsSettings;

  /**
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected $normalizer;

  /**
   * The Courses page service.
   *
   * @var \Drupal\anu_lms\CoursesPage
   */
  protected $coursesPage;

  /**
   * The course page service.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected $course;

  /**
   * The Lesson service.
   *
   * @var \Drupal\anu_lms\Lesson
   */
  protected $lesson;

  /**
   * The Quiz service.
   *
   * @var \Drupal\anu_lms\Quiz
   */
  protected $quiz;

  /**
   * Creates an NodeViewController object.
   *
   * @param \Drupal\anu_lms\Settings $anulmsSettings
   *   Anu LMS Settings service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   * @param \Drupal\anu_lms\CoursesPage $coursesPage
   *   The Courses page service.
   * @param \Drupal\anu_lms\Course $course
   *   The Course service.
   * @param \Drupal\anu_lms\Lesson $lesson
   *   The Lesson service.
   * @param \Drupal\anu_lms\Quiz $quiz
   *   The Quiz service.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer service.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user. For backwards compatibility this is optional, however
   *   this will be removed before Drupal 9.0.0.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Symfony\Component\Serializer\Serializer $serializer
   *   The serializer.
   */
  public function __construct(Settings $anulmsSettings, EntityTypeManagerInterface $entity_type_manager, Normalizer $normalizer, CoursesPage $coursesPage, Course $course, Lesson $lesson, Quiz $quiz, RendererInterface $renderer, AccountInterface $current_user = NULL, EntityRepositoryInterface $entity_repository = NULL, Serializer $serializer = NULL) {
    parent::__construct($entity_type_manager, $renderer, $current_user, $entity_repository);
    $this->anulmsSettings = $anulmsSettings;
    $this->serializer = $serializer;
    $this->normalizer = $normalizer;
    $this->coursesPage = $coursesPage;
    $this->course = $course;
    $this->lesson = $lesson;
    $this->quiz = $quiz;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('anu_lms.settings'),
      $container->get('entity_type.manager'),
      $container->get('anu_lms.normalizer'),
      $container->get('anu_lms.courses_page'),
      $container->get('anu_lms.course'),
      $container->get('anu_lms.lesson'),
      $container->get('anu_lms.quiz'),
      $container->get('renderer'),
      $container->get('current_user'),
      $container->get('entity.repository'),
      $container->get('serializer')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function view(EntityInterface $node, $view_mode = 'full', $langcode = NULL) {
    $node_type = $node->bundle();

    // Modify the output only for node types we're responsible for,
    if (!in_array($node_type, ['courses_page', 'course', 'module', 'module_lesson', 'module_assessment'])) {
      return parent::view($node, $view_mode, $langcode);
    }

    // Collects leftover contents IDs.
    switch ($node_type) {
      case 'courses_page':
        // Get courses page data. Includes normalized current node and list of referenced courses.
        $content_data = $this->coursesPage->getCoursesPageData($node);
        break;

      case 'module_lesson':
        // Get data for viewed lesson.
        $content_data = $this->lesson->getPageData($node);
        break;
      case 'module_assessment':
        // Get data for viewed quiz.
        $content_data = $this->quiz->getPageData($node);
        break;

      case 'course':
        $lesson = $this->course->getFirstAccessibleLesson($node);
        if (!empty($lesson)) {
          return new RedirectResponse($lesson->toUrl('canonical', ['language' => $langcode])->toString());
        }
        return [
          '#markup' => $this->t('There are no lessons in this course yet.'),
        ];

      default:
        // Get data for viewed node.
        $context = ['max_depth' => 2];
        $content_data[$node_type] = $this->normalizer->normalizeEntity($node, $context);
        break;
    }

    $data = [];
    // Attaches node data.
    $data['data'] = $content_data;

    // Attaches general site settings.
    $data['settings'] = $this->anulmsSettings->getSettings();

    // You can use `jQuery('#application').data('application')` in console for debug.
    $build['application'] = [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#attributes' => [
        'id' => 'anu-application',
        'data-application' => Json::encode($data),
      ],
    ];

    if ($node_type == 'courses_page') {
      $build['#attached'] = [
        'library' => ['anu_lms/courses'],
      ];
    }
    else {
      $build['#attached'] = [
        'library' => ['anu_lms/lesson'],
      ];
    }

    // Attach PWA cache version.
    if (\Drupal::moduleHandler()->moduleExists('pwa')) {
      $build['#attached']['drupalSettings']['pwa_settings'] = $this->anulmsSettings->getPwaSettings();
    }

    // Disable cache for this page. @todo can be improved using cache tags.
    $build['#cache']['max-age'] = 0;
    return $build;
  }

}
