<?php

namespace Drupal\anu_lms_assessments\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityPublishedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Assessment question result entity.
 *
 * @ingroup assessments
 *
 * @ContentEntityType(
 *   id = "assessment_question_result",
 *   label = @Translation("Question result"),
 *   bundle_label = @Translation("Question result type"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\anu_lms_assessments\AssessmentQuestionResultListBuilder",
 *     "views_data" = "Drupal\anu_lms_assessments\Entity\AssessmentQuestionResultViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionResultForm",
 *       "add" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionResultForm",
 *       "edit" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionResultForm",
 *       "delete" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionResultDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider",
 *     },
 *     "access" = "Drupal\anu_lms_assessments\AssessmentQuestionResultAccessControlHandler",
 *   },
 *   base_table = "assessment_question_result",
 *   translatable = FALSE,
 *   admin_permission = "administer assessment question result entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "bundle" = "type",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "published" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/assessment_question_result/{assessment_question_result}",
 *     "add-page" = "/admin/structure/assessment_question_result/add",
 *     "add-form" = "/admin/structure/assessment_question_result/add/{assessment_question_result_type}",
 *     "edit-form" = "/admin/structure/assessment_question_result/{assessment_question_result}/edit",
 *     "delete-form" = "/admin/structure/assessment_question_result/{assessment_question_result}/delete",
 *     "collection" = "/admin/structure/assessment_question_result",
 *   },
 *   bundle_entity_type = "assessment_question_result_type",
 *   field_ui_base_route = "entity.assessment_question_result_type.edit_form"
 * )
 */
class AssessmentQuestionResult extends ContentEntityBase implements AssessmentQuestionResultInterface {

  use EntityChangedTrait;
  use EntityPublishedTrait;

  const RESULT_CORRECT = 1;
  const RESULT_INCORRECT = 0;
  const RESULT_NOT_APPLICABLE = 2;

  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values) {
    parent::preCreate($storage_controller, $values);
    $values += [
      'user_id' => \Drupal::currentUser()->id(),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage) {

    // Automatically set the response label.
    try {
      $question = $this->get('aqid')->referencedEntities()[0];
      $this->setName('Response for: ' . $question->getName());
    }
    catch (\Exception $exception) {
      $this->setName('Response for: (no question)');
    }

    parent::preSave($storage);
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return $this->get('name')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setName($name) {
    $this->set('name', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime() {
    return $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime($timestamp) {
    $this->set('created', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner() {
    return $this->get('user_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId() {
    return $this->get('user_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid) {
    $this->set('user_id', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account) {
    $this->set('user_id', $account->id());
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    // Add the published field.
    $fields += static::publishedBaseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the Quiz question result entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'entity_reference_autocomplete',
        'weight' => 5,
        'settings' => [
          'match_operator' => 'CONTAINS',
          'size' => '60',
          'autocomplete_type' => 'tags',
          'placeholder' => '',
        ],
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the Quiz question result entity.'))
      ->setSettings([
        'max_length' => 512,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'region' => 'hidden',
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

    $fields['status']->setDescription(t('A boolean indicating whether the Quiz question result is published.'))
      ->setDisplayOptions('form', ['region' => 'hidden']);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    // Reference to the Question entity.
    $fields['aqid'] = BaseFieldDefinition::create('entity_reference_revisions')
      ->setLabel(t('Question'))
      ->setRequired(TRUE)
      ->setDescription(t('Reference to the Question asked.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'assessment_question')
      ->setSetting('handler', 'default')
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'entity_reference_revisions_entity_view',
        'weight' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'entity_reference_revisions_autocomplete',
        'weight' => 0,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    // Reference to the Assessment result entity.
    $fields['arid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Quiz result'))
      ->setDescription(t('Reference to the quiz result entity.'))
      ->setSetting('target_type', 'assessment_result')
      ->setSetting('handler', 'default')
      ->setDisplayOptions('form', [
        'type' => 'entity_reference_autocomplete',
        'weight' => -1,
        'settings' => [
          'match_operator' => 'CONTAINS',
          'size' => '60',
          'placeholder' => '',
        ],
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    // Answer's "correctness".
    $fields['is_correct'] = BaseFieldDefinition::create('list_string')
      ->setLabel('Is correct?')
      ->setDescription('Does the response match the correct answer?')
      ->setRequired(TRUE)
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setCardinality(1)
      ->setDisplayOptions('form', [
        'type' => 'options_select',
      ])
      ->setSetting('allowed_values', [
        AssessmentQuestionResult::RESULT_CORRECT => t('Yes'),
        AssessmentQuestionResult::RESULT_INCORRECT => t('No'),
        AssessmentQuestionResult::RESULT_NOT_APPLICABLE => t('Not applicable'),
      ]);

    return $fields;
  }

}
