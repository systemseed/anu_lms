import React from 'react';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core';

import { getRTLIcon } from '../../../theme';

const StyledButton = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}))(Button);

const BackButton = ({ title, href }) => (
  <StyledButton
    href={href}
    startIcon={<Icon>{getRTLIcon('arrow_back')}</Icon>}
  >
    {title}
  </StyledButton>
);

export default BackButton;
