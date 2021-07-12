import PropTypes from 'prop-types';
import * as fields from '@anu/utilities/fields';
import { transformCourse } from '@anu/utilities/transform.course';
import { transformParagraph } from '@anu/utilities/transform.paragraphs';

/**
 * Transform checklist result data from Drupal backend
 * into frontend-friendly object.
 */
const transformChecklistResults = ({ field_checklist_selected_options = [] }) =>
  field_checklist_selected_options.map((option) => ({ id: fields.getNumberValue(option, 'id') }));

/**
 * Transform lesson node from Drupal backend
 * into frontend-friendly object.
 */
const transformLesson = (node) => {
  if (!fields.getNumberValue(node, 'nid')) {
    return null;
  }

  return {
    id: fields.getNumberValue(node, 'nid'),
    title: fields.getTextValue(node, 'title'),
    url: fields.getNodeUrl(node),
    sections: fields
      .getArrayValue(node, 'field_module_lesson_content')
      .map((content) =>
        fields
          .getArrayValue(content, 'field_lesson_section_content')
          .map((paragraph) => transformParagraph(paragraph))
      ),
  };
};

/**
 * Transform quiz node from Drupal backend
 * into frontend-friendly object.
 */
const transformQuiz = (node) => {
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
 * Transform lesson page content from Drupal backend into frontend-friendly
 * object.
 */
const transformLessonPage = ({ data }) => {
  const lesson = data && data.module_lesson ? transformLesson(data.module_lesson) : null;
  const quiz = data && data.module_assessment ? transformQuiz(data.module_assessment) : null;
  const course = data && data.course ? transformCourse(data.course) : null;

  quiz.correctValuesCount = !!data && !isNaN(data.correct_answers) ? data.correct_answers : -1

  const quizSubmission = (data && data.results) || null;
  if (quiz && quizSubmission) {
    quiz.canSubmit = false;
    quiz.isSubmitted = true
    quiz.questions = quiz.questions.map(question => {
      if (question.aqid && question.aqid in quizSubmission) {
        question.submittedAnswer = quizSubmission[question.aqid];
      }
      return question;
    })
  }
  else {
    quiz.canSubmit = true;
  }

  return {
    lesson,
    quiz,
    course,
  };
};

/**
 * Define expected prop types for lesson.
 */
const lessonPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        bundle: PropTypes.string.isRequired,
      })
    )
  ),
});

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
});

export {
  transformChecklistResults,
  transformLesson,
  transformQuiz,
  transformLessonPage,
  lessonPropTypes,
  quizPropTypes,
};
