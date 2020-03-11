import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import LessonGrid from '../LessonGrid'

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    }
  }
}))(Box);

const Text = ({ value }) => (
  <StyledBox>
    <LessonGrid>
      <Typography component="div"  dangerouslySetInnerHTML={{ __html: value }} />
    </LessonGrid>
  </StyledBox>
);

export default Text;
