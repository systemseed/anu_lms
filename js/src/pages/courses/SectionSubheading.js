import React from 'react';
import Typography from '@material-ui/core/Typography';

const CoursesSectionSubheading = ({ children }) => (
  <Typography variant="overline" component="h3">
    {children}
  </Typography>
);

export default CoursesSectionSubheading;
