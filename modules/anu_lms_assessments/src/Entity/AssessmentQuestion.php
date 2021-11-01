<?php

namespace Drupal\anu_lms_assessments\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\EditorialContentEntityBase;
use Drupal\Core\Entity\RevisionableInterface;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityPublishedTrait;
use Drupal\Core\Entity\EntityTypeInterface;

/**
 * Defines the Question entity.
 *
 * @ingroup assessments
 *
 * @ContentEntityType(
 *   id = "assessment_question",
 *   label = @Translation("Question"),
 *   bundle_label = @Translation("Question type"),
 *   handlers = {
 *     "storage" = "Drupal\anu_lms_assessments\AssessmentQuestionStorage",
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\anu_lms_assessments\AssessmentQuestionListBuilder",
 *     "views_data" = "Drupal\anu_lms_assessments\Entity\AssessmentQuestionViewsData",
 *     "translation" = "Drupal\anu_lms_assessments\AssessmentQuestionTranslationHandler",
 *     "form" = {
 *       "default" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionForm",
 *       "add" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionForm",
 *       "edit" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionForm",
 *       "delete" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\anu_lms_assessments\AssessmentQuestionHtmlRouteProvider",
 *     },
 *     "access" = "Drupal\anu_lms_assessments\AssessmentQuestionAccessControlHandler",
 *   },
 *   base_table = "assessment_question",
 *   data_table = "assessment_question_field_data",
 *   revision_table = "assessment_question_revision",
 *   revision_data_table = "assessment_question_field_revision",
 *   translatable = TRUE,
 *   permission_granularity = "bundle",
 *   admin_permission = "administer question entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "revision" = "vid",
 *     "bundle" = "type",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "langcode" = "langcode",
 *     "published" = "status",
 *   },
 *   revision_metadata_keys = {
 *     "revision_user" = "revision_user",
 *     "revision_created" = "revision_created",
 *     "revision_log_message" = "revision_log",
 *    },
 *   links = {
 *     "canonical" = "/admin/structure/assessment_question/{assessment_question}",
 *     "add-page" = "/admin/structure/assessment_question/add",
 *     "add-form" = "/admin/structure/assessment_question/add/{assessment_question_type}",
 *     "edit-form" = "/admin/structure/assessment_question/{assessment_question}/edit",
 *     "delete-form" = "/admin/structure/assessment_question/{assessment_question}/delete",
 *     "version-history" = "/admin/structure/assessment_question/{assessment_question}/revisions",
 *     "revision" = "/admin/structure/assessment_question/{assessment_question}/revisions/{assessment_question_revision}/view",
 *     "revision_revert" = "/admin/structure/assessment_question/{assessment_question}/revisions/{assessment_question_revision}/revert",
 *     "revision_delete" = "/admin/structure/assessment_question/{assessment_question}/revisions/{assessment_question_revision}/delete",
 *     "translation_revert" = "/admin/structure/assessment_question/{assessment_question}/revisions/{assessment_question_revision}/revert/{langcode}",
 *     "collection" = "/admin/structure/assessment_question",
 *   },
 *   bundle_entity_type = "assessment_question_type",
 *   field_ui_base_route = "entity.assessment_question_type.edit_form"
 * )
 */
class AssessmentQuestion extends EditorialContentEntityBase implements AssessmentQuestionInterface {

  use EntityChangedTrait;
  use EntityPublishedTrait;

  /**
   * {@inheritdoc}
   */
  protected function urlRouteParameters($rel) {
    $uri_route_parameters = parent::urlRouteParameters($rel);

    if ($rel === 'revision_revert' && $this instanceof RevisionableInterface) {
      $uri_route_parameters[$this->getEntityTypeId() . '_revision'] = $this->getRevisionId();
    }
    elseif ($rel === 'revision_delete' && $this instanceof RevisionableInterface) {
      $uri_route_parameters[$this->getEntityTypeId() . '_revision'] = $this->getRevisionId();
    }

    return $uri_route_parameters;
  }

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage) {
    parent::preSave($storage);

    // If no revision author has been set explicitly,
    // make the assessment_question owner the revision author.
    if (!$this->getRevisionUser()) {
      $this->setRevisionUserId(\Drupal::currentUser()->id());
    }

    // Force set new revision for all updated entities.
    if (!$this->isNew()) {
      $this->setNewRevision(TRUE);
    }
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
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Question'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 512,
        'text_processing' => 0,
      ])
      ->setTranslatable(TRUE)
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

    $fields['status']
      ->setDescription(t('A boolean indicating whether the Question is published.'))
      ->setDisplayOptions('form', ['region' => 'hidden']);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    $fields['revision_translation_affected'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Revision translation affected'))
      ->setDescription(t('Indicates if the last edit of a translation belongs to current revision.'))
      ->setReadOnly(TRUE)
      ->setRevisionable(TRUE)
      ->setTranslatable(TRUE);

    if (!empty($fields['revision_log_message'])) {
      $fields['revision_log_message']->setDisplayOptions('form', ['region' => 'hidden']);
    }

    return $fields;
  }

}
