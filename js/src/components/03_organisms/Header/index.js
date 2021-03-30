import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { makeStyles, withStyles, withTheme } from '@material-ui/core/styles';

import LanguageSwitcher from '../LanguageSwitcher';

import * as lessonActions from '../../../redux/actions/lesson';
import { getCurrentNode } from '../../../utils/node';
import { getMenu, getMenuIconById } from '../../../utils/menu';
import { getLangCodePrefix } from '../../../utils/settings';

const StyledButton = withStyles(theme => ({
  root: {
    color: 'white',
    borderRadius: 0,
    textTransform: 'none',
    fontSize: '0.875em',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      '&:hover': {
        background: '#757575 !important',
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
}))(Button);

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

const useLogoStyles = makeStyles(theme => ({
  root: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    maxHeight: 46,
    '&:hover': {
      opacity: '0.95',
    },
  },
}));

const StyledLink = withStyles(theme => ({
  root: {
    display: 'none',
    textDecoration: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))(Link);

const Header = ({
  t,
  theme,
  settings,
  width,
  dispatch,
  isLessonSidebarVisibleOnDesktop,
  isLessonSidebarVisibleOnMobile,
}) => {
  const node = getCurrentNode();
  const menu = getMenu();
  const logoClasses = useLogoStyles();

  return (
    <>
      <LanguageSwitcher label={settings.betaLogo} />

      <AppBar
        position="sticky"
        style={{
          background: theme.palette.secondary.main,
          zIndex: 100,
        }}
      >
        <StyledToolbar disableGutters>
          {settings.logo && settings.logo.url && (
            <StyledLink href={getLangCodePrefix()}>
              <img className={logoClasses.root} src={settings.logo.url} alt={settings.logo.alt} />
            </StyledLink>
          )}

          <StyledButtonGroup variant="text">
            {/* Render primary menu of the site */}
            {menu &&
              menu.primary &&
              menu.primary.map(menuItem => (
                <StyledButton
                  key={menuItem.url}
                  startIcon={
                    <StyledIcon fontSize="large">{getMenuIconById(menuItem.id)}</StyledIcon>
                  }
                  href={menuItem.url}
                  style={{
                    background: window.location.pathname === menuItem.url ? '#757575' : 'none',
                  }}
                >
                  {isWidthUp('sm', width) && menuItem.title}
                </StyledButton>
              ))}

            {/* Special menu item appearing only on the lesson or assessment page */}
            {node && (node.type === 'module_lesson' || node.type === 'module_assessment') && (
              <StyledButton
                startIcon={<StyledIcon fontSize="large">list</StyledIcon>}
                onClick={() =>
                  isWidthUp('sm', width)
                    ? dispatch(lessonActions.toggleSidebarOnDesktop())
                    : dispatch(lessonActions.toggleSidebarOnMobile())
                }
                style={{
                  background: (isWidthUp('sm', width)
                  ? isLessonSidebarVisibleOnDesktop
                  : isLessonSidebarVisibleOnMobile)
                    ? '#757575'
                    : 'none',
                }}
              >
                {isWidthUp('sm', width) && t('Contents')}
              </StyledButton>
            )}
          </StyledButtonGroup>

          <div style={{ flexGrow: 1 }} />

          <StyledButtonGroup variant="text">
            {/* Render secondary menu of the site */}
            {menu &&
              menu.secondary &&
              menu.secondary.map(menuItem => (
                <StyledButton
                  startIcon={
                    <StyledIcon fontSize="large">{getMenuIconById(menuItem.id)}</StyledIcon>
                  }
                  href={menuItem.url}
                  key={menuItem.url}
                  style={{
                    background: window.location.pathname === menuItem.url ? '#757575' : 'none',
                  }}
                >
                  {isWidthUp('sm', width) && menuItem.title}
                </StyledButton>
              ))}
          </StyledButtonGroup>
        </StyledToolbar>
      </AppBar>
    </>
  );
};

Header.propTypes = {
  settings: PropTypes.shape().isRequired,
  isLessonSidebarVisibleOnDesktop: PropTypes.bool.isRequired,
  isLessonSidebarVisibleOnMobile: PropTypes.bool.isRequired,
  // Inherited from withWidth HOC.
  width: PropTypes.string.isRequired,
  // Inherited from withTranslation HOC
  t: PropTypes.func.isRequired,
  // Inherited from withTheme HOC
  theme: PropTypes.shape().isRequired,
  // Inherited from connect HOC
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ lesson }) => ({
  isLessonSidebarVisibleOnDesktop: lesson.isSidebarVisibleOnDesktop,
  isLessonSidebarVisibleOnMobile: lesson.isSidebarVisibleOnMobile,
});

export default connect(mapStateToProps)(withWidth()(withTranslation()(withTheme(Header))));
