<?php

namespace Drupal\anu_lms_assessments\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Assessment result entities.
 *
 * @ingroup assessments
 */
interface AssessmentResultInterface extends ContentEntityInterface, EntityChangedInterface, EntityPublishedInterface, EntityOwnerInterface {

  /**
   * Add get/set methods for your configuration properties here.
   */

  /**
   * Gets the Assessment result name.
   *
   * @return string
   *   Name of the Assessment result.
   */
  public function getName();

  /**
   * Sets the Assessment result name.
   *
   * @param string $name
   *   The Assessment result name.
   *
   * @return \Drupal\anu_lms_assessments\Entity\AssessmentResultInterface
   *   The called Assessment result entity.
   */
  public function setName($name);

  /**
   * Gets the Assessment result creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Assessment result.
   */
  public function getCreatedTime();

  /**
   * Sets the Assessment result creation timestamp.
   *
   * @param int $timestamp
   *   The Assessment result creation timestamp.
   *
   * @return \Drupal\anu_lms_assessments\Entity\AssessmentResultInterface
   *   The called Assessment result entity.
   */
  public function setCreatedTime($timestamp);

}
