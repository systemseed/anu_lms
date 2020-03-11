import React from 'react';
import { withStyles } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Check from '@material-ui/icons/Check';
import Radio from '@material-ui/core/Radio'

const ErrorRadio = withStyles(theme => ({
  root: {
    color: theme.palette.error.main,
  },
  checked: {
    color: theme.palette.error.main + ' !important',
  }
}))(Radio);

const SuccessRadio = withStyles(theme => ({
  root: {
    color: theme.palette.success.main,
  },
  checked: {
    color: theme.palette.success.main + ' !important',
  }
}))(Radio);

const RadioWithValidation = ({ value, correctValue, checked, ...props }) => {
  if (correctValue !== null) {

    if (checked && correctValue === Number.parseInt(value, 10)) {
      return <SuccessRadio {...props} checked />;
    }

    if (!checked && correctValue === Number.parseInt(value, 10)) {
      return <ErrorRadio value={value} {...props} checked />;
    }

    if (checked && correctValue !== Number.parseInt(value, 10)) {
      return <ErrorRadio {...props} checked checkedIcon={<Clear/>} />;
    }

    if (!checked && correctValue !== Number.parseInt(value, 10)) {
      return <Radio value={value} {...props} />;
    }
  }

  return <Radio value={value} {...props} />;
}

export default RadioWithValidation;
