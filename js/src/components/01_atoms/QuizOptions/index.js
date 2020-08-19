import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';

import QuizSubmit from '../QuizSubmit';
import LessonGrid from '../../06_hocs/LessonGrid';
import CheckboxWithValidation from '../CheckboxWithValidation';
import RadioWithValidation from '../RadioWithValidation';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    }
  }
}))(Box);

const QuizOptions = ({
  question,
  multipleOptions,
  options,
  value,
  correctValue,
  isSubmitting,
  onChange,
  onSubmit,
}) => (
  <StyledBox>
    <LessonGrid>
      <Typography variant="h4" component="h4">
        {question}
      </Typography>

      <FormGroup>
        {multipleOptions && options.map(option => (
          <FormControlLabel
            key={option.id}
            label={option.value}
            disabled={correctValue === null ? isSubmitting : true}
            control={<CheckboxWithValidation
              color="primary"
              value={Number.parseInt(option.id, 10)}
              checked={value ? value.includes(option.id) : false}
              correctValues={correctValue}
              onChange={event => onChange(option.id, event)}
            />}
          />
        ))}

        {!multipleOptions && (
          <FormControl>
            <RadioGroup value={value} onChange={event => onChange(event)}>
              {options.map(option => (
                <FormControlLabel
                  key={option.id}
                  label={option.value}
                  value={option.id}
                  disabled={correctValue === null ? isSubmitting : true}
                  control={<RadioWithValidation
                    value={option.id}
                    checked={option.id === value}
                    correctValue={correctValue ? correctValue[0] : null}
                    color="primary"
                  />}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </FormGroup>

      {!correctValue && onSubmit && <QuizSubmit onSubmit={onSubmit} isSubmitting={isSubmitting} /> }
    </LessonGrid>
  </StyledBox>
);

export default QuizOptions;
