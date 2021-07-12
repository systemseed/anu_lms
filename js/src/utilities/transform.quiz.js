import * as fields from "@anu/utilities/fields";
import {transformParagraph} from "@anu/utilities/transform.paragraphs";
import PropTypes from "prop-types";

/**
 * Transforms quiz content from backend API into quiz
 * object.
 */
const transformQuiz = (data) => {
  const quiz = transformQuizQuestions(data.module_assessment)
  addCorrectValuesCount(quiz, data);
  addSubmissionData(quiz, data);
  return quiz;
}


/**
 * Adds the number of correct responses if quiz already submitted
 * defaults to -1 if not
 */
const addCorrectValuesCount = (quiz, data) => {
  quiz.correctValuesCount = !isNaN(data.correct_answers) ? data.correct_answers : -1
}


/**
 * Adds previously submitted answers if available
 */
const addSubmissionData = (quiz, data) => {
  if (data.results) {
    quiz.canSubmit = false;
    quiz.isSubmitted = true
    quiz.questions = quiz.questions.map(addSubmittedAnswer(data.results))
  }
  else {
    quiz.canSubmit = true;
  }
}

/**
 * Adds a submitted answer to a question
 */
const addSubmittedAnswer = (quizSubmission) => {
  return question => {
    if (question.aqid && question.aqid in quizSubmission) {
      question.submittedAnswer = quizSubmission[question.aqid];
    }
    return question;
  };
}

/**
 * Transform quiz content from Drupal backend into frontend-friendly
 * object.
 */
const transformQuizQuestions = (node) => {
  if (!fields.getNumberValue(node, 'nid')) {
    return null;
  }

  return {
    id: fields.getNumberValue(node, 'nid'),
    title: fields.getTextValue(node, 'title'),
    url: fields.getNodeUrl(node),
    isSingleSubmission: fields.getBooleanValue(node, 'field_no_multiple_submissions'),
    questions: fields
      .getArrayValue(node, 'field_module_assessment_items')
      .map((paragraph) => transformParagraph(paragraph)),
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
  question: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      bundle: PropTypes.string.isRequired,
    })
  ),
  correctValuesCount: PropTypes.number,
  canSubmit: PropTypes.bool,
  isSubmitted: PropTypes.bool,
});

export {
  transformQuiz,
  quizPropTypes
}
