import React from 'react';
import Typography from '@material-ui/core/Typography';

const CoursesSectionEmpty = () => (
  <Typography variant="body2">
    {Drupal.t('This section does not contain any items yet.', {}, { context: 'ANU LMS' })}
  </Typography>
);

export default CoursesSectionEmpty;
