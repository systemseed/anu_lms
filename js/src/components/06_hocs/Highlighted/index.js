import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box'

const HighlightBox = withStyles(theme => ({
  root: {
    color: 'white',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    background: '#2a4d66',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
    '& .MuiTypography-body1': {
      fontSize: '1em',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.5em',
      },
    },
  }
}))(Box);

const Highlighted = ({ children }) => (
  <HighlightBox>
    {children}
  </HighlightBox>
);

export default Highlighted;
