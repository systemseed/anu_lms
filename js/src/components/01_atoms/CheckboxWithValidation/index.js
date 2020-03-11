import React from 'react';
import { withStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Clear from '@material-ui/icons/Clear';

const ErrorCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.error.main,
  },
  checked: {
    color: theme.palette.error.main + ' !important',
  }
}))(Checkbox);

const SuccessCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.success.main,
  },
  checked: {
    color: theme.palette.success.main + ' !important',
  }
}))(Checkbox);

const CheckboxWithValidation = ({ value, correctValues, checked, ...props }) => {
  if (correctValues !== null) {

    if (checked && correctValues.includes(value)) {
      return <SuccessCheckbox value={value} checked {...props} />;
    }

   if (!checked && correctValues.includes(value)) {
      return <ErrorCheckbox value={value} checked {...props} />;
    }

    if (checked && !correctValues.includes(value)) {
      return <ErrorCheckbox value={value} checked checkedIcon={<Clear/>} {...props} />;
    }

    if (!checked && !correctValues.includes(value)) {
      return <Checkbox value={value} checked={checked} {...props} />;
    }
  }

  return <Checkbox value={value} checked={checked} {...props} />
}

export default CheckboxWithValidation;
