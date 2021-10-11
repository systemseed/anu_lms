<?php

namespace Drupal\anu_lms_assessments\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBundleBase;

/**
 * Defines the Assessment question result type entity.
 *
 * @ConfigEntityType(
 *   id = "assessment_question_result_type",
 *   label = @Translation("Question result type"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\anu_lms_assessments\AssessmentQuestionResultTypeListBuilder",
 *     "form" = {
 *       "add" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionResultTypeForm",
 *       "edit" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionResultTypeForm",
 *       "delete" = "Drupal\anu_lms_assessments\Form\AssessmentQuestionResultTypeDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\anu_lms_assessments\AssessmentQuestionResultTypeHtmlRouteProvider",
 *     },
 *   },
 *   config_prefix = "assessment_question_result_type",
 *   admin_permission = "administer site configuration",
 *   bundle_of = "assessment_question_result",
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
 *     "canonical" = "/admin/structure/assessment_question_result_type/{assessment_question_result_type}",
 *     "add-form" = "/admin/structure/assessment_question_result_type/add",
 *     "edit-form" = "/admin/structure/assessment_question_result_type/{assessment_question_result_type}/edit",
 *     "delete-form" = "/admin/structure/assessment_question_result_type/{assessment_question_result_type}/delete",
 *     "collection" = "/admin/structure/assessment_question_result_type"
 *   }
 * )
 */
class AssessmentQuestionResultType extends ConfigEntityBundleBase implements AssessmentQuestionResultTypeInterface {

  /**
   * The Assessment question result type ID.
   *
   * @var string
   */
  protected $id;

  /**
   * The Assessment question result type label.
   *
   * @var string
   */
  protected $label;

}
