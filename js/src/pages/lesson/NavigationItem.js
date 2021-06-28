import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const useStyles = makeStyles((theme) => ({
  item: {
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  link: ({ isActive }) => ({
    padding: theme.spacing(1, 2, 1, 1),
    background: isActive ? theme.palette.accent1.main : 'none',
    color: isActive ? theme.palette.accent1.contrastText : theme.palette.common.black,
    borderBottom: isActive ? '2px solid black' : 'none',
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
      color: isActive ? theme.palette.accent1.contrastText : theme.typography.link.color,
    },
  }),
  circle: ({ isActive }) => ({
    width: theme.spacing(2),
    height: theme.spacing(2),
    background: theme.palette.common.white,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: isActive ? theme.palette.common.black : theme.palette.grey[300],
    borderRadius: '50%',
    marginRight: theme.spacing(1.5),
    position: 'relative',
    zIndex: 100,
  }),
  circleWrapper: {
    width: 'auto',
    position: 'relative',
  },
  firstLessonBackground: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
    background: theme.palette.common.white,
  },
  lastLessonBackground: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    background: theme.palette.common.white,
  },
}));

const LessonNavigationItem = ({ lesson, isActive, isFirstLesson, isLastLesson }) => {
  const classes = useStyles({ isActive });
  return (
    <Grid container wrap="nowrap" className={classes.item}>
      <Grid item container alignItems="center" className={classes.circleWrapper}>
        {/* Added to hide edges of the line which goes through lesson circles */}
        {isFirstLesson && <Box className={classes.firstLessonBackground} />}
        {isLastLesson && <Box className={classes.lastLessonBackground} />}

        <Grid item>
          <Box className={classes.circle} />
        </Grid>
      </Grid>

      <Grid item style={{ flexGrow: 1 }}>
        <Typography variant="body2" component="a" href={lesson.url} className={classes.link}>
          {lesson.title}
        </Typography>
      </Grid>
    </Grid>
  );
};

LessonNavigationItem.propTypes = {
  lesson: lessonPropTypes.isRequired,
  isActive: PropTypes.bool,
  isFirstLesson: PropTypes.bool,
  isLastLesson: PropTypes.bool,
};

LessonNavigationItem.defaultProps = {
  isActive: false,
  isFirstLesson: false,
  isLastLesson: false,
};

export default LessonNavigationItem;
