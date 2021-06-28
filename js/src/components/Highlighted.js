import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const HighlightBox = withStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    background: 'rgba(245, 222, 149, 0.3)',
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
    '& .MuiTypography-body1': {
      fontSize: '1rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.5rem',
        lineHeight: '2.063rem',
      },
    },
  },
}))(Box);

const Highlighted = ({ children }) => <HighlightBox>{children}</HighlightBox>;

Highlighted.propTypes = {
  children: PropTypes.node,
};

export default Highlighted;
