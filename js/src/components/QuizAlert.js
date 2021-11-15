import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const QuizAlert = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Submit answers?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You can only take a quiz once. Do you want to submit your answers now?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleClose(true)} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

QuizAlert.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default QuizAlert;
