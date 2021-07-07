import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import QuizSubmit from '@anu/components/QuizSubmit';
import LessonGrid from '@anu/components/LessonGrid';

const StyledBox = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    },
  },
}))(Box);

const ErrorSlider = withStyles((theme) => ({
  root: {
    color: `${theme.palette.error.main} !important`,
  },
}))(Slider);

const SuccessSlider = withStyles((theme) => ({
  root: {
    color: `${theme.palette.success.main} !important`,
  },
}))(Slider);

const SliderWithValidation = ({ value, correctValue, ...props }) => {
  if (correctValue !== null && value === correctValue) {
    return <SuccessSlider value={value} {...props} disabled />;
  }

  if (correctValue !== null && value !== correctValue) {
    return <ErrorSlider value={value} {...props} disabled />;
  }

  return <Slider value={value} {...props} />;
};

SliderWithValidation.propTypes = {
  value: PropTypes.number,
  correctValue: PropTypes.number,
};

const QuizScale = ({
  question,
  scale,
  value,
  correctValue,
  isSubmitting,
  isSubmitted,
  onSubmit,
  onChange,
  defaultValue,
}) => {
  return (
    <StyledBox>
      <LessonGrid>
        <Box mb={5}>
          <Typography variant="subtitle1">{question}</Typography>
        </Box>

        <SliderWithValidation
          value={value}
          defaultValue={defaultValue}
          min={scale.from}
          max={scale.to}
          correctValue={correctValue}
          onChange={onChange}
          valueLabelDisplay="on"
          disabled={isSubmitted || isSubmitting}
        />

        {correctValue !== null && (
          <Box mb={2}>
            <Typography>
              <strong>Correct answer:</strong>
              {` ${correctValue}`}
            </Typography>
          </Box>
        )}

        {!isSubmitted && onSubmit && <QuizSubmit onSubmit={onSubmit} isSubmitting={isSubmitting} />}
      </LessonGrid>
    </StyledBox>
  );
};

QuizScale.propTypes = {
  question: PropTypes.string,
  scale: PropTypes.object,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  correctValue: PropTypes.number,
  isSubmitting: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};

export default QuizScale;
