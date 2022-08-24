import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ContentNavigation from './ContentNavigation';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Hidden from '@material-ui/core/Hidden';
import LessonNavigationMobile from '../pages/lesson/NavigationMobile';
import { coursePropTypes } from '@anu/utilities/transform.course';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.grey[200],
    boxSizing: 'border-box',
    padding: theme.spacing(0, 0.25, 0, 4),
    marginLeft: theme.spacing(0.5),
    marginBottom: theme.spacing(8),
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      marginLeft: -theme.spacing(1),
      marginRight: -theme.spacing(1),
      marginTop: -theme.spacing(1),
      paddingRight: 0,
    },
  },
  stickyContainer: {
    position: 'fixed',
    top: 0,
    zIndex: 10,
    marginTop: theme.spacing(0),
    [theme.breakpoints.down('sm')]: {
      width: `100%!important`,
    },
  },
  emptyContainer: {
    height: '115px',
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
  progressSection: {
    marginLeft: -theme.spacing(4),
    marginRight: -theme.spacing(0.25),
    maxWidth: `calc(100% + ${theme.spacing(4)}px)`,
    flexBasis: `calc(100% + ${theme.spacing(4)}px)`,
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
  stepsDirection,
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

  useEffect(() => {
    const onScroll = () => {
      // "emptyNavbar" is empty block with predefined height, used to avoid
      // visual collision during moving between "static" and "sticky" states
      // for top navigation.
      const stickyNavbar = document.getElementById('top-content-navigation');
      const emptyNavbar = document.getElementById('top-empty-navigation');
      const toolbar = document.getElementById('toolbar-bar');
      const toolbarTray = document.getElementById('toolbar-item-administration-tray');

      let stickyNavbarTopPadding = 0;
      if (toolbar) {
        // If the toolbar-tray is horizontal then the toolbar takes 2 lines.
        const multiplier =
          toolbarTray.classList.contains('toolbar-tray-horizontal') &&
          toolbarTray.classList.contains('is-active')
            ? 2
            : 1;
        stickyNavbarTopPadding = toolbar.offsetHeight * multiplier;
        stickyNavbar.style.top = `${stickyNavbarTopPadding}px`;

        if (getComputedStyle(toolbar).position !== 'fixed') {
          stickyNavbar.style.top = '0';
        }
      }

      const navbar = isStickyRef.current ? emptyNavbar : stickyNavbar;
      if (navbar.getBoundingClientRect().top - stickyNavbarTopPadding <= 0 && window.scrollY > 5) {
        setIsSticky(true);
        // 4px - is left margin of parent element.
        stickyNavbar.style.width = `${stickyNavbar.parentElement.offsetWidth - 4}px`;
      } else {
        setIsSticky(false);
        stickyNavbar.style.width = `auto`;
      }
    };

    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // This section (TopContentNavigation) is included in a lesson and overdrew whenever a user
  // goes between pages. This is a reason why important emulate previous position initially
  // and set the current in 100ms.
  const progressDiff = stepsDirection === 'forward' ? 0 : 2;
  const [progress, setProgress] = useState(
    stepsDirection === 'initial'
      ? ((currentIndex + 1) / sections.length) * 100
      : ((currentIndex + progressDiff) / sections.length) * 100
  );

  if (stepsDirection !== 'initial') {
    setTimeout(() => {
      setProgress(
        ((currentIndex + progressDiff + 1 * (stepsDirection === 'forward' ? 1 : -1)) /
          sections.length) *
          100
      );
    }, 100);
  }

  return (
    <>
      {isSticky && <Box className={classes.emptyContainer} id={'top-empty-navigation'}></Box>}
      <Box
        className={`${classes.container} ${isSticky ? classes.stickyContainer : ''}`}
        id={'top-content-navigation'}
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
          <Grid item xs={12} className={classes.progressSection}>
            <LinearProgress variant="determinate" value={progress} />
          </Grid>
        </Grid>
      </Box>
    </>
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
};

export default ContentTopNavigation;
