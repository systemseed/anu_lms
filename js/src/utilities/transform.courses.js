import PropTypes from 'prop-types';
import { transformCourse, coursePropTypes } from '@anu/utilities/transform.course';
import {
  transformCourseCategory,
  courseCategoryPropTypes,
} from '@anu/utilities/transform.courseCategory';
import * as fields from '@anu/utilities/fields';

const transformCoursesPage = ({ data }) => {
  const node = data.courses_page || {};

  return {
    title: fields.getTextValue(node, 'title'),
    url: fields.getNodeUrl(node),
    courses: fields.getArrayValue(data, 'courses').map((item) => transformCourse(item, data)),
    sections: fields
      .getArrayValue(node, 'field_courses_content')
      .flatMap((section) =>
        fields
          .getArrayValue(section, 'field_course_category')
          .map((category) => transformCourseCategory(category))
      ),
  };
};

/**
 * Define expected prop types for courses page.
 */
const coursesPagePropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  courses: PropTypes.arrayOf(coursePropTypes),
  sections: PropTypes.arrayOf(courseCategoryPropTypes),
});

export { transformCoursesPage, coursesPagePropTypes };
