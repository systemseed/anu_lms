<?php

namespace Drupal\anu_lms_assessments;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Question entity.
 *
 * @see \Drupal\anu_lms_assessments\Entity\AssessmentQuestion.
 */
class AssessmentQuestionAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\anu_lms_assessments\Entity\AssessmentQuestionInterface $entity */

    switch ($operation) {

      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished question entities');
        }

        return AccessResult::allowedIfHasPermission($account, 'view published question entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit question entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete question entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add question entities');
  }

  /**
   * Test for given 'own' permission.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   Entity to check.
   * @param string $operation
   *   The operation to perform.
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The account to check.
   *
   * @return string|null
   *   The permission string indicating it's allowed.
   */
  protected function checkOwn(EntityInterface $entity, $operation, AccountInterface $account) {
    $status = $entity->isPublished();
    $uid = $entity->getOwnerId();

    $is_own = $account->isAuthenticated() && $account->id() == $uid;
    if (!$is_own) {
      return;
    }

    $bundle = $entity->bundle();

    $ops = [
      'create' => '%bundle add own %bundle entities',
      'view unpublished' => '%bundle view own unpublished %bundle entities',
      'view' => '%bundle view own entities',
      'update' => '%bundle edit own entities',
      'delete' => '%bundle delete own entities',
    ];
    $permission = strtr($ops[$operation], ['%bundle' => $bundle]);

    if ($operation === 'view unpublished') {
      if (!$status && $account->hasPermission($permission)) {
        return $permission;
      }
      else {
        return NULL;
      }
    }
    if ($account->hasPermission($permission)) {
      return $permission;
    }

    return NULL;
  }

}
