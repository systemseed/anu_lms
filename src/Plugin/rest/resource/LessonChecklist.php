<?php

namespace Drupal\anu_lms\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\anu_lms\Normalizer;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotAcceptableHttpException;

/**
 * An endpoint to save/return lesson checklist data.
 *
 * @RestResource(
 *   id = "anu_lms_lesson_checklist",
 *   label = @Translation("Lesson checklist"),
 *   uri_paths = {
 *     "canonical" = "/anu_lms/lesson/checklist",
 *     "create" = "/anu_lms/lesson/checklist"
 *   }
 * )
 */
class LessonChecklist extends ResourceBase {

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
   * The normalizer.
   *
   * @var \Drupal\anu_lms\Normalizer
   */
  protected Normalizer $normalizer;

  /**
   * The entity repository service.
   *
   * @var \Drupal\Core\Entity\EntityRepositoryInterface
   */
  protected EntityRepositoryInterface $entityRepository;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected AccountInterface $currentUser;

  /**
   * The Lesson checklist storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected EntityStorageInterface $lessonChecklistStorage;

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
   * @param \Drupal\anu_lms\Normalizer $normalizer
   *   The normalizer.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Entity\EntityStorageInterface $lesson_checklist_storage
   *   The Lesson checklist storage.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, Normalizer $normalizer, EntityRepositoryInterface $entity_repository, AccountInterface $current_user, EntityStorageInterface $lesson_checklist_storage) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->normalizer = $normalizer;
    $this->entityRepository = $entity_repository;
    $this->currentUser = $current_user;
    $this->lessonChecklistStorage = $lesson_checklist_storage;
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
      $container->get('anu_lms.normalizer'),
      $container->get('entity.repository'),
      $container->get('current_user'),
      $container->get('entity_type.manager')->getStorage('lesson_checklist_result')
    );
  }

  /**
   * Responds to GET requests.
   *
   * Returns checklist results data by given params.
   *
   * URL params:
   *  - checklist_paragraph_id (int) - Checklist paragraph id.
   *
   * Examples:
   * @code
   *   http://msp.localhost/anu_lms/lesson/checklist?_format=json&checklist_paragraph_id=31
   * @endcode
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The incoming request.
   *
   * @return \Drupal\rest\ModifiedResourceResponse|\Drupal\rest\ResourceResponse
   *   The response containing the Checklist result entity data.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\BadRequestHttpException
   *   Thrown when wrong params were passed.
   */
  public function get(Request $request) {
    $query = $request->query;
    $checklist_paragraph_id = $query->get('checklist_paragraph_id');

    // Outputs an error if required params are missed.
    if (empty($checklist_paragraph_id)) {
      throw new BadRequestHttpException('Missed parameters in request.');
    }

    $result = [];
    // Get existing checklist results entity.
    $existing_submission_ids = $this->lessonChecklistStorage
      ->getQuery()
      ->condition('type', 'lesson_checklist_result')
      ->condition('field_checklist_paragraph', $checklist_paragraph_id)
      ->condition('uid', $this->currentUser->id())
      ->range(0, 1)
      ->sort('created', 'DESC')
      ->execute();
    if (!empty($existing_submission_ids)) {
      $existing_submission_id = reset($existing_submission_ids);
      $lesson_checklist_entity = $this->lessonChecklistStorage->load($existing_submission_id);

      if (!empty($lesson_checklist_entity) && $lesson_checklist_entity->access('view')) {
        $result = $this->normalizer->normalizeEntity($lesson_checklist_entity, ['max_depth' => 1]);
      }
    }

    $build = [
      '#cache' => [
        'tags' => [
          'lesson_checklist_result:' . $checklist_paragraph_id,
        ],
      ],
    ];
    return (new ResourceResponse($result))->addCacheableDependency($build);
  }

  /**
   * Responds to POST requests.
   *
   * Saves checklist results data.
   *
   * @param array $data
   *   Data passed to create a checklist results entity.
   *
   * @code
   *   $data = [
   *   'checklist_paragraph_id' => 31, // Lesson checklist Paragraph id
   *   'selected_option_ids' => [30, 32], // Ids of options.
   *   ];
   * @endcode
   *
   * @return \Drupal\rest\ResourceResponse
   *   Returns an id of created checklist results entity (format like
   *   ['lesson_checklist_id' => 123]) or Error message in case of errors.
   */
  public function post(array $data) {
    // Validates state field value.
    if (empty($data['checklist_paragraph_id']) || !isset($data['selected_option_ids'])) {
      throw new NotAcceptableHttpException('Incorrect request data.');
    }

    try {
      $checklist_paragraph = Paragraph::load($data['checklist_paragraph_id']);

      // Check additionally if user can create or update submission.
      if (empty($checklist_paragraph) || $checklist_paragraph->bundle() !== 'lesson_checklist') {
        throw new NotAcceptableHttpException("Paragraph with given id doesn't exist");
      }

      // Search for existing checklist results.
      // Update it instead of create a new one.
      $existing_submission_ids = $this->lessonChecklistStorage
        ->getQuery()
        ->condition('type', 'lesson_checklist_result')
        ->condition('field_checklist_paragraph', $data['checklist_paragraph_id'])
        ->condition('uid', $this->currentUser->id())
        ->range(0, 1)
        ->sort('created', 'DESC')
        ->execute();

      // Update an existing entity if checklist result exists.
      if (!empty($existing_submission_ids)) {
        $existing_submission_id = reset($existing_submission_ids);
        $lesson_checklist_entity = $this->lessonChecklistStorage->load($existing_submission_id);
      }
      else {
        // Setting flag for workaround for preventing re saving paragraph
        // and changing parent_id.
        // Implementation made as patch for entity_reference_revisions module.
        // @todo rewrite to avoid dependance to patch to entity_reference_revisions module.
        $checklist_paragraph->dontSave = TRUE;

        $lesson_checklist_entity = $this->lessonChecklistStorage->create([
          'type' => 'lesson_checklist_result',
          'field_checklist_paragraph' => $checklist_paragraph,
        ]);
      }

      // Check additionally if user can create or update submission.
      if (!$lesson_checklist_entity->access('update')) {
        throw new NotAcceptableHttpException('User has no permissions to update checklist result');
      }

      $options = [];
      if (!$checklist_paragraph->field_checklist_items->isEmpty()) {
        // Add selected options to the array.
        foreach ($checklist_paragraph->field_checklist_items->getValue() as $option_values) {
          if (in_array($option_values['target_id'], $data['selected_option_ids'])) {
            $option_paragraph = Paragraph::load($option_values['target_id']);

            // Setting flag for workaround for preventing re saving paragraph
            // and changing parent_id.
            // Implementation made as patch for entity_reference_revisions
            // module.
            $option_paragraph->dontSave = TRUE;

            $options[] = $option_paragraph;
          }
        }
      }
      // Setting flag for workaround for preventing re saving paragraph
      // and changing parent_id.
      // Implementation made as patch for entity_reference_revisions module.
      // @todo rewrite to avoid dependance to patch to entity_reference_revisions module.
      $lesson_checklist_entity->field_checklist_paragraph->entity->dontSave = TRUE;

      $lesson_checklist_entity->set('field_checklist_selected_options', $options);
      $lesson_checklist_entity->save();
    }
    catch (\Exception $e) {
      $this->logger
        ->error("Can't create or update checklist result entity. Error: @error. Data: <pre>@data</pre>", [
          '@error' => $e->getMessage(),
          '@data' => print_r($data, 1),
        ]);
      throw new NotAcceptableHttpException("Can't submit or update checklist results. Error: " . $e->getMessage());
    }

    return new ResourceResponse(['lesson_checklist_id' => $lesson_checklist_entity->id()]);
  }

}
