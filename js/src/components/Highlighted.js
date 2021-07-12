import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const backgroundColor = {
  blue: '#002d70',
  yellow: 'rgba(245, 222, 149, 0.6)',
};
const color = {
  blue: 'white',
  yellow: 'initial',
};

const HighlightBox = withStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    background: (props) => backgroundColor[props.color],
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
    '& .MuiTypography-subtitle1': {
      color: (props) => color[props.color],
    },
    '& .MuiTypography-body1': {
      fontSize: '1rem',
      color: (props) => color[props.color],
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.5rem',
        lineHeight: '2.063rem',
      },
    },
  },
}))(Box);

const Highlighted = ({ children, color }) => <HighlightBox color={color}>{children}</HighlightBox>;

Highlighted.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['yellow', 'blue']),
};

export default Highlighted;
