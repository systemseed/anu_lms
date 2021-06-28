import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/styles';

import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

const StyledSnackbar = withStyles((theme) => ({
  anchorOriginTopCenter: {
    // Spaced variant has top spacing of 64px, with less chance of overlapping the Appbar.
    top: ({ spaced }) => (spaced ? theme.spacing(8) : theme.spacing(3)),
    zIndex: theme.zIndex.modal - 1, // At the default 1400 it overlays the modal dialog.
  },
}))(Snackbar);

const StyledAlert = withStyles((theme) => ({
  outlinedError: {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error.light,
  },
  filledWarning: {
    color: theme.palette.text.primary,
  },
}))(Alert);

const SnackAlert = ({
  show,
  onClose,
  severity,
  variant,
  message,
  onTransitionEnd,
  spaced,
  duration,
}) => (
  <StyledSnackbar
    open={show}
    onEntered={onTransitionEnd}
    // onExited surprisingly doesnt actually fire in exactly the right moment.
    onExited={() => setTimeout(onTransitionEnd, 50)}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    autoHideDuration={duration}
    onClose={duration ? onClose : null}
    spaced={spaced ? 'spaced' : null}
  >
    <StyledAlert
      onClose={onClose}
      severity={severity}
      variant={variant}
      iconMapping={{
        success: <CheckIcon />,
        warning: <InfoIcon />,
        error: <ErrorIcon />,
      }}
    >
      <Typography variant="body2">{message}</Typography>
    </StyledAlert>
  </StyledSnackbar>
);

SnackAlert.propTypes = {
  show: PropTypes.bool,
  spaced: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.string,
  onTransitionEnd: PropTypes.func,
  severity: PropTypes.string,
  variant: PropTypes.string,
  duration: PropTypes.number,
};

SnackAlert.defaultProps = {
  show: false,
  spaced: false,
  onClose: () => {},
  message: '',
  onTransitionEnd: () => {},
  severity: 'info',
  variant: 'filled',
  duration: null,
};

export default SnackAlert;
