<?php

namespace Drupal\anu_lms\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\anu_lms\Course;
use Drupal\anu_lms\Lesson;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Finish course operations.
 */
class FinishCourse extends ControllerBase {

  /**
   * The course page service.
   *
   * @var \Drupal\anu_lms\Course
   */
  protected Course $course;

  /**
   * The Lesson service.
   *
   * @var \Drupal\anu_lms\Lesson
   */
  protected Lesson $lesson;

  /**
   * Creates an NodeViewController object.
   *
   * @param \Drupal\anu_lms\Course $course
   *   The Course service.
   * @param \Drupal\anu_lms\Lesson $lesson
   *   The Lesson service.
   */
  public function __construct(Course $course, Lesson $lesson) {
    $this->course = $course;
    $this->lesson = $lesson;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('anu_lms.course'),
      $container->get('anu_lms.lesson'),
    );
  }

  /**
   * Set a lesson as complete and redirect.
   *
   * @deprecated: The finish button should not link to this endpoint anymore
   * and the progress should be handled by the frontend.
   */
  public function complete(EntityInterface $node): RedirectResponse {
    /** @var \Drupal\node\NodeInterface $node */
    if (!in_array($node->bundle(), ['module_lesson', 'module_assessment'])) {
      throw new AccessDeniedHttpException();
    }

    $course = $this->lesson->getLessonCourse($node->id());
    $url = $this->course->getFinishRedirectUrl($course);
    return new RedirectResponse($url->toString(), 302);
  }

}
