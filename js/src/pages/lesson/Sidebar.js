import React from 'react';
import Box from '@material-ui/core/Box';
import LessonNavigation from '@anu/pages/lesson/Navigation';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.palette.grey[200],
    height: '100%',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));

const LessonSidebar = ({ course, lesson }) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <LessonNavigation course={course} lesson={lesson} />
    </Box>
  );
};

LessonSidebar.propTypes = {
  course: coursePropTypes,
  lesson: lessonPropTypes.isRequired,
};

LessonSidebar.defaultProps = {
  course: null,
};

export default LessonSidebar;
