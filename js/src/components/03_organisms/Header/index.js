import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withStyles, styled } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { getCurrentNode, isCourseListPage } from '../../../utils/node';
import * as lessonActions from '../../../redux/actions/lesson';
import { COURSE_LIST_PATH } from '../../../utils/constants'

const ButtonRaw = ({ isActive, ...props }) => (
  <Button {...props} />
);

const StyledButton = withStyles(theme => ({
  root: {
    color: 'white',
    background: ({ isActive }) => isActive ? '#757575' : 'none',
    borderRadius: 0,
    textTransform: 'none',
    fontSize: '0.875em',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      '&:hover' : {
        background: '#757575',
      },
    }
  },
  label: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      height: '52px',
    }
  },
  startIcon: {
    margin: 0,
  },
}))(ButtonRaw);

const StyledIcon = withStyles(theme => ({
  fontSizeLarge: {
    fontSize: '24px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '32px !important',
    }
  },
}))(Icon);

const StyledButtonGroup = withStyles(theme => ({
  root: {
    height: '48px',
    [theme.breakpoints.up('sm')]: {
      height: '80px',
    }
  }
}))(ButtonGroup);

const StyledAppBar = withStyles(theme => ({
  root: {
    background: '#3E3E3E',
  }
}))(AppBar);

const StyledToolbar = withStyles(theme => ({
  root: {
    background: '#3E3E3E',
    minHeight: '48px',
  }
}))(Toolbar);

const StyledDiv = styled('div')({
  flexGrow: 1
});

const Header = ({ width, dispatch, isLessonSidebarVisibleOnDesktop, isLessonSidebarVisibleOnMobile }) => {
  const node = getCurrentNode();
  return (
    <StyledAppBar position="static">
      <StyledToolbar disableGutters>

        <StyledButtonGroup variant="text">
          <StyledButton
            startIcon={<StyledIcon fontSize="large">home</StyledIcon>}
            href="/"
            isActive={window.location.pathname === '/' && isCourseListPage()}
          >
            {isWidthUp('sm', width) && 'Home'}
          </StyledButton>
          <StyledButton
            startIcon={<StyledIcon fontSize="large">dashboard</StyledIcon>}
            href={COURSE_LIST_PATH}
            isActive={window.location.pathname === COURSE_LIST_PATH && isCourseListPage()}
          >
            {isWidthUp('sm', width) && 'Courses'}
          </StyledButton>
          {node && (node.type === 'module_lesson' || node.type === 'module_assessment') &&
          <StyledButton
            startIcon={<StyledIcon fontSize="large">list</StyledIcon>}
            onClick={() => isWidthUp('sm', width) ? dispatch(lessonActions.toggleSidebarOnDesktop()) : dispatch(lessonActions.toggleSidebarOnMobile())}
            isActive={isWidthUp('sm', width) ? isLessonSidebarVisibleOnDesktop : isLessonSidebarVisibleOnMobile}
          >
            {isWidthUp('sm', width) && 'Contents'}
          </StyledButton>
          }
        </StyledButtonGroup>

        <StyledDiv/>

        <StyledButtonGroup variant="text">
          {node && node.type === 'module_assessment' &&
          <StyledButton
            startIcon={<StyledIcon fontSize="large">assignment</StyledIcon>}
            // TODO: Only if has access.
            href={`/node/${node.id}/assessment_results`}
          >
            {isWidthUp('sm', width) && 'Results'}
          </StyledButton>
          }
          {node &&
          <StyledButton
            startIcon={<StyledIcon fontSize="large">edit</StyledIcon>}
            // TODO: Only if has access.
            href={`/node/${node.id}/edit`}
          >
            {isWidthUp('sm', width) && 'Edit page'}
          </StyledButton>
          }
          <StyledButton
            startIcon={<StyledIcon fontSize="large">account_circle</StyledIcon>}
            // TODO: Only for logged in.
            href={`/user/${drupalSettings.user.uid}/edit`}
          >
            {isWidthUp('sm', width) && 'Profile'}
          </StyledButton>
        </StyledButtonGroup>

      </StyledToolbar>
    </StyledAppBar>
  );
}

const mapStateToProps = ({ lesson }) => ({
  isLessonSidebarVisibleOnDesktop: lesson.isSidebarVisibleOnDesktop,
  isLessonSidebarVisibleOnMobile: lesson.isSidebarVisibleOnMobile,
});

export default connect(mapStateToProps)(withWidth()(Header));
