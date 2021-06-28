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
    questions: fields
      .getArrayValue(node, 'field_module_assessment_items')
      .map((paragraph) => transformParagraph(paragraph)),
  };
};

/**
 * Transform lesson page content from Drupal backend into frontend-friendly object.
 */
const transformLessonPage = ({ data }) => {
  const lesson = (data && data.module_lesson) || {};
  const quiz = (data && data.module_assessment) || {};
  const course = (data && data.course) || {};

  return {
    lesson: transformLesson(lesson),
    quiz: transformQuiz(quiz),
    course: transformCourse(course),
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

export {
  transformChecklistResults,
  transformLesson,
  transformQuiz,
  transformLessonPage,
  lessonPropTypes,
};
