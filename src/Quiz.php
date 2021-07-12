<?php


namespace Drupal\anu_lms;


use Drupal\anu_lms_assessments\Entity\AssessmentQuestionResult;
use Drupal\entity_reference_revisions\EntityReferenceRevisionsFieldItemList;
use Drupal\node\NodeInterface;

class Quiz
{
  const FIELD_NO_MULTIPLE_SUBMISSIONS = 'field_no_multiple_submissions';
  const FIELD_QUESTION_RESPONSE = 'field_question_response';

  /**
   * Returns data for Quiz submissions.
   *
   * @param NodeInterface $node
   *   Quiz node
   *
   * @param array $data
   *   Data to be returned
   */
  public function getQuizSubmissionData(NodeInterface $node, array &$data){
    if ($node->hasField(self::FIELD_NO_MULTIPLE_SUBMISSIONS)) {
      if (!empty($node->get(self::FIELD_NO_MULTIPLE_SUBMISSIONS)->getString())) {

        $last_submitted_quiz = \Drupal::entityQuery('assessment_result')
          ->condition('user_id', \Drupal::currentUser()->id())
          ->condition('aid', $node->id())
          ->sort('created', 'DESC')
          ->range(0, 1)
          ->execute();

        $assessment_id = reset($last_submitted_quiz);

        $submitted_answer_ids = \Drupal::entityQuery('assessment_question_result')
          ->condition('arid', $assessment_id)
          ->execute();

        /** @var AssessmentQuestionResult[] $answers */
        $answers = \Drupal::entityTypeManager()
          ->getStorage('assessment_question_result')
          ->loadMultiple($submitted_answer_ids);

        $results = [];
        $correct_answers = 0;
        foreach ($answers as $answer) {

          $response = NULL;
          if ($answer->bundle() == 'short_answer' && $answer->hasField(self::FIELD_QUESTION_RESPONSE)) {
            $response = $answer->get(self::FIELD_QUESTION_RESPONSE)->getString();
          } elseif ($answer->bundle() == 'long_answer' && $answer->hasField(self::FIELD_QUESTION_RESPONSE.'_long')) {
            $response = $answer->get(self::FIELD_QUESTION_RESPONSE.'_long')->getString();
          } elseif ($answer->bundle() == 'scale') {
            $response = (int)$answer->get(self::FIELD_QUESTION_RESPONSE.'_scale')->getString();
          } elseif (($answer->bundle() == 'multiple_choice' || $answer->bundle() == 'single_choice') && $answer->hasField('field_single_multi_choice')) {
            /** @var EntityReferenceRevisionsFieldItemList[] $field_items */
            $field_items = $answer->get('field_single_multi_choice');
            foreach ($field_items as $value) {
              $response[] = $value->getValue()['target_id'];
            }

            if (!empty($response) && $answer->bundle() == 'single_choice') {
              $response = reset($response);
            }
          }

          if (!empty($response)) {
            $question_id = (int)$answer->get('aqid')->getString();
            $results[$question_id] = $response;
          }
          $result = (int)$answer->get('is_correct')->getString();
          if ($this->_isCorrectAnswer($result)) {
            $correct_answers++;
          }
        }
        if (!empty($results)) {
          $data['results'] = $results;
          $data['correct_answers'] = $correct_answers;
        }
      }
    }
  }


  /**
   * @param int $answer
   *   The answer.
   *
   *
   * @return bool
   *   Returns true if the result a correct answer.
   */
  protected function _isCorrectAnswer($answer)
  {
    return !($answer == AssessmentQuestionResult::RESULT_INCORRECT);
  }


}
