import React from 'react';
import TextField from '@material-ui/core/TextField';
import LessonGrid from '../LessonGrid';
import { withStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    }
  }
}))(Box);

const StyledButton = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
  }
}))(Button);

const StyledTypography = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
  }
}))(Typography);

const QuizTextAnswer = ({ question, value, correctValue, multiline, isSubmitting, onChange, onSubmit }) => (
  <StyledBox>
    <LessonGrid>
      <TextField
        label={question}
        value={value}
        onChange={onChange}
        variant="outlined"
        fullWidth
        multiline={multiline}
        rows={3}
        rowsMax={10}
        disabled={isSubmitting || !!correctValue}
      />

      {correctValue &&
      <StyledTypography>
        <strong>Suggested answer:</strong> {correctValue}
      </StyledTypography>
      }

      {!correctValue && onSubmit &&
      <StyledButton variant="contained" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting &&
        <>
          <CircularProgress size={20}/>&nbsp;&nbsp;&nbsp;&nbsp;
        </>
        }
        Submit answer
      </StyledButton>
      }
    </LessonGrid>
  </StyledBox>
);

export default QuizTextAnswer;
