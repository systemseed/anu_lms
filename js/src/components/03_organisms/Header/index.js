import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withStyles, makeStyles, styled } from '@material-ui/core/styles';
import { Icon, Link } from '@material-ui/core';

import LanguageSwitcher from '../LanguageSwitcher';

import * as lessonActions from '../../../redux/actions/lesson';
import { getCurrentNode } from '../../../utils/node';
import { getMenu, getMenuIconById } from '../../../utils/menu';
import { getLangCodePrefix } from '../../../utils/settings';

const ButtonRaw = ({ isActive, ...props }) => <Button {...props} />;

const StyledButton = withStyles(theme => ({
  root: {
    color: 'white',
    background: ({ isActive }) => (isActive ? '#757575' : 'none'),
    borderRadius: 0,
    textTransform: 'none',
    fontSize: '0.875em',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      '&:hover': {
        background: '#757575',
      },
    },
  },
  label: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      height: '52px',
    },
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
    },
  },
}))(Icon);

const StyledButtonGroup = withStyles(theme => ({
  root: {
    height: '48px',
    [theme.breakpoints.up('sm')]: {
      height: '80px',
    },
  },
}))(ButtonGroup);

const StyledToolbar = withStyles(theme => ({
  root: {
    background: theme.palette.secondary.main,
    minHeight: '48px',
  },
}))(Toolbar);

const StyledDiv = styled('div')({
  flexGrow: 1,
});

const useAppBarStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.secondary.main,
    zIndex: 100,
  },
}));

const StyledImg = styled('img')({
  display: 'block',
  marginRight: '20px',
  marginLeft: '20px',
  maxHeight: '46px',
  '&:hover': {
    opacity: '0.95',
  },
});

const StyledLink = withStyles(theme => ({
  root: {
    display: 'none',
    textDecoration: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))(Link);

const StyledAppBar = ({ children, ...props }) => {
  const classes = useAppBarStyles();

  return (
    <AppBar className={classes.root} {...props}>
      {children}
    </AppBar>
  );
};

const Header = ({
  t,
  settings,
  width,
  dispatch,
  isLessonSidebarVisibleOnDesktop,
  isLessonSidebarVisibleOnMobile
}) => {
  const node = getCurrentNode();
  const menu = getMenu();

  return (
    <>
      <LanguageSwitcher label={settings.betaLogo} />

      <StyledAppBar position="sticky">
        <StyledToolbar disableGutters>
          {settings.logo && settings.logo.url && (
            <StyledLink href={getLangCodePrefix()}>
              <StyledImg src={settings.logo.url} alt={settings.logo.alt} />
            </StyledLink>
          )}

          <StyledButtonGroup variant="text">
            {/* Render primary menu of the site */}
            {menu && menu.primary && menu.primary.map(menuItem => (
              <StyledButton
                startIcon={(
                  <StyledIcon fontSize="large">
                    {getMenuIconById(menuItem.id)}
                  </StyledIcon>
                )}
                href={menuItem.url}
                isActive={window.location.pathname === menuItem.url}
                key={menuItem.url}
              >
                {isWidthUp('sm', width) && menuItem.title}
              </StyledButton>
            ))}

            {/* Special menu item appearing only on the lesson or assessment page */}
            {node && (node.type === 'module_lesson' || node.type === 'module_assessment') && (
              <StyledButton
                startIcon={<StyledIcon fontSize="large">list</StyledIcon>}
                onClick={() => isWidthUp('sm', width) ? dispatch(lessonActions.toggleSidebarOnDesktop()) : dispatch(lessonActions.toggleSidebarOnMobile())}
                isActive={isWidthUp('sm', width) ? isLessonSidebarVisibleOnDesktop : isLessonSidebarVisibleOnMobile}
              >
                {isWidthUp('sm', width) && t('Contents')}
              </StyledButton>
            )}

          </StyledButtonGroup>

          <StyledDiv />

          <StyledButtonGroup variant="text">
            {/* Render secondary menu of the site */}
            {menu && menu.secondary && menu.secondary.map(menuItem => (
              <StyledButton
                startIcon={(
                  <StyledIcon fontSize="large">
                    {getMenuIconById(menuItem.id)}
                  </StyledIcon>
                )}
                href={menuItem.url}
                isActive={window.location.pathname === menuItem.url}
                key={menuItem.url}
              >
                {isWidthUp('sm', width) && menuItem.title}
              </StyledButton>
            ))}
          </StyledButtonGroup>
        </StyledToolbar>
      </StyledAppBar>
    </>
  );
}

const mapStateToProps = ({ lesson }) => ({
  isLessonSidebarVisibleOnDesktop: lesson.isSidebarVisibleOnDesktop,
  isLessonSidebarVisibleOnMobile: lesson.isSidebarVisibleOnMobile,
});

export default connect(mapStateToProps)(withWidth()(withTranslation()(Header)));
