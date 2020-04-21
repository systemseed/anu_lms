import React from 'react';
import { Detector } from 'react-detect-offline';

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import LessonNavigationButton from '../LessonNavigationButton';

const StyledButton = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
  },
}))(Button);

const StyledCircularProgress = withStyles(theme => ({
  root: {
    marginRight: theme.spacing(2),
  },
}))(CircularProgress);

const QuizSubmit = ({ onSubmit, isSubmitting, isQuiz }) => {
  const ButtonComp = isQuiz ? LessonNavigationButton : StyledButton;

  return (
    <Detector
      render={({ online }) => (
        <>
          <ButtonComp
            variant="contained"
            onClick={onSubmit}
            disabled={!online || isSubmitting}
          >
            {isSubmitting && <StyledCircularProgress size={20} />}

            Submit {isQuiz ? 'quiz' : 'answer'}
          </ButtonComp>

          {!online && (
            <Typography variant="subtitle1">
              You cannot submit {isQuiz ? 'quizzes' : 'answers'} while offline.
            </Typography>
          )}
        </>
      )}
    />
  );
};

export default QuizSubmit;
