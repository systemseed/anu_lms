<?php

namespace Drupal\anu_lms_assessments;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Assessment result entity.
 *
 * @see \Drupal\anu_lms_assessments\Entity\AssessmentResult.
 */
class AssessmentResultAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\anu_lms_assessments\Entity\AssessmentResultInterface $entity */

    switch ($operation) {

      case 'view':

        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished assessment result entities');
        }

        return AccessResult::allowedIfHasPermission($account, 'view published assessment result entities');

      case 'update':

        return AccessResult::allowedIfHasPermission($account, 'edit assessment result entities');

      case 'delete':

        return AccessResult::allowedIfHasPermission($account, 'delete assessment result entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add assessment result entities');
  }

}
