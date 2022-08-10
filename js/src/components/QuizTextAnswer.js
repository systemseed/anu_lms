import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import QuizSubmit from '@anu/components/QuizSubmit';
import { highlightText } from '@anu/utilities/searchHighlighter';

const StyledBox = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(8),
  },
}))(Box);

const TypographyTopSpaced = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}))(Typography);

const TypographyBottomSpaced = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}))(Typography);

const QuizTextAnswer = ({
  question,
  value,
  correctValue,
  multiline,
  isSubmitting,
  isSubmitted,
  onChange,
  onSubmit,
}) => (
  <StyledBox>
    <LessonGrid>
      <TypographyBottomSpaced variant="subtitle1">{highlightText(question)}</TypographyBottomSpaced>

      <TextField
        label={Drupal.t('Enter your answer', {}, { context: 'ANU LMS' })}
        value={value}
        onChange={onChange}
        variant="outlined"
        fullWidth
        multiline={multiline}
        rows={3}
        rowsMax={10}
        disabled={isSubmitting || isSubmitted}
        inputProps={{
          maxLength: multiline ? null : 255,
        }}
      />

      {correctValue && (
        <TypographyTopSpaced variant="body1">
          <strong>Suggested answer</strong> {correctValue}
        </TypographyTopSpaced>
      )}

      {!isSubmitted && onSubmit && <QuizSubmit onSubmit={onSubmit} isSubmitting={isSubmitting} />}
    </LessonGrid>
  </StyledBox>
);

QuizTextAnswer.propTypes = {
  question: PropTypes.string,
  value: PropTypes.string,
  correctValue: PropTypes.number,
  checked: PropTypes.bool,
  multiline: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default QuizTextAnswer;
