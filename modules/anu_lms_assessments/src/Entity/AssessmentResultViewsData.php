<?php

namespace Drupal\anu_lms_assessments\Entity;

use Drupal\views\EntityViewsData;

/**
 * Provides Views data for Assessment result entities.
 */
class AssessmentResultViewsData extends EntityViewsData {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    // Additional information for Views integration, such as table joins, can be
    // put here.
    return $data;
  }

}
