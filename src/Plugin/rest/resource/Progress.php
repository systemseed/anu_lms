<?php

namespace Drupal\anu_lms\Plugin\rest\resource;

use Drupal\anu_lms\Lesson;
use Drupal\Core\Session\AccountInterface;
use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\Core\Entity\EntityStorageInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotAcceptableHttpException;

/**
 * An endpoint to save lessons progress.
 *
 * @RestResource(
 *   id = "anu_lms_progress",
 *   label = @Translation("Anu LMS progress"),
 *   uri_paths = {
 *     "create" = "/anu_lms/progress",
 *   }
 * )
 */
class Progress extends ResourceBase {

  /**
   * The available serialization formats.
   *
   * @var array
   */
  protected $serializerFormats = [];

  /**
   * A logger instance.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected $logger;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected AccountInterface $currentUser;

  /**
   * The Lesson helper.
   *
   * @var \Drupal\anu_lms\Lesson
   */
  protected Lesson $lesson;

  /**
   * Node entity storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected EntityStorageInterface $nodeStorage;

  /**
   * Constructs a Drupal\rest\Plugin\ResourceBase object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\anu_lms\Lesson $lesson
   *   Anu LMS lesson service.
   * @param \Drupal\Core\Entity\EntityStorageInterface $node_storage
   *   Node storage.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, AccountInterface $current_user, Lesson $lesson, EntityStorageInterface $node_storage) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->currentUser = $current_user;
    $this->lesson = $lesson;
    $this->nodeStorage = $node_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('rest'),
      $container->get('current_user'),
      $container->get('anu_lms.lesson'),
      $container->get('entity_type.manager')->getStorage('node')
    );
  }

  /**
   * Responds to POST requests.
   *
   * Marks lessons as completed.
   *
   * @param array $data
   *   Array of lessons to complete. Maximum size of array is 100 items.
   *
   * @return \Drupal\rest\ResourceResponse
   *   Returns array with ids of updated lessons.
   */
  public function post(array $data) {
    if ($this->currentUser->isAnonymous()) {
      throw new NotAcceptableHttpException('Progress for anonymous users is not supported.');
    }

    // Validates state field value.
    if (empty($data)) {
      throw new NotAcceptableHttpException('Incorrect request data.');
    }
    if (count($data) > 100) {
      throw new NotAcceptableHttpException('Data size exceeded maximum of 100 items.');
    }
    $results = [];

    $data = array_filter($data, function ($value) {
      return !empty($value) && is_numeric($value);
    });

    try {
      /** @var \Drupal\node\NodeInterface[] $nodes */
      $nodes = $this->nodeStorage->loadMultiple(array_filter($data));
      foreach ($nodes as $node) {
        if (in_array($node->bundle(), ['module_lesson', 'module_assessment'])) {
          $this->lesson->setCompleted($node->id());
          $results[] = $node->id();
        }
      }
      $this->logger->info("User completed lesson @lessons", [
        '@lessons' => implode(',', $data),
      ]);
    }
    catch (\Exception $e) {
      $this->logger
        ->error("Can't update lessons progress. Error: @error. Lessons: @data", [
          '@error' => $e->getMessage(),
          '@data' => implode(',', $data),
        ]);
      throw new NotAcceptableHttpException("Can't update lessons progress. Error: " . $e->getMessage());
    }

    return new ResourceResponse(['lessons' => $results]);
  }

}
