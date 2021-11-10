<?php

namespace Drupal\anu_lms_assessments\Form;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a form for deleting a Question revision.
 *
 * @ingroup assessments
 */
class AssessmentQuestionRevisionDeleteForm extends ConfirmFormBase {

  /**
   * The Question revision.
   *
   * @var \Drupal\anu_lms_assessments\Entity\AssessmentQuestionInterface
   */
  protected $revision;

  /**
   * The Question storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $assessmentQuestionStorage;

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $connection;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    $instance->assessmentQuestionStorage = $container->get('entity_type.manager')->getStorage('assessment_question');
    $instance->connection = $container->get('database');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'assessment_question_revision_delete_confirm';
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    return $this->t('Are you sure you want to delete the revision from %revision-date?', [
      '%revision-date' => format_date($this->revision->getRevisionCreationTime()),
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return new Url('entity.assessment_question.version_history', ['assessment_question' => $this->revision->id()]);
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Delete');
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $assessment_question_revision = NULL) {
    $this->revision = $this->AssessmentQuestionStorage->loadRevision($assessment_question_revision);
    $form = parent::buildForm($form, $form_state);

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->AssessmentQuestionStorage->deleteRevision($this->revision->getRevisionId());

    $this->logger('content')->notice('Question: deleted %title revision %revision.', [
      '%title' => $this->revision->label(),
      '%revision' => $this->revision->getRevisionId(),
    ]);
    $this->messenger()->addMessage($this->t('Revision from %revision-date of Question %title has been deleted.', [
      '%revision-date' => format_date($this->revision->getRevisionCreationTime()),
      '%title' => $this->revision->label(),
    ]));
    $form_state->setRedirect(
      'entity.assessment_question.canonical',
       ['assessment_question' => $this->revision->id()]
    );
    if ($this->connection->query('SELECT COUNT(DISTINCT vid) FROM {assessment_question_field_revision} WHERE id = :id', [':id' => $this->revision->id()])->fetchField() > 1) {
      $form_state->setRedirect(
        'entity.assessment_question.version_history',
         ['assessment_question' => $this->revision->id()]
      );
    }
  }

}
