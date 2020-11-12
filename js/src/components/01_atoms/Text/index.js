import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import LessonGrid from '../../06_hocs/LessonGrid';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
  }
}))(Box);

const StyledTypography = withStyles(theme => ({
  root: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    }
  },
}))(Typography);

const Text = ({ value }) => (
  <StyledBox>
    <LessonGrid>
      <StyledTypography component="div" dangerouslySetInnerHTML={{ __html: value }} />
    </LessonGrid>
  </StyledBox>
);

export default Text;
