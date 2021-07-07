import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import CoursesPageTemplate from '@anu/pages/courses/PageTemplate';
import { courseCategoryPropTypes } from '@anu/utilities/transform.courseCategory';
import { coursePropTypes } from '@anu/utilities/transform.course';

const CoursesPage = ({ title, courses, sections }) => {
  // Get filter by category from the URL.
  const urlQuery = new URLSearchParams(useLocation().search);
  const filterValue = urlQuery.get('category') || 'all';

  // Filter out sections which have no courses in them.
  // Especially helpful when on the page there are courses
  // which may not be accessible for some users.
  const sectionsWithCourses = sections.filter((section) =>
    courses.some((course) => course.categories.some((category) => category.id === section.id))
  );

  // Filter out all sections (categories) apart from the selected one.
  // If no filter applied then show all sections as configured.
  let filteredSections = sectionsWithCourses;
  if (filterValue && filterValue !== 'all') {
    filteredSections = sectionsWithCourses.filter(
      (term) => term.id === Number.parseInt(filterValue, 10)
    );
  }

  return (
    <CoursesPageTemplate
      pageTitle={title}
      courses={courses}
      categories={sectionsWithCourses}
      sections={filteredSections}
      filterValue={filterValue}
    />
  );
};

CoursesPage.propTypes = {
  title: PropTypes.string.isRequired,
  courses: PropTypes.arrayOf(coursePropTypes),
  sections: PropTypes.arrayOf(courseCategoryPropTypes),
};

CoursesPage.defaultProps = {
  courses: [],
  sections: [],
};

export default CoursesPage;
