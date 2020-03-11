<?php

namespace Drupal\anu_lms_assessments\Controller;

use Drupal\anu_lms_assessments\Entity\AssessmentQuestionInterface;
use Drupal\Core\Controller\ControllerBase;


class AssessmentQuestionResponsesController extends ControllerBase {

  public function title(AssessmentQuestionInterface $assessment_question) {
    return $assessment_question->label();
  }

  public function page(AssessmentQuestionInterface $assessment_question) {
    $build = [];
    $build['question_responses'] = [
      '#type' => 'view',
      '#name' => 'assessments_question_responses',
      '#display_id' => 'question_results_embed',
      '#arguments' => [$assessment_question->id()],
      '#embed' => TRUE,
    ];

    return $build;
  }

  public function checkAccess(AssessmentQuestionInterface $assessment_question) {
    $access_control_handler = $this->entityTypeManager()->getAccessControlHandler('assessment_question');
    // TODO: Separate access to view the results?
    return $access_control_handler->access($assessment_question, 'update', NULL, TRUE);
  }

}
