import React from 'react';
import { withStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import QuizSubmit from '@anu/components/QuizSubmit';
import LessonGrid from '@anu/components/LessonGrid';
import CheckboxWithValidation from '@anu/components/CheckboxWithValidation';
import RadioWithValidation from '@anu/components/RadioWithValidation';

const StyledBox = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(8),
  },
}))(Box);

const QuizOptions = ({
  question,
  multipleOptions,
  options,
  value,
  correctValue,
  isSubmitting,
  isSubmitted,
  onChange,
  onSubmit,
}) => {
  const theme = useTheme();

  return (
    <StyledBox>
      <LessonGrid>
        <Typography variant="subtitle1" style={{ marginBottom: theme.spacing(1) }}>
          {question}
        </Typography>

        <FormGroup>
          {multipleOptions &&
            options.map((option) => (
              <FormControlLabel
                key={option.id}
                label={option.value}
                disabled={isSubmitted || isSubmitting}
                control={
                  <CheckboxWithValidation
                    color="primary"
                    value={Number.parseInt(option.id, 10)}
                    checked={value ? value.includes(option.id) : false}
                    correctValues={correctValue}
                    onChange={(event) => onChange(option.id, event)}
                  />
                }
              />
            ))}

          {!multipleOptions && (
            <FormControl>
              <RadioGroup value={value} onChange={(event) => onChange(event)}>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    label={option.value}
                    value={option.id}
                    disabled={isSubmitted || isSubmitting}
                    control={
                      <RadioWithValidation
                        value={option.id}
                        checked={option.id === value}
                        correctValue={correctValue ? correctValue[0] : null}
                        color="primary"
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        </FormGroup>

        {!isSubmitted && onSubmit && <QuizSubmit onSubmit={onSubmit} isSubmitting={isSubmitting} />}
      </LessonGrid>
    </StyledBox>
  );
};

export default QuizOptions;
