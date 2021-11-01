<?php

namespace Drupal\anu_lms_assessments\Plugin\AnuLmsContentType;

use Drupal\anu_lms\AnuLmsContentTypePluginBase;
use Drupal\node\NodeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\anu_lms_assessments\Quiz as QuizService;
use Symfony\Component\DependencyInjection\ContainerInterface;
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
class Quiz extends AnuLmsContentTypePluginBase implements ContainerFactoryPluginInterface {

  /**
   * The Quiz service.
   *
   * @var \Drupal\anu_lms_assessments\Quiz
   */
  protected $quiz;

  /**
   * Create an instance of the plugin.
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('anu_lms_assessments.quiz'),
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
   * @param \Drupal\anu_lms_assessments\Quiz $quiz
   *   The Quiz service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, QuizService $quiz) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->quiz = $quiz;
  }

  /**
   * Get data for this node.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The courses page node.
   * @param string $langcode
   *   The language for the data.
   */
  public function getData(NodeInterface $node, $langcode = NULL) {

    // If a user got to the current quiz, it means that
    // they hit "Next" button on the previous lesson and so
    // we can call the previous lesson completed.
    $this->quiz->setPreviousLessonCompleted($node);
    // If after setting the previous lesson a completed state the
    // current quiz still has restricted access, it means that
    // something went wrong with doing that and the user should not
    // be able to see the current page.
    if ($this->quiz->isRestricted($node)) {
      throw new AccessDeniedHttpException();
    }

    // Get data for viewed quiz.
    return $this->quiz->getPageData($node);
  }

}
