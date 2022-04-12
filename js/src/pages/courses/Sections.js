import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import CoursesSection from '@anu/pages/courses/Section';
import CoursesSectionHeading from '@anu/pages/courses/SectionHeading';
import CoursesSectionSubheading from '@anu/pages/courses/SectionSubheading';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { courseCategoryPropTypes } from '@anu/utilities/transform.courseCategory';

const CoursesSections = ({ sections, courses }) => (
  <>
    {sections.map((section, index) => (
      <React.Fragment key={section.id}>
        {!section.parent && (
          <Box pb={[2, 4]}>
            <CoursesSectionHeading>{section.title}</CoursesSectionHeading>
          </Box>
        )}

        {section.parent && section.parent.title && (
          <>
            {/* The logic: Display the main section title if it has the parent term and it was not displayed in the previous section */}
            {!(
              typeof sections[index - 1] !== 'undefined' &&
              sections[index - 1].parent &&
              sections[index - 1].parent.id === section.parent.id
            ) && (
              <Box pb={[2, 3]}>
                <CoursesSectionHeading>{section.parent.title}</CoursesSectionHeading>
              </Box>
            )}

            <Box pb={[2, 3]}>
              <CoursesSectionSubheading>{section.title}</CoursesSectionSubheading>
            </Box>
          </>
        )}

        <Box pb={[3, 6]}>
          <CoursesSection
            // Filter out courses which don't belong to the category.
            courses={courses
              .filter(
                (course) =>
                  course.categories &&
                  course.categories.length > 0 &&
                  course.categories.map((term) => term.id).includes(section.id)
              )
              .sort((a, b) => {
                // @todo: checks can be deleted after courses reorder implementation.
                if (
                  typeof a.weightPerCategory === 'undefined' ||
                  typeof a.weightPerCategory[section.id] === 'undefined' ||
                  typeof b.weightPerCategory === 'undefined' ||
                  typeof b.weightPerCategory[section.id] === 'undefined'
                ) {
                  return 0;
                }
                return a.weightPerCategory[section.id] - b.weightPerCategory[section.id];
              })}
          />
        </Box>
      </React.Fragment>
    ))}
  </>
);

CoursesSections.propTypes = {
  courses: PropTypes.arrayOf(coursePropTypes),
  sections: PropTypes.arrayOf(courseCategoryPropTypes),
};

CoursesSections.defaultProps = {
  courses: [],
  sections: [],
};

export default CoursesSections;
