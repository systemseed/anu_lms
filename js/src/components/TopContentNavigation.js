import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ContentNavigation from '@anu/components/ContentNavigation';
import { coursePropTypes } from '@anu/utilities/transform.course';
import LessonNavigationMobile from '@anu/pages/lesson/NavigationMobile';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.grey[200],
    boxSizing: 'border-box',
    marginLeft: theme.spacing(0.5),
    marginBottom: theme.spacing(8),
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      marginLeft: -theme.spacing(1),
      marginRight: -theme.spacing(1),
      marginTop: -theme.spacing(1),
      paddingRight: 0,
    },
    '&>.MuiGrid-root': {
      padding: theme.spacing(0, 0.25, 0, 4),
    },
  },
  stickyFixedContainer: {
    position: 'fixed',
    top: 0,
    zIndex: 10,
    marginTop: theme.spacing(0),
    [theme.breakpoints.down('sm')]: {
      width: `100%!important`,
    },
  },
  stickyNavBarContainer: {
    paddingTop: '115px',
  },
  actionsSection: {
    display: 'flex',
    justifyContent: 'end',
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
  },
  titleWrapper: {
    paddingRight: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '700px',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '400px',
    },
  },
  navigationMobileSection: {
    padding: '0!important',
  },
  pageNumberSection: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
}));

// Sticky top navigation used for lessons and quizzes.
const ContentTopNavigation = ({
  isIntro,
  sections,
  currentLesson,
  nextLesson,
  prevLesson,
  currentIndex,
  isEnabled,
  course,
  setCurrentPage,
  currentPage,
}) => {
  const classes = useStyles();

  const [isSticky, _setIsSticky] = useState(false);

  // Hooks to track the "isSticky" value. Note that we have to use useRef here as
  // well as useState, in order to have the step data accessible in our
  // event listeners which normally don't get updates from change of the state.
  // See https://file-translate.com/en/blog/react-state-in-event.
  const isStickyRef = useRef(isSticky);

  const setIsSticky = (value) => {
    isStickyRef.current = value;
    _setIsSticky(value);
  };

  const staticNavigationContainerEl = useRef(null);
  const stickyNavigationContainerEl = useRef(null);

  const onScroll = () => {
    const body = document.querySelector('body');

    let stickyNavbarTopPadding = parseInt(body.style.paddingTop);
    stickyNavigationContainerEl.current.style.top = `${stickyNavbarTopPadding}px`;

    if (
      staticNavigationContainerEl.current.getBoundingClientRect().top - stickyNavbarTopPadding <=
        0 &&
      window.scrollY > 5
    ) {
      setIsSticky(true);
      // 4px - is left margin of parent element.
      stickyNavigationContainerEl.current.style.width = `${
        stickyNavigationContainerEl.current.parentElement.offsetWidth - 4
      }px`;
    } else {
      setIsSticky(false);
      stickyNavigationContainerEl.current.style.width = `auto`;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  let currentProgress = ((currentPage + 1) / sections.length) * 100;

  // If this page is initial then progress bar shouldn't be animated.
  if (currentPage === null) {
    currentProgress = ((currentIndex + 1) / sections.length) * 100;
  }

  const [progress, setProgress] = useState(currentProgress);

  // TopContentNavigation is included in a lesson and overdrew whenever a user
  // goes between pages. This is a reason why important emulate previous position
  // initially and set the current in 100ms.
  setTimeout(() => {
    setProgress(((currentIndex + 1) / sections.length) * 100);
  }, 100);

  useEffect(() => {
    setCurrentPage(currentIndex);
  }, []);

  return (
    <div
      className={isSticky ? classes.stickyNavBarContainer : ''}
      ref={staticNavigationContainerEl}
    >
      <Box
        className={`${classes.container} ${isSticky ? classes.stickyFixedContainer : ''}`}
        ref={stickyNavigationContainerEl}
      >
        <Grid container>
          {/* Navigation drawer visible only on mobile */}
          <Hidden mdUp>
            <Grid item xs={1} className={classes.navigationMobileSection}>
              <LessonNavigationMobile lesson={currentLesson} course={course} />
            </Grid>
          </Hidden>

          <Hidden smDown>
            <Grid item md={8} xs={4} className={classes.titleSection}>
              <Typography className={classes.titleWrapper} variant="subtitle2">
                {currentLesson.title}
              </Typography>
            </Grid>
          </Hidden>

          <Grid item md={4} xs={11} className={classes.actionsSection}>
            <Typography variant="subtitle2" className={classes.pageNumberSection}>
              {Drupal.t(
                'Page !current of !all',
                { '!current': currentIndex + 1, '!all': Math.max(sections.length, 1) },
                { context: 'ANU LMS' }
              )}
            </Typography>
            <ContentNavigation
              isIntro={isIntro}
              sections={sections}
              currentLesson={currentLesson}
              nextLesson={nextLesson}
              prevLesson={prevLesson}
              currentIndex={currentIndex}
              isEnabled={isEnabled}
              ignorePaddings={true}
              hideButtonsLabelsOnMobile={true}
            />
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </div>
  );
};

ContentTopNavigation.propTypes = {
  isIntro: PropTypes.bool,
  sections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
  currentLesson: PropTypes.shape({
    title: PropTypes.string,
  }),
  nextLesson: PropTypes.shape(),
  prevLesson: PropTypes.shape(),
  currentIndex: PropTypes.number,
  isEnabled: PropTypes.bool,
  course: coursePropTypes,
  stepsDirection: PropTypes.string,
  setCurrentPage: PropTypes.func,
  currentPage: PropTypes.number,
};

ContentTopNavigation.defaultProps = {
  currentPage: null,
  setCurrentPage: () => {},
};

export default ContentTopNavigation;
