import React from 'react';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core';

const StyledButton = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}))(Button);

const BackButton = ({ title, href }) => (
  <StyledButton href={href} startIcon={<ArrowBack />}>
    {title}
  </StyledButton>
);

export default BackButton;
