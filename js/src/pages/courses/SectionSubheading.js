import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const CoursesSectionSubheading = ({ children }) => (
  <Typography variant="overline" component="h3">
    {children}
  </Typography>
);

CoursesSectionSubheading.propTypes = {
  children: PropTypes.string,
};

export default CoursesSectionSubheading;
