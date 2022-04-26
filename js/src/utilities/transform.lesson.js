import PropTypes from 'prop-types';
import * as fields from '@anu/utilities/fields';
import { transformCourse } from '@anu/utilities/transform.course';
import { transformParagraph } from '@anu/utilities/transform.paragraphs';
import { transformQuiz } from '@anu/utilities/transform.quiz';
import { completeLesson, isLessonCompleted, isLessonRestricted } from '@anu/utilities/progress';

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
const transformLesson = (node, course) => {
  if (!fields.getNumberValue(node, 'nid')) {
    return null;
  }
  const lessonId = fields.getNumberValue(node, 'nid');

  return {
    id: lessonId,
    title: fields.getTextValue(node, 'title'),
    url: fields.getNodeUrl(node),
    isCompleted: isLessonCompleted(course, lessonId),
    isRestricted: isLessonRestricted(course, lessonId),
    sections: fields
      .getArrayValue(node, 'field_module_lesson_content')
      .map((content) =>
        fields
          .getArrayValue(content, 'field_lesson_section_content')
          .map((paragraph) => transformParagraph(paragraph))
      ),
    finishButtonText: fields.getTextValue(node, 'finish_button_text'),
    finishButtonUrl: fields.getTextValue(node, 'finish_button_url'),
    complete: async () => await completeLesson(course, lessonId),
  };
};

/**
 * Transform lesson page content from Drupal backend into frontend-friendly
 * object.
 */
const transformLessonPage = ({ data }) => {
  const course = data && data.course ? transformCourse(data.course, data) : null;
  const lesson = data && data.module_lesson ? transformLesson(data.module_lesson, course) : null;
  const quiz =
    data && data.module_assessment ? transformQuiz(data.module_assessment, data, course) : null;

  return {
    course,
    lesson,
    quiz,
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
