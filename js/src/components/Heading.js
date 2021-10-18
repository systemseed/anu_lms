import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';

const useStyles = makeStyles((theme) => ({
  heading: {
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const Heading = ({ type, value }) => {
  const classes = useStyles();
  return (
    <LessonGrid>
      <Typography variant={type} component={type} className={classes.heading}>
        {value}
      </Typography>
    </LessonGrid>
  );
};

Heading.propTypes = {
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  value: PropTypes.string.isRequired,
};

export default Heading;
