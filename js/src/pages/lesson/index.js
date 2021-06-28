import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import makeStyles from '@material-ui/core/styles/makeStyles';

import LessonHeader from '@anu/pages/lesson/Header';
import LessonContent from '@anu/pages/lesson/Content';
import LessonSidebar from '@anu/pages/lesson/Sidebar';
import LessonSidebarHide from '@anu/pages/lesson/SidebarHide';
import LessonNavigationMobile from '@anu/pages/lesson/NavigationMobile';

import useLocalStorage from '@anu/hooks/useLocalStorage';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  contentArea: {
    position: 'relative',
    flexWrap: 'nowrap',
    flexGrow: 1,
    overflow: 'hidden',
  },
  sidebar: ({ isSidebarVisible }) => ({
    position: 'absolute',
    width: 300,
    left: isSidebarVisible ? 0 : -300,
    transition: '.3s left',
    top: 0,
    bottom: 0,
    flexShrink: 0,
    flexGrow: 0,
  }),
  contentWrapper: ({ isSidebarVisible }) => ({
    transition: '.3s padding',
    flexGrow: 1,
    height: '100%',
    paddingLeft: isSidebarVisible ? 300 : 0,
  }),
  content: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    margin: '0 auto',
    maxWidth: 800, // 90 chars as per readability guidelines.
    [theme.breakpoints.up('md')]: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
}));

const LessonPage = ({ lesson: lessonSource, quiz, course, width }) => {
  const [isSidebarVisible, toggleSidebarVisibility] = useLocalStorage('sidebarVisibility', true);
  const classes = useStyles({ isSidebarVisible });
  const courseSequence = ((course || {}).content || []).flatMap((module) => [
    ...module.lessons,
    module.quiz,
  ]).filter(lesson => !!lesson);

  const lesson = lessonSource || quiz;
  const nextLesson = courseSequence[courseSequence.findIndex(({ id }) => id === lesson.id) + 1];

  return (
    <Box className={classes.wrapper}>
      {/* Navigation drawer visible only on mobile */}
      <Hidden mdUp>
        <LessonNavigationMobile lesson={lesson || quiz} course={course} />
      </Hidden>

      {/* Header of the lesson page  */}
      {course && (
        <Hidden smDown>
          <LessonHeader lesson={lesson || quiz} course={course} />
        </Hidden>
      )}

      <Box className={classes.container}>
        {/* CTA to hide / show desktop sidebar */}
        <Hidden smDown>
          <LessonSidebarHide
            isSidebarVisible={isSidebarVisible}
            toggleSidebarVisibility={toggleSidebarVisibility}
          />
        </Hidden>

        <Box className={classes.contentArea}>
          {/* Left sidebar visible on tablet + desktop devices only */}
          <Hidden smDown>
            <Box className={classes.sidebar}>
              <LessonSidebar course={course} lesson={lesson || quiz} />
            </Box>
          </Hidden>

          <Box className={isWidthUp('md', width) ? classes.contentWrapper : ''}>
            <LessonContent
              title={lesson.title}
              sections={lesson.sections || quiz.questions}
              isQuiz={Boolean(quiz)}
              nextLesson={nextLesson}
              nodeId={lesson.id}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

LessonPage.propTypes = {
  lesson: lessonPropTypes,
  quiz: lessonPropTypes,
  course: coursePropTypes,
  // Coming from MUI withWidth() HOC.
  width: PropTypes.string,
};

export default withWidth()(LessonPage);
