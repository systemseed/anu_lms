<?php

namespace Drupal\anu_lms_assessments\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Assessment question result entities.
 *
 * @ingroup assessments
 */
interface AssessmentQuestionResultInterface extends ContentEntityInterface, EntityChangedInterface, EntityPublishedInterface, EntityOwnerInterface {

  /**
   * Add get/set methods for your configuration properties here.
   */

  /**
   * Gets the Assessment question result name.
   *
   * @return string
   *   Name of the Assessment question result.
   */
  public function getName();

  /**
   * Sets the Assessment question result name.
   *
   * @param string $name
   *   The Assessment question result name.
   *
   * @return \Drupal\anu_lms_assessments\Entity\AssessmentQuestionResultInterface
   *   The called Assessment question result entity.
   */
  public function setName($name);

  /**
   * Gets the Assessment question result creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Assessment question result.
   */
  public function getCreatedTime();

  /**
   * Sets the Assessment question result creation timestamp.
   *
   * @param int $timestamp
   *   The Assessment question result creation timestamp.
   *
   * @return \Drupal\anu_lms_assessments\Entity\AssessmentQuestionResultInterface
   *   The called Assessment question result entity.
   */
  public function setCreatedTime($timestamp);

}
