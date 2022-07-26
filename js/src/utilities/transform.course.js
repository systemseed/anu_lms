import PropTypes from 'prop-types';
import * as fields from '@anu/utilities/fields';
import { transformLesson } from '@anu/utilities/transform.lesson';
import { transformQuiz } from '@anu/utilities/transform.quiz';
import {
  transformCourseCategory,
  courseCategoryPropTypes,
} from '@anu/utilities/transform.courseCategory';
import { calculateProgressPercent, prepareCourseProgress } from '@anu/utilities/progress';

/**
 * Transform course node from Drupal backend
 * into frontend-friendly object.
 */
const transformCourse = (node, data) => {
  // Make sure the course node data exists.
  if (!fields.getNumberValue(node, 'nid')) {
    return null;
  }

  const courseId = fields.getNumberValue(node, 'nid');
  // Prepare courses pages for current course.
  let coursesPageUrls = [];
  if (data.courses_page_urls_by_course) {
    data.courses_page_urls_by_course.map((item) => {
      if (item.course_id === courseId) {
        coursesPageUrls = item.courses_page_urls;
      }
    });
  }

  // Prepare first lesson url for current course.
  let firstLessonUrl = '';
  if (data.first_lesson_url_by_course) {
    data.first_lesson_url_by_course.map((set) => {
      if (set.course_id === courseId) {
        firstLessonUrl = set.first_lesson_url;
      }
    });
  }

  const progress = prepareCourseProgress(node);
  const transform = {
    id: courseId,
    title: fields.getTextValue(node, 'title'),
    description: fields.getTextValue(node, 'field_course_description'),
    url: fields.getNodeUrl(node),
    image: fields.getImage(node, 'field_course_image', 'course_preview'),
    categories: fields
      .getArrayValue(node, 'field_course_category')
      .map((term) => transformCourseCategory(term)),
    labels: fields
      .getArrayValue(node, 'field_course_label')
      .map((term) => fields.getTextValue(term, 'name')),
    content: fields.getArrayValue(node, 'field_course_module').map((module) => ({
      module: fields.getTextValue(module, 'field_module_title'),
      lessons: fields
        .getArrayValue(module, 'field_module_lessons')
        .map((lesson) => transformLesson(lesson, { id: courseId, progress }))
        .filter((lesson) => !!lesson),
      quiz: transformQuiz(fields.getArrayValue(module, 'field_module_assessment')[0], data, {
        id: courseId,
        progress,
      }),
    })),
    courses_page_urls: coursesPageUrls,
    first_lesson_url: firstLessonUrl,
    progress,
    progress_percent: calculateProgressPercent(progress),
    // TODO: add support for offline unlocking of courses in categories.
    locked: fields.getBooleanValue(node, 'locked'),
    audios: fields.getArrayValue(node, 'audios'),
    content_urls: fields.getArrayValue(node, 'content_urls'),
  };

  // If progress is available, point first lesson URL to the first non-restricted lesson.
  if (progress) {
    let currentLesson = Object.values(progress).find((lesson) => lesson.prev === 0);
    if (currentLesson) {
      while (currentLesson.next && !progress[currentLesson.next].restricted) {
        currentLesson = progress[currentLesson.next];
      }
      return {
        ...transform,
        first_lesson_url: currentLesson.url,
      };
    }
  }

  return transform;
};

/**
 * Define expected prop types for course.
 */
const coursePropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  categories: PropTypes.arrayOf(courseCategoryPropTypes),
  content: PropTypes.arrayOf(
    PropTypes.shape({
      module: PropTypes.string,
      // TODO: Use lesson's prop type.
      lessons: PropTypes.arrayOf(PropTypes.shape({})),
    })
  ),
  labels: PropTypes.arrayOf(PropTypes.string),
  courses_pages: PropTypes.arrayOf(PropTypes.shape({})),
  first_lesson_url: PropTypes.string,
  progress: PropTypes.shape({}),
  progress_percent: PropTypes.number.isRequired,
  locked: PropTypes.bool,
  audios: PropTypes.arrayOf(PropTypes.string),
});

export { transformCourse, coursePropTypes };
