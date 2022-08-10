import React, { useState } from 'react';
import Sticky from 'react-sticky-el';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

import LessonNavigation from '@anu/pages/lesson/Navigation';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { getPwaSettings } from '@anu/utilities/settings';
import DownloadCoursePopup from '@anu/components/DownloadCoursePopup';

const useStyles = makeStyles((theme) => ({
  sticky: {
    zIndex: 4,
  },
  stickyContent: {
    background: theme.palette.grey[200],
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.black,
    cursor: 'pointer',
    borderBottom: '2px solid ' + theme.palette.common.black,
  },
  chevron: ({ isVisible }) => ({
    transform: isVisible ? 'rotate(270deg)' : 'rotate(90deg)',
    transition: '.2s transform',
    fontSize: '1rem',
    float: 'right',
  }),
  closeIcon: {
    cursor: 'pointer',
  },
}));

const LessonNavigationMobile = ({ lesson, course }) => {
  const [isVisible, toggleVisibility] = useState(false);
  const classes = useStyles({ isVisible });

  return (
    <>
      {/* Sticky lesson page title */}
      <Sticky className={classes.sticky}>
        <Container className={classes.stickyContent}>
          <Box pt={2} pb={2} onClick={() => toggleVisibility(true)}>
            <Grid container alignItems="center">
              <Grid item xs={11}>
                <Typography variant="subtitle2">{lesson.title}</Typography>
              </Grid>
              <Grid item xs={1}>
                <DoubleArrowIcon className={classes.chevron} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Sticky>

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
