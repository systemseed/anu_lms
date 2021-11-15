import React from 'react';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    borderLeft: '4px solid ' + theme.palette.accent1.main,
    paddingLeft: theme.spacing(2),
  },
}));

const CoursesSectionHeading = ({ children }) => {
  const classes = useStyles();
  return (
    <Typography variant="h5" component="h2" className={classes.root}>
      {children}
    </Typography>
  );
};

CoursesSectionHeading.propTypes = {
  children: PropTypes.string,
};

export default CoursesSectionHeading;
