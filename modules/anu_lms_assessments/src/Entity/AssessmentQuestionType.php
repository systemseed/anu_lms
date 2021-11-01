<?php

namespace Drupal\anu_lms_assessments\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBundleBase;

/**
 * Defines the Question type entity.
 *
 * @ConfigEntityType(
 *   id = "assessment_question_type",
 *   label = @Translation("Question type"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\anu_lms_assessments\AssessmentQuestionTypeListBuilder",
 *     "form" = {
 *       "add" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionTypeForm",
 *       "edit" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionTypeForm",
 *       "delete" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionTypeDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\anu_lms_assessments\AssessmentQuestionTypeHtmlRouteProvider",
 *     },
 *   },
 *   config_prefix = "assessment_question_type",
 *   admin_permission = "administer site configuration",
 *   bundle_of = "assessment_question",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid"
 *   },
 *   config_export = {
 *     "id",
 *     "label",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/assessment_question_type/{assessment_question_type}",
 *     "add-form" = "/admin/structure/assessment_question_type/add",
 *     "edit-form" = "/admin/structure/assessment_question_type/{assessment_question_type}/edit",
 *     "delete-form" = "/admin/structure/assessment_question_type/{assessment_question_type}/delete",
 *     "collection" = "/admin/structure/assessment_question_type"
 *   }
 * )
 */
class AssessmentQuestionType extends ConfigEntityBundleBase implements AssessmentQuestionTypeInterface {

  /**
   * The Question type ID.
   *
   * @var string
   */
  protected $id;

  /**
   * The Question type label.
   *
   * @var string
   */
  protected $label;

}
