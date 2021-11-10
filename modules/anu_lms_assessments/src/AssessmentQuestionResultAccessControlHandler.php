<?php

namespace Drupal\anu_lms_assessments;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Assessment question result entity.
 *
 * @see \Drupal\anu_lms_assessments\Entity\AssessmentQuestionResult.
 */
class AssessmentQuestionResultAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\anu_lms_assessments\Entity\AssessmentQuestionResultInterface $entity */

    switch ($operation) {

      case 'view':

        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished assessment question result entities');
        }

        return AccessResult::allowedIfHasPermission($account, 'view published assessment question result entities');

      case 'update':

        return AccessResult::allowedIfHasPermission($account, 'edit assessment question result entities');

      case 'delete':

        return AccessResult::allowedIfHasPermission($account, 'delete assessment question result entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add assessment question result entities');
  }

}
