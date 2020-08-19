import React from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';

const StyledWrapper = withStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    maxWidth: '600px',
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      maxWidth: '760px',
    }
  }
}))(Box);

const LessonGrid = ({ children }) => (
  <StyledWrapper>
    {children}
  </StyledWrapper>
);

export default LessonGrid;
