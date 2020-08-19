import React from 'react';
import { withTranslation } from 'react-i18next';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import QuizSubmit from '../QuizSubmit';
import LessonGrid from '../../06_hocs/LessonGrid';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    },
  },
}))(Box);

const TypographyTopSpaced = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
  },
}))(Typography);

const TypographyBottomSpaced = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}))(Typography);

const QuizTextAnswer = ({
  t,
  question,
  value,
  correctValue,
  multiline,
  isSubmitting,
  onChange,
  onSubmit,
}) => (
  <StyledBox>
    <LessonGrid>
      <TypographyBottomSpaced variant="body1">
        {question}
      </TypographyBottomSpaced>

      <TextField
        label={t('Enter your answer')}
        value={value}
        onChange={onChange}
        variant="outlined"
        fullWidth
        multiline={multiline}
        rows={3}
        rowsMax={10}
        disabled={isSubmitting || !!correctValue}
      />

      {correctValue && (
        <TypographyTopSpaced variant="body1">
          <strong>{t('Suggested answer')}</strong> {correctValue}
        </TypographyTopSpaced>
      )}

      {!correctValue && onSubmit && <QuizSubmit onSubmit={onSubmit} isSubmitting={isSubmitting} />}
    </LessonGrid>
  </StyledBox>
);

export default withTranslation()(QuizTextAnswer);
