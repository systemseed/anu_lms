import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const AccentBox = withStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 35,
    borderLeft: `4px solid ${theme.palette.accent}`,
    paddingLeft: theme.spacing(3),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      height: 50,
    },
    '& > *': {
      margin: 0,
    },
  },
}))(Box);

const Accented = ({ children }) => <AccentBox>{children}</AccentBox>;

export default Accented;
