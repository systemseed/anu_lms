<?php

namespace Drupal\anu_lms_assessments;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Link;

/**
 * Defines a class to build a listing of Assessment question result entities.
 *
 * @ingroup assessments
 */
class AssessmentQuestionResultListBuilder extends EntityListBuilder {

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Question result ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /** @var \Drupal\anu_lms_assessments\Entity\AssessmentQuestionResult $entity */
    $row['id'] = $entity->id();
    $row['name'] = Link::createFromRoute(
      $entity->label(),
      'entity.assessment_question_result.edit_form',
      ['assessment_question_result' => $entity->id()]
    );
    return $row + parent::buildRow($entity);
  }

}
