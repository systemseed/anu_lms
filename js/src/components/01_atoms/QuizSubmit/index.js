import React from 'react';
import { Detector } from 'react-detect-offline';

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

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

const QuizSubmit = ({ onSubmit, isSubmitting}) => (
  <Detector
    render={({ online }) => (
      <>
        <StyledButton
          variant="contained"
          onClick={onSubmit}
          disabled={!online || isSubmitting}
        >
          {isSubmitting && <StyledCircularProgress size={20} />}

          Submit answer
        </StyledButton>

        {!online && (
          <Typography variant="subtitle1">
            You cannot submit quizzes while offline.
          </Typography>
        )}
      </>
    )}
  />
);

export default QuizSubmit;
