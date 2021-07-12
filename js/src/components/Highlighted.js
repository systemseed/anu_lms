import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const backgroundColor = {
  blue: '#d0e3ff',
  yellow: '#faeabf',
  green: '#daf0e5',
  purple: '#f4e3ff',
};

const HighlightBox = withStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: (props) => backgroundColor[props.color],
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

const Highlighted = ({ children, color }) => <HighlightBox color={color}>{children}</HighlightBox>;

Highlighted.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['yellow', 'blue', 'green', 'purple']),
};

Highlighted.defaultProps = {
  color: 'yellow',
};

export default Highlighted;
