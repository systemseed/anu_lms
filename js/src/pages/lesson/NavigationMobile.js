import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

import LessonNavigation from '@anu/pages/lesson/Navigation';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { getPwaSettings } from '@anu/utilities/settings';
import DownloadCoursePopup from '@anu/components/DownloadCoursePopup';

const useStyles = makeStyles((theme) => ({
  chevron: ({ isVisible }) => ({
    transform: isVisible ? 'rotate(270deg)' : 'rotate(90deg)',
    transition: '.2s transform',
    fontSize: '1.5rem',
  }),
  openSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    height: theme.spacing(8),
    marginLeft: -theme.spacing(5),
    position: 'relative',
    '&:after': {
      content: '""',
      borderBottom: '4px solid ' + theme.palette.common.black,
      height: theme.spacing(0.5),
      display: 'block',
      position: 'absolute',
      bottom: -theme.spacing(0.5),
      left: 0,
      width: '100%',
    }
  },
  closeIcon: {
    cursor: 'pointer',
  },
}));

const LessonNavigationMobile = ({ lesson, course }) => {
  const [isVisible, toggleVisibility] = useState(false);
  const classes = useStyles({ isVisible });

  return (
    <>
      <Container>
        <Box onClick={() => toggleVisibility(true)} className={classes.openSection}>
          <DoubleArrowIcon className={classes.chevron} />
        </Box>
      </Container>

      <Drawer anchor="bottom" open={isVisible} onClose={() => toggleVisibility(false)}>
        {/* Close button to hide the drawer */}
        <Box p={1} display="flex" justifyContent="flex-end">
          <CloseIcon className={classes.closeIcon} onClick={() => toggleVisibility(false)} />
        </Box>
        {course && getPwaSettings() && <DownloadCoursePopup course={course} />}

        {/* Course content */}
        <LessonNavigation course={course} lesson={lesson} />
      </Drawer>
    </>
  );
};

LessonNavigationMobile.propTypes = {
  lesson: lessonPropTypes.isRequired,
  course: coursePropTypes,
};

LessonNavigationMobile.defaultProps = {
  course: null,
};

export default LessonNavigationMobile;
