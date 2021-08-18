import PropTypes from 'prop-types';
import * as fields from '@anu/utilities/fields';
import { transformCourse } from '@anu/utilities/transform.course';
import { transformParagraph } from '@anu/utilities/transform.paragraphs';
import { transformQuiz } from '@anu/utilities/transform.quiz';

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
    isCompleted: fields.getBooleanValue(node, 'is_completed'),
    isRestricted: fields.getBooleanValue(node, 'is_restricted'),
    sections: fields
      .getArrayValue(node, 'field_module_lesson_content')
      .map((content) =>
        fields
          .getArrayValue(content, 'field_lesson_section_content')
          .map((paragraph) => transformParagraph(paragraph))
      ),
    finishButtonText: fields.getTextValue(node, 'finish_button_text'),
  };
};

/**
 * Transform lesson page content from Drupal backend into frontend-friendly
 * object.
 */
const transformLessonPage = ({ data }) => {
  const lesson = data && data.module_lesson ? transformLesson(data.module_lesson) : null;
  const quiz = data && data.module_assessment ? transformQuiz(data.module_assessment, data) : null;
  const course = data && data.course ? transformCourse(data.course, data) : null;

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

export { transformChecklistResults, transformLesson, transformLessonPage, lessonPropTypes };
