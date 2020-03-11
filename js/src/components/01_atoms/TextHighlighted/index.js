import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import LessonGrid from '../LessonGrid'

const StyledBox = withStyles(theme => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    background: '#2a4d66',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      marginBottom: theme.spacing(8),
    }
  }
}))(Box);

const StyledHeading = withStyles(theme => ({
  root: {
    color: 'white',
    fontSize: '1.5em',
    marginBottom: '0.75em',
    [theme.breakpoints.up('sm')]: {
      marginBottom: '1em',
      fontSize: '2.5em',
    }
  }
}))(Typography);

const StyledText = withStyles(theme => ({
  root: {
    color: 'white',
    fontSize: '1em',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.5em',
    }
  }
}))(Typography);

const TextHighlighted = ({ title, text }) => (
  <StyledBox>
    <LessonGrid>
      {title &&
      <StyledHeading component="h2" variant="h2">{title}</StyledHeading>
      }
      {text &&
      <StyledText component="div" dangerouslySetInnerHTML={{__html: text}}/>
      }
    </LessonGrid>
  </StyledBox>
);

export default TextHighlighted;
