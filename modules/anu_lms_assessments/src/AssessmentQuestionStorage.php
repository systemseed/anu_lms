<?php

namespace Drupal\anu_lms_assessments;

use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\anu_lms_assessments\Entity\AssessmentQuestionInterface;

/**
 * Defines the storage handler class for Question entities.
 *
 * This extends the base storage class, adding required special handling for
 * Question entities.
 *
 * @ingroup assessments
 */
class AssessmentQuestionStorage extends SqlContentEntityStorage {

  /**
   * {@inheritdoc}
   */
  public function revisionIds(AssessmentQuestionInterface $entity) {
    return $this->database->query(
      'SELECT vid FROM {assessment_question_revision} WHERE id=:id ORDER BY vid',
      [':id' => $entity->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function userRevisionIds(AccountInterface $account) {
    return $this->database->query(
      'SELECT vid FROM {assessment_question_field_revision} WHERE uid = :uid ORDER BY vid',
      [':uid' => $account->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function countDefaultLanguageRevisions(AssessmentQuestionInterface $entity) {
    return $this->database->query('SELECT COUNT(*) FROM {assessment_question_field_revision} WHERE id = :id AND default_langcode = 1', [':id' => $entity->id()])
      ->fetchField();
  }

  /**
   * {@inheritdoc}
   */
  public function clearRevisionsLanguage(LanguageInterface $language) {
    return $this->database->update('assessment_question_revision')
      ->fields(['langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED])
      ->condition('langcode', $language->getId())
      ->execute();
  }

}
