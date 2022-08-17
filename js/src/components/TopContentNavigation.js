import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ContentNavigation from './ContentNavigation';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.grey[200],
    padding: theme.spacing(1.5, 4, 1.5, 4),
    marginLeft: theme.spacing(0.5),
  },
  stickyContainer: {
    position: 'fixed',
    top: 0,
  },
  actionsSection: {
    display: 'flex',
    justifyContent: 'end',
  },
  titleSection: {
    fontSize: '1.125rem',
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightBold,
    display: 'flex',
    alignItems: 'center',
  },
  titleWrapper: {
    paddingRight: '250px',
  }
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
}) => {
  const classes = useStyles();

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const navbar = document.getElementById('top-content-navigation');
      const toolbar = document.getElementById('toolbar-bar');
      const toolbarTray = document.getElementById('toolbar-item-administration-tray');

      if (toolbar) {
        // If the toolbar-tray is horizontal then the toolbar takes 2 lines.
        const multiplier = toolbarTray.classList.contains('toolbar-tray-horizontal') ? 2 : 1;
        navbar.style.top = `${toolbar.offsetHeight * multiplier}px`;
      }

      if (navbar.getBoundingClientRect().top + navbar.offsetHeight < window.scrollY) {
        setIsSticky(true);
        // Subtract paddings (64px) from the whole width.
        navbar.style.width = `${navbar.parentElement.offsetWidth - 64}px`;
      } else {
        setIsSticky(false);
        navbar.style.width = `auto`;
      }
    };

    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box className={`${classes.container} ${isSticky ? classes.stickyContainer : ''}`} id={'top-content-navigation'}>
      <Grid container spacing={4}>
        <Grid item md={8} xs={12} className={classes.titleSection}>
          <div className={classes.titleWrapper}>
            { currentLesson.title }
          </div>
        </Grid>

        <Grid item md={4} xs={12} className={classes.actionsSection}>
          <ContentNavigation
            isIntro={isIntro}
            sections={sections}
            currentLesson={currentLesson}
            nextLesson={nextLesson}
            prevLesson={prevLesson}
            currentIndex={currentIndex}
            isEnabled={isEnabled}
            ignorePaddings={true}
          />
        </Grid>
      </Grid>
    </Box>
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
};

export default ContentTopNavigation;
