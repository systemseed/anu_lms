import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';
import LockIcon from '@material-ui/icons/Lock';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
  item: {
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  link: ({ isActive }) => ({
    padding: theme.spacing(1, 2, 1, 1),
    background: isActive ? theme.palette.grey[200] : 'none',
    color: theme.palette.common.black,
    fontWeight: isActive ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular,
    borderBottom: isActive ? '4px solid black' : 'none',
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
      color: isActive ? theme.palette.accent1.contrastText : theme.typography.link.color,
    },
  }),
  iconWrapper: {
    height: '20px',
  },
  restrictedLink: {
    padding: theme.spacing(1, 2, 1, 1),
    color: theme.palette.grey[400],
    display: 'block',
    textDecoration: 'none',
  },
  circle: ({ isActive, isRestricted }) => ({
    width: '20px',
    height: '20px',
    padding: '2px',
    background: isRestricted ? theme.palette.grey[200] : theme.palette.common.white,
    color: theme.palette.grey[400],
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: isActive ? theme.palette.common.black : theme.palette.grey[300],
    borderRadius: '50%',
    marginRight: theme.spacing(1.5),
    position: 'relative',
    zIndex: 100,
  }),
  check: {
    padding: '1px',
    width: '20px',
    height: '20px',
    background: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    borderRadius: '50%',
    marginRight: theme.spacing(1.5),
    position: 'relative',
    zIndex: 100,
  },
  circleWrapper: {
    width: 'auto',
    position: 'relative',
  },
  firstLessonBackground: ({ isSectionRestricted }) => ({
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
    background: isSectionRestricted ? theme.palette.grey[200] : theme.palette.common.white,
  }),
  lastLessonBackground: ({ isSectionRestricted }) => ({
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    background: isSectionRestricted ? theme.palette.grey[200] : theme.palette.common.white,
  }),
}));

const LessonNavigationItem = ({
  lesson,
  isActive,
  isFirstLesson,
  isLastLesson,
  isSectionRestricted,
}) => {
  const isRestricted = lesson.isRestricted;
  const isCompleted = lesson.isCompleted;
  const classes = useStyles({ isActive, isRestricted, isSectionRestricted });
  const linkProps = isRestricted
    ? { className: classes.restrictedLink }
    : {
        className: classes.link,
        href: lesson.url,
      };

  return (
    <Grid
      container
      wrap="nowrap"
      className={classes.item}
      data-test={`anu-lms-navigation-item-status${isActive ? '-active' : ''}`}
    >
      <Grid item container alignItems="center" className={classes.circleWrapper}>
        {/* Added to hide edges of the line which goes through lesson circles */}
        {isFirstLesson && <Box className={classes.firstLessonBackground} />}
        {isLastLesson && <Box className={classes.lastLessonBackground} />}

        <Grid item className={classes.iconWrapper}>
          {isCompleted && <CheckIcon className={classes.check} />}
          {!isCompleted && !isRestricted && <Box className={classes.circle} />}
          {isRestricted && <LockIcon className={classes.circle} />}
        </Grid>
      </Grid>

      <Grid item style={{ flexGrow: 1 }}>
        <Typography variant="body2" component="a" {...linkProps}>
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
  isSectionRestricted: PropTypes.bool,
};

LessonNavigationItem.defaultProps = {
  isActive: false,
  isFirstLesson: false,
  isLastLesson: false,
  isSectionRestricted: false,
};

export default LessonNavigationItem;
