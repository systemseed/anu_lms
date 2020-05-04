import React from 'react';
import { connect } from 'react-redux';

import { isWidthUp, withWidth } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import PageContainer from '../../01_atoms/PageContainer';
import LessonSidebar from '../../03_organisms/LessonSidebar';

import * as lessonActions from '../../../redux/actions/lesson';
import { getDirection } from '../../../i18n';

const useSidebarStyles = makeStyles(theme => ({
  root: ({ isSidebarVisible }) => ({
    background: '#e8e8e8',
    color: theme.palette.secondary.main,
    position: 'absolute',
    left: isSidebarVisible ? 0 : -220,
    bottom: 0,
    top: 0,
    width: 220,
    transition: 'all .3s',
    minHeight: '100vh', // TODO: Ugly hack, should find something better than this!
    zIndex: 10,
  }),
}));

const StyledSidebarInner = withStyles({
  root: {
    width: 220,
  },
})(Box);

const useMainContentStyles = makeStyles(theme => ({
  root: {
    transition: 'all .3s',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginLeft: ({ isSidebarVisible }) => (
        isSidebarVisible && getDirection() === 'ltr' ? 220 : 0
      ),
      marginRight: ({ isSidebarVisible }) => (
        isSidebarVisible && getDirection() === 'rtl' ? 220 : 0
      ),
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(4),
    },
  }
}));

const StyledMobileOverlay = withStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 5,
    minHeight: '100vh', // TODO: Ugly hack, should find something better than this!
  },
}))(Box);

const StyledMainContent = ({ isSidebarVisible, children }) => {
  const classes = useMainContentStyles({ isSidebarVisible });

  return <Box className={classes.root}>{children}</Box>;
};

const StyledSidebar = ({ isSidebarVisible, children, ...props }) => {
  const classes = useSidebarStyles({ isSidebarVisible });

  return (
    <Box className={classes.root} {...props}>
      {children}
    </Box>
  );
};

const LessonPageTemplate = ({
  children,
  module,
  width,
  dispatch,
  isSidebarVisibleOnDesktop,
  isSidebarVisibleOnMobile,
}) => {
  const isSidebarVisible = isWidthUp('sm', width)
    ? isSidebarVisibleOnDesktop
    : isSidebarVisibleOnMobile;

  return (
    <PageContainer>
      {isSidebarVisibleOnMobile && !isWidthUp('sm', width) && (
        <StyledMobileOverlay onClick={() => dispatch(lessonActions.toggleSidebarOnMobile())} />
      )}

      <StyledSidebar isSidebarVisible={isSidebarVisible} id="sidebar">
        <StyledSidebarInner>
          <LessonSidebar module={module} />
        </StyledSidebarInner>
      </StyledSidebar>

      <StyledMainContent isSidebarVisible={isSidebarVisible}>
        {children}
      </StyledMainContent>
    </PageContainer>
  );
};

const mapStateToProps = ({ lesson }) => ({
  isSidebarVisibleOnDesktop: lesson.isSidebarVisibleOnDesktop,
  isSidebarVisibleOnMobile: lesson.isSidebarVisibleOnMobile,
});

export default connect(mapStateToProps)(withWidth()(LessonPageTemplate));
