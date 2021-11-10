<?php

namespace Drupal\anu_lms_assessments;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Link;

/**
 * Defines a class to build a listing of Question entities.
 *
 * @ingroup assessments
 */
class AssessmentQuestionListBuilder extends EntityListBuilder {

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Question ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /** @var \Drupal\anu_lms_assessments\Entity\AssessmentQuestion $entity */
    $row['id'] = $entity->id();
    $row['name'] = Link::createFromRoute(
      $entity->label(),
      'entity.assessment_question.edit_form',
      ['assessment_question' => $entity->id()]
    );
    return $row + parent::buildRow($entity);
  }

}
