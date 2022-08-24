import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import makeStyles from '@material-ui/core/styles/makeStyles';

import LessonHeader from '@anu/pages/lesson/Header';
import LessonSidebar from '@anu/pages/lesson/Sidebar';
import ContentQuiz from '@anu/pages/lesson/ContentQuiz';
import ContentLesson from '@anu/pages/lesson/ContentLesson';

import { coursePropTypes } from '@anu/utilities/transform.course';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';
import { quizPropTypes } from '@anu/utilities/transform.quiz';
import LoadingIndicator from '@anu/components/LoadingIndicator';
import { getPwaSettings } from '@anu/utilities/settings';
import DownloadCoursePopup from '@anu/components/DownloadCoursePopup';
import { useHistory } from 'react-router-dom';

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
    [theme.breakpoints.up('md')]: {
      flexWrap: 'nowrap',
      flexGrow: 1,
      display: 'flex',
      paddingBottom: theme.spacing(8),
    },
  },
  sidebar: {
    width: 300,
    flexShrink: 0,
    flexGrow: 0,
  },
  contentWrapper: {
    flexGrow: 1,
  },
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

const LessonPage = ({ lesson, quiz, course, width }) => {
  const classes = useStyles();

  const courseSequence = ((course || {}).content || [])
    .flatMap((module) => [...module.lessons, module.quiz])
    .filter((lesson) => !!lesson);

  const content = lesson || quiz;
  const nextLesson = courseSequence[courseSequence.findIndex(({ id }) => id === content.id) + 1];
  const prevLesson = courseSequence[courseSequence.findIndex(({ id }) => id === content.id) - 1];

  // TODO: get URL of the current lesson.
  const fallbackUrl = '/';
  useEffect(() => {
    if (content.isRestricted) {
      window.location.href = fallbackUrl;
    }
  }, [content.isRestricted, fallbackUrl]);

  // The direction of user's way between pages is required to know so that
  // display correct visual effects for progress bar in top navigation.
  const history = useHistory();
  const [prevPage, _setPrevPage] = useState('initial');
  const [currentPage, _setCurrentPage] = useState(history.location.hash);

  // Hooks to track the "isSticky" value. Note that we have to use useRef here as
  // well as useState, in order to have the step data accessible in our
  // event listeners which normally don't get updates from change of the state.
  // See https://file-translate.com/en/blog/react-state-in-event.
  const prevPageRef = useRef(prevPage);
  const currentPageRef = useRef(currentPage);

  const setPrevPage = (value) => {
    prevPageRef.current = value;
    _setPrevPage(value);
  };
  const setCurrentPage = (value) => {
    currentPageRef.current = value;
    _setCurrentPage(value);
  };

  useEffect(
    () =>
      history.listen((currentLocation) => {
        setPrevPage(currentPageRef.current);
        setCurrentPage(currentLocation.hash);
      }),
    []
  );

  const getNavDirection = () => {
    if (prevPageRef.current === 'initial') {
      return 'initial';
    }

    return prevPageRef.current <= currentPageRef.current ? 'forward' : 'back';
  };

  if (content.isRestricted) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <Box className={classes.wrapper}>
      {/* Header of the lesson page  */}
      {course && (
        <Hidden smDown>
          <LessonHeader lesson={content} course={course} />
        </Hidden>
      )}
      {course && getPwaSettings() && (
        <Hidden smDown>
          <Box mt={2} mb={1}>
            <DownloadCoursePopup course={course} showButton={true} />
          </Box>
        </Hidden>
      )}

      <Box className={classes.container}>
        <Box className={classes.contentArea}>
          {/* Left sidebar visible on tablet + desktop devices only */}
          <Hidden smDown>
            <Box className={classes.sidebar}>
              <LessonSidebar course={course} lesson={content} />
            </Box>
          </Hidden>

          <Box className={isWidthUp('md', width) ? classes.contentWrapper : ''}>
            {quiz && (
              <ContentQuiz
                quiz={quiz}
                nextLesson={nextLesson}
                prevLesson={prevLesson}
                course={course}
                stepsDirection={getNavDirection()}
              />
            )}

            {lesson && (
              <ContentLesson
                lesson={lesson}
                nextLesson={nextLesson}
                prevLesson={prevLesson}
                course={course}
                stepsDirection={getNavDirection()}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

LessonPage.propTypes = {
  lesson: lessonPropTypes,
  quiz: quizPropTypes,
  course: coursePropTypes,
  // Coming from MUI withWidth() HOC.
  width: PropTypes.string,
};

export default withWidth()(LessonPage);
