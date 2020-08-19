import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

import LessonGrid from '../../06_hocs/LessonGrid';
import Highlighted from '../../06_hocs/Highlighted'

const StyledHeading = withStyles(theme => ({
  root: {
    color: 'white',
    fontSize: '1.5em',
    marginBottom: '0.75em',
    [theme.breakpoints.up('sm')]: {
      marginBottom: '1em',
      fontSize: '2.5em',
    },
  },
}))(Typography);

const TextHighlighted = ({ title, text }) => (
  <Highlighted>
    <LessonGrid>
      {title &&
      <StyledHeading component="h2" variant="h2">{title}</StyledHeading>
      }
      {text &&
      <Typography component="div" dangerouslySetInnerHTML={{__html: text}}/>
      }
    </LessonGrid>
  </Highlighted>
);

export default TextHighlighted;
