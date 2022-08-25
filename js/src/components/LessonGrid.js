import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  innerDefault: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  innerIgnorePaddings: {
    marginRight: theme.spacing(3.75),
    [theme.breakpoints.down('md')]: {
      marginRight: theme.spacing(2),
    },
  },
}));

const LessonGrid = ({ children, ignorePaddings }) => {
  const classes = useStyles();
  return (
    <Box className={!ignorePaddings ? classes.innerDefault : classes.innerIgnorePaddings}>
      {children}
    </Box>
  );
};

LessonGrid.propTypes = {
  children: PropTypes.node,
  ignorePaddings: PropTypes.bool,
};

LessonGrid.defaultProps = {
  ignorePaddings: false,
};

export default LessonGrid;
