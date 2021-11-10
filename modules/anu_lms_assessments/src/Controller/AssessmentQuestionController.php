<?php

namespace Drupal\anu_lms_assessments\Controller;

use Drupal\Component\Utility\Xss;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Url;
use Drupal\anu_lms_assessments\Entity\AssessmentQuestionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Returns responses for Question routes.
 */
class AssessmentQuestionController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * The date formatter.
   *
   * @var \Drupal\Core\Datetime\DateFormatter
   */
  protected $dateFormatter;

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Render\Renderer
   */
  protected $renderer;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    $instance->dateFormatter = $container->get('date.formatter');
    $instance->renderer = $container->get('renderer');
    return $instance;
  }

  /**
   * Displays a Question revision.
   *
   * @param int $assessment_question_revision
   *   The Question revision ID.
   *
   * @return array
   *   An array suitable for drupal_render().
   */
  public function revisionShow($assessment_question_revision) {
    $assessment_question = $this->entityTypeManager()->getStorage('assessment_question')
      ->loadRevision($assessment_question_revision);
    $view_builder = $this->entityTypeManager()->getViewBuilder('assessment_question');

    return $view_builder->view($assessment_question);
  }

  /**
   * Page title callback for a Question revision.
   *
   * @param int $assessment_question_revision
   *   The Question revision ID.
   *
   * @return string
   *   The page title.
   */
  public function revisionPageTitle($assessment_question_revision) {
    $assessment_question = $this->entityTypeManager()->getStorage('assessment_question')
      ->loadRevision($assessment_question_revision);
    return $this->t('Revision of %title from %date', [
      '%title' => $assessment_question->label(),
      '%date' => $this->dateFormatter->format($assessment_question->getRevisionCreationTime()),
    ]);
  }

  /**
   * Generates an overview table of older revisions of a Question.
   *
   * @param \Drupal\anu_lms_assessments\Entity\AssessmentQuestionInterface $assessment_question
   *   A Question object.
   *
   * @return array
   *   An array as expected by drupal_render().
   */
  public function revisionOverview(AssessmentQuestionInterface $assessment_question) {
    $account = $this->currentUser();
    $assessment_question_storage = $this->entityTypeManager()->getStorage('assessment_question');

    $langcode = $assessment_question->language()->getId();
    $langname = $assessment_question->language()->getName();
    $languages = $assessment_question->getTranslationLanguages();
    $has_translations = (count($languages) > 1);
    $build['#title'] = $has_translations ? $this->t('@langname revisions for %title', [
      '@langname' => $langname,
      '%title' => $assessment_question->label(),
    ]) : $this->t('Revisions for %title', [
      '%title' => $assessment_question->label(),
    ]);

    $header = [$this->t('Revision'), $this->t('Operations')];
    $revert_permission = (($account->hasPermission("revert all question revisions") || $account->hasPermission('administer question entities')));
    $delete_permission = (($account->hasPermission("delete all question revisions") || $account->hasPermission('administer question entities')));

    $rows = [];

    $vids = $assessment_question_storage->revisionIds($assessment_question);

    $latest_revision = TRUE;

    foreach (array_reverse($vids) as $vid) {
      /** @var \Drupal\anu_lms_assessments\AssessmentQuestionInterface $revision */
      $revision = $assessment_question_storage->loadRevision($vid);
      // Only show revisions that are affected by the language that is being
      // displayed.
      if ($revision->hasTranslation($langcode) && $revision->getTranslation($langcode)->isRevisionTranslationAffected()) {
        $username = [
          '#theme' => 'username',
          '#account' => $revision->getRevisionUser(),
        ];

        // Use revision link to link to revisions that are not active.
        $date = $this->dateFormatter->format($revision->getRevisionCreationTime(), 'short');
        if ($vid != $assessment_question->getRevisionId()) {
          $link = $this->l($date, new Url('entity.assessment_question.revision', [
            'assessment_question' => $assessment_question->id(),
            'assessment_question_revision' => $vid,
          ]));
        }
        else {
          $link = $assessment_question->link($date);
        }

        $row = [];
        $column = [
          'data' => [
            '#type' => 'inline_template',
            '#template' => '{% trans %}{{ date }} by {{ username }}{% endtrans %}{% if message %}<p class="revision-log">{{ message }}</p>{% endif %}',
            '#context' => [
              'date' => $link,
              'username' => $this->renderer->renderPlain($username),
              'message' => [
                '#markup' => $revision->getRevisionLogMessage(),
                '#allowed_tags' => Xss::getHtmlTagList(),
              ],
            ],
          ],
        ];
        $row[] = $column;

        if ($latest_revision) {
          $row[] = [
            'data' => [
              '#prefix' => '<em>',
              '#markup' => $this->t('Current revision'),
              '#suffix' => '</em>',
            ],
          ];
          foreach ($row as &$current) {
            $current['class'] = ['revision-current'];
          }
          $latest_revision = FALSE;
        }
        else {
          $links = [];
          if ($revert_permission) {
            $links['revert'] = [
              'title' => $this->t('Revert'),
              'url' => $has_translations ?
              Url::fromRoute('entity.assessment_question.translation_revert', [
                'assessment_question' => $assessment_question->id(),
                'assessment_question_revision' => $vid,
                'langcode' => $langcode,
              ]) :
              Url::fromRoute('entity.assessment_question.revision_revert', [
                'assessment_question' => $assessment_question->id(),
                'assessment_question_revision' => $vid,
              ]),
            ];
          }

          if ($delete_permission) {
            $links['delete'] = [
              'title' => $this->t('Delete'),
              'url' => Url::fromRoute('entity.assessment_question.revision_delete', [
                'assessment_question' => $assessment_question->id(),
                'assessment_question_revision' => $vid,
              ]),
            ];
          }

          $row[] = [
            'data' => [
              '#type' => 'operations',
              '#links' => $links,
            ],
          ];
        }

        $rows[] = $row;
      }
    }

    $build['assessment_question_revisions_table'] = [
      '#theme' => 'table',
      '#rows' => $rows,
      '#header' => $header,
    ];

    return $build;
  }

}
