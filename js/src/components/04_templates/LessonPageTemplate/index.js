import React from 'react';
import { connect } from 'react-redux';
import { isWidthUp, withWidth } from '@material-ui/core'
import Box from '@material-ui/core/Box';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PageContainer from '../../01_atoms/PageContainer';
import LessonSidebar from '../../03_organisms/LessonSidebar';
import * as lessonActions from '../../../redux/actions/lesson';

const useSidebarStyles = makeStyles(theme => ({
  root: ({ isSidebarVisible }) => ({
    background: '#e8e8e8',
    color: theme.palette.secondary.main,
    position: 'absolute',
    left: isSidebarVisible ? 0 : '-220px',
    bottom: 0,
    top: 0,
    width: '220px',
    transition: 'all .3s',
    minHeight: '100vh', // TODO: Ugly hack, should find something better than this!
    zIndex: 10,
  })
}));

const StyledSidebar = ({ isSidebarVisible, children, ...props }) => {
  const classes = useSidebarStyles({ isSidebarVisible });
  return <Box className={classes.root} {...props}>{children}</Box>;
};

const StyledSidebarInner = withStyles({
  root: {
    width: '220px',
  }
})(Box);

const useMainContentStyles = makeStyles(theme => ({
  root: {
    transition: 'all .3s',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginLeft: ({ isSidebarVisible }) => isSidebarVisible ? '220px' : 0,
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(4),
    },
  }
}));

const StyledMainContent = ({ isSidebarVisible, children }) => {
  const classes = useMainContentStyles({ isSidebarVisible });
  return <Box className={classes.root}>{children}</Box>;
};

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
  }
}))(Box);

class LessonPageTemplate extends React.Component {

  render() {
    const { children, module, width, dispatch, isSidebarVisibleOnDesktop, isSidebarVisibleOnMobile } = this.props;

    const isSidebarVisible = isWidthUp('sm', width) ? isSidebarVisibleOnDesktop : isSidebarVisibleOnMobile;

    return (
      <PageContainer>

        {isSidebarVisibleOnMobile && !isWidthUp('sm', width) &&
        <StyledMobileOverlay onClick={() => dispatch(lessonActions.toggleSidebarOnMobile())} />
        }

        <StyledSidebar isSidebarVisible={isSidebarVisible} id="sidebar">
          <StyledSidebarInner>
            <LessonSidebar module={module} />
          </StyledSidebarInner>
        </StyledSidebar>

        <StyledMainContent isSidebarVisible={isSidebarVisible}>
          {children}
        </StyledMainContent>

      </PageContainer>
    )
  }
}

const mapStateToProps = ({ lesson }) => ({
  isSidebarVisibleOnDesktop: lesson.isSidebarVisibleOnDesktop,
  isSidebarVisibleOnMobile: lesson.isSidebarVisibleOnMobile,
});

export default connect(mapStateToProps)(withWidth()(LessonPageTemplate));
