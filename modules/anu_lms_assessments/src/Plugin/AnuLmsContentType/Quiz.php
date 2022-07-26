<?php

namespace Drupal\anu_lms_assessments\Plugin\AnuLmsContentType;

use Drupal\anu_lms\CourseProgress;
use Drupal\anu_lms\CoursesPage;
use Drupal\anu_lms\Lesson;
use Drupal\anu_lms\Normalizer;
use Drupal\anu_lms\Plugin\AnuLmsContentType\ModuleLesson;
use Drupal\anu_lms_assessments\Quiz as QuizService;
use Drupal\node\NodeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Plugin implementation for the module_assessment.
 *
 * @AnuLmsContentType(
 *   id = "module_assessment",
 *   label = @Translation("Quiz"),
 *   description = @Translation("Handle quiz content.")
 * )
 */
class Quiz extends ModuleLesson implements ContainerFactoryPluginInterface {

  /**
   * The Quiz service.
   *
   * @var \Drupal\anu_lms_assessments\Quiz
   */
  protected QuizService $quiz;

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
      $container->get('anu_lms.course_progress'),
      $container->get('anu_lms_assessments.quiz'),
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
   *   The course progress handler.
   * @param \Drupal\anu_lms_assessments\Quiz $quiz
   *   The Quiz service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EventDispatcherInterface $dispatcher, Normalizer $normalizer, CoursesPage $courses_page, Lesson $lesson, CourseProgress $course_progress, QuizService $quiz) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $dispatcher, $normalizer, $courses_page, $lesson, $course_progress);
    $this->quiz = $quiz;
  }

  /**
   * Get data for this node.
   *
   * @param \Drupal\node\NodeInterface $quiz
   *   The quiz node.
   *
   * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
   */
  public function getData(NodeInterface $quiz): array {
    // If after setting the previous lesson a completed state the
    // current quiz still has restricted access, it means that
    // something went wrong with doing that and the user should not
    // be able to see the current page.
    if ($this->quiz->isRestricted($quiz->id())) {
      throw new AccessDeniedHttpException();
    }

    // Get data for viewed quiz.
    $data = parent::getData($quiz);
    return $this->quiz->getQuizSubmissionData($quiz, $data);
  }

}
