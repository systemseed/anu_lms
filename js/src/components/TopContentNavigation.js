import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ContentNavigation from './ContentNavigation';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Hidden from '@material-ui/core/Hidden';
import LessonNavigationMobile from '../pages/lesson/NavigationMobile';
import { coursePropTypes } from '@anu/utilities/transform.course';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.grey[200],
    boxSizing: 'border-box',
    padding: theme.spacing(0, 0.25, 0, 4),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginBottom: theme.spacing(8),
  },
  stickyContainer: {
    position: 'fixed',
    top: 0,
    zIndex: 1,
    paddingBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(1.5),
    marginTop: theme.spacing(0),
  },
  emptyContainer: {
    height: '115px',
  },
  actionsSection: {
    display: 'flex',
    justifyContent: 'end',
  },
  titleSection: {
    fontSize: '1.125rem',
    color: theme.palette.common.black,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightBold,
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
      }

      const navbar = isStickyRef.current ? emptyNavbar : stickyNavbar;
      if (navbar.getBoundingClientRect().top - stickyNavbarTopPadding <= 0) {
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

  return (
    <>
      {isSticky && <Box className={classes.emptyContainer} id={'top-empty-navigation'}></Box>}
      <Box
        className={`${classes.container} ${isSticky ? classes.stickyContainer : ''}`}
        id={'top-content-navigation'}
      >
        <Grid container spacing={2}>
          {/* Navigation drawer visible only on mobile */}
          <Hidden mdUp>
            <Grid item xs={4} className={classes.navigationMobileSection}>
              <LessonNavigationMobile lesson={currentLesson} course={course} />
            </Grid>
          </Hidden>

          <Hidden smDown>
            <Grid item md={8} xs={4} className={classes.titleSection}>
              <div className={classes.titleWrapper}>{currentLesson.title}</div>
            </Grid>
          </Hidden>

          <Grid item md={4} xs={8} className={classes.actionsSection}>
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
};

export default ContentTopNavigation;
