import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CoursesSections from '@anu/pages/courses/Sections';
import CoursesCategoryFilter from '@anu/pages/courses/CategoryFilter';
import { courseCategoryPropTypes } from '@anu/utilities/transform.courseCategory';
import { coursePropTypes } from '@anu/utilities/transform.course';

const useStyles = makeStyles((theme) => ({
  content: {
    background: theme.palette.grey[100],
    borderTop: '1px solid ' + theme.palette.grey[300],
  },
}));

const CoursesPageTemplate = ({ pageTitle, courses, categories, sections, filterValue }) => {
  const classes = useStyles();

  return (
    <>
      <Box pt={[2, 4]} pb={[2, 4]}>
        <Container>
          {/* Page title (basically, title of the Drupal node) */}
          <Box pb={[0, 2]}>
            <Typography variant="h4" component="h1">
              {pageTitle}
            </Typography>
          </Box>

          {/* Course categories filter */}
          {categories.length > 0 && (
            <Box>
              <CoursesCategoryFilter filterValue={filterValue} categories={categories} />
            </Box>
          )}
        </Container>
      </Box>

      {/* Courses sections */}
      <Box className={classes.content} pt={[4, 6]} pb={[4, 6]}>
        <Container>
          <CoursesSections sections={sections} courses={courses} />
        </Container>
      </Box>
    </>
  );
};

CoursesPageTemplate.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  courses: PropTypes.arrayOf(coursePropTypes),
  categories: PropTypes.arrayOf(courseCategoryPropTypes),
  sections: PropTypes.arrayOf(courseCategoryPropTypes),
  filterValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

CoursesPageTemplate.defaultProps = {
  courses: [],
  categories: [],
  sections: [],
};

export default CoursesPageTemplate;
