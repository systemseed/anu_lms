import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LessonNavigationItem from '@anu/pages/lesson/NavigationItem';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const useStyles = makeStyles((theme) => ({
  caption: {
    display: 'block',
  },
  itemsWrapper: {
    position: 'relative',
    padding: theme.spacing(1.5, 0, 2),
  },
  itemsLine: {
    position: 'absolute',
    left: '9px',
    top: theme.spacing(1.5),
    bottom: theme.spacing(3),
    width: '2px',
    background: theme.palette.grey[300],
  },
}));

const LessonNavigationItems = ({ lessons, currentLesson, isSectionRestricted }) => {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="caption" className={classes.caption}>
        {Drupal.formatPlural(
          lessons.length,
          '@count lesson',
          '@count lessons',
          {},
          { context: 'ANU LMS' }
        )}
      </Typography>

      <Box className={classes.itemsWrapper}>
        <Box className={classes.itemsLine} />

        {lessons.map((lesson, index) => (
          <LessonNavigationItem
            key={lesson.id}
            lesson={lesson}
            isActive={lesson.id === currentLesson.id}
            isFirstLesson={index === 0}
            isLastLesson={index === lessons.length - 1}
            isSectionRestricted={isSectionRestricted}
          />
        ))}
      </Box>
    </Box>
  );
};

LessonNavigationItems.propTypes = {
  lessons: PropTypes.arrayOf(lessonPropTypes),
  currentLesson: lessonPropTypes.isRequired,
  isSectionRestricted: PropTypes.bool,
};

LessonNavigationItems.defaultProps = {
  lessons: [],
  isSectionRestricted: false,
};

export default LessonNavigationItems;
