import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import LessonGrid from '@anu/components/LessonGrid';
import { textStyle } from '../theme';

const StyledBox = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}))(Box);

const StyledTypography = withStyles((theme) => ({
  root: {
    // Common styles for elements with an enabled rich text editor.
    ...textStyle(theme),
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& a': {
      fontWeight: 700,
    },
  },
}))(Typography);

const Text = ({ value }) => (
  <StyledBox>
    <LessonGrid>
      <StyledTypography component="div" dangerouslySetInnerHTML={{ __html: value }} />
    </LessonGrid>
  </StyledBox>
);

Text.propTypes = {
  value: PropTypes.node,
};

export default Text;
