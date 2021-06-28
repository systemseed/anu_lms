import React from 'react';
import PropTypes from 'prop-types';
import { Detector } from 'react-detect-offline';

import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const QuizSubmit = ({ onSubmit, isSubmitting, isQuiz }) => {
  const theme = useTheme();

  return (
    <Detector
      render={({ online }) => (
        <>
          <Button
            variant="contained"
            color={isQuiz ? 'primary' : 'default'}
            onClick={onSubmit}
            disabled={!online || isSubmitting}
            style={{ marginTop: theme.spacing(2) }}
          >
            {isSubmitting && (
              <CircularProgress size={20} style={{ marginRight: theme.spacing(2) }} />
            )}

            {isQuiz ? 'Submit quiz' : 'Submit answer'}
          </Button>

          {!online && (
            <Typography variant="subtitle1">
              {isQuiz
                ? 'You cannot submit quizzes while offline.'
                : 'You cannot submit answers while offline.'}
            </Typography>
          )}
        </>
      )}
    />
  );
};

QuizSubmit.propTypes = {
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isQuiz: PropTypes.bool,
};

export default QuizSubmit;
