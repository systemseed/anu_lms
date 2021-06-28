import { transformCourse } from '@anu/utilities/transform.course';
import { transformCourseCategory } from '@anu/utilities/transform.courseCategory';
import * as fields from '@anu/utilities/fields';

const transformCoursesPage = ({ data }) => {
  const node = data.courses_page || {};

  return {
    title: fields.getTextValue(node, 'title'),
    courses: fields.getArrayValue(data, 'courses').map((item) => transformCourse(item)),
    sections: fields
      .getArrayValue(node, 'field_courses_content')
      .flatMap((section) =>
        fields
          .getArrayValue(section, 'field_course_category')
          .map((category) => transformCourseCategory(category))
      ),
  };
};

export { transformCoursesPage };
