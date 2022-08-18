import * as fields from '@anu/utilities/fields';
import { transformParagraph } from '@anu/utilities/transform.paragraphs';
import PropTypes from 'prop-types';
import { completeLesson, isLessonCompleted, isLessonRestricted } from '@anu/utilities/progress';

/**
 * Transforms quiz content from backend API into quiz
 * object.
 */
const transformQuiz = (module_data, data, course) => {
  const quiz = transformQuizQuestions(module_data, course);
  if (quiz) {
    addSubmissionData(quiz, data);
  }
  return quiz;
};

/**
 * Adds previously submitted answers/scores if available
 */
const addSubmissionData = (quiz, data) => {
  if (data.results) {
    quiz.isSubmitted = true;
    quiz.questions = quiz.questions.map(addSubmittedAnswer(data.results));
  } else {
    quiz.isSubmitted = false;
  }
  quiz.correctValuesCount = !isNaN(data.correct_answers) ? data.correct_answers : -1;
};

/**
 * Adds a submitted answer to a question
 */
const addSubmittedAnswer = (quizSubmission) => {
  return (question) => {
    if (question.aqid && question.aqid in quizSubmission) {
      question.submittedAnswer = quizSubmission[question.aqid];
    }
    return question;
  };
};

/**
 * Transform quiz content from Drupal backend into frontend-friendly
 * object.
 */
const transformQuizQuestions = (node, course) => {
  if (!fields.getNumberValue(node, 'nid')) {
    return null;
  }

  const id = fields.getNumberValue(node, 'nid');

  return {
    id,
    title: fields.getTextValue(node, 'title'),
    url: fields.getNodeUrl(node),
    isSingleSubmission: fields.getBooleanValue(node, 'field_no_multiple_submissions'),
    isCompleted: isLessonCompleted(course, id),
    isRestricted: isLessonRestricted(course, id),
    finishButtonUrl: fields.getTextValue(node, 'finish_button_url'),
    questions: fields
      .getArrayValue(node, 'field_module_assessment_items')
      .map((paragraph) => transformParagraph(paragraph)),
    complete: async () => await completeLesson(course, id),
  };
};

/**
 * Define expected prop types for quiz.
 */
const quizPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isSingleSubmission: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  correctValuesCount: PropTypes.number.isRequired,
  question: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      bundle: PropTypes.string.isRequired,
    })
  ),
});

export { transformQuiz, quizPropTypes };
