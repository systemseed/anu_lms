import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import { highlightText } from '@anu/utilities/searchHighlighter';

const Heading = ({ type, value }) => (
  <LessonGrid>
    <Typography variant={type} component={type}>
      {highlightText(value)}
    </Typography>
  </LessonGrid>
);

Heading.propTypes = {
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  value: PropTypes.string.isRequired,
};

export default Heading;
