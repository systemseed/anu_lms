import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '../../06_hocs/LessonGrid';

const Heading = ({type, children}) => (
  <LessonGrid>
    <Typography variant={type} component={type}>
      {children}
    </Typography>
  </LessonGrid>
);

Heading.propTypes = {
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
};

export default Heading;
