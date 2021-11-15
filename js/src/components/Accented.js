import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const AccentBox = withStyles((theme) => ({
  root: {
    height: 35,
    borderLeft: `4px solid ${theme.palette.accent}`,
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      height: 50,
      marginBottom: theme.spacing(3),
    },
    '& .MuiTypography-root': {
      marginBottom: 0,
    },
  },
}))(Box);

const Accented = ({ children }) => (
  <AccentBox display="flex" alignItems="center">
    {children}
  </AccentBox>
);

Accented.propTypes = {
  children: PropTypes.node,
};

export default Accented;
