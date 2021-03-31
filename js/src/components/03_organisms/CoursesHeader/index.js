import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withStyles, withTheme } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import LanguageSwitcher from '../LanguageSwitcher';

import * as lessonActions from '../../../redux/actions/lesson';
import { getCurrentNode } from '../../../utils/node';
import { getMenu } from '../../../utils/menu';
import { getLangCodePrefix } from '../../../utils/settings';

const CoursesHeader = ({ t, theme, settings, width, dispatch }) => {
  const [menuDropdown, setMenuDropdown] = useState({});
  const node = getCurrentNode();
  const menu = getMenu();

  const handleDropdownOpen = (event, i) => {
    setMenuDropdown({ ...menuDropdown, [i]: event.currentTarget });
  };

  const handleDropdownClose = i => {
    setMenuDropdown({ ...menuDropdown, [i]: null });
  };

  // TODO
  console.log(lessonActions);
  console.log(node);
  console.log(menu);

  const AdminButton = () => <Button>ADMIN MODE</Button>;
  const UserButton = () => <Button>USER</Button>;

  const tmpMenuItems = [
    { label: 'Home', url: 'https://whoequip.org' },
    { label: 'Dashboard', url: 'https://whoequip.org/en-gb/assessment' },
    {
      label: 'E-learning',
      links: [
        { label: 'For Trainers', url: 'https://whoequip.org/en-gb/courses/trainers' },
        { label: 'For Helpers', url: 'https://whoequip.org/en-gb/courses/helpers' },
        { label: 'All Courses', url: 'https://whoequip.org/en-gb/courses' },
      ],
    },
  ];

  return (
    <AppBar color="default" position="sticky">
      <LanguageSwitcher label={settings.betaLogo} />

      <Toolbar>
        {settings.logo && settings.logo.url && (
          <Link href={getLangCodePrefix()}>
            <img
              src={settings.logo.url}
              alt={settings.logo.alt}
              style={{
                maxHeight: 50,
                '&:hover': {
                  opacity: '0.95',
                },
              }}
            />
          </Link>
        )}

        <Box>
          {/* Render right side - navigation menu */}
          <Tabs value={2}>
            {tmpMenuItems.map((item, i) =>
              item.links ? (
                <Tab
                  key={`dropdown-${item.url}`}
                  id={`nav-tab-${i}`}
                  onClick={event => handleDropdownOpen(event, i)}
                  label={(
                    <Box display="flex">
                      {item.label}
                      &nbsp;
                      <KeyboardArrowDownIcon />
                    </Box>
                  )}
                />
              ) : (
                <Tab
                  key={item.url}
                  id={`nav-tab-${i}`}
                  component="a"
                  href={item.url}
                  onClick={event => event.preventDefault()}
                  label={item.label}
                />
              )
            )}
          </Tabs>

          {tmpMenuItems.map(
            (item, i) =>
              item.links && (
                <Menu
                  key={`menu-${item.url}`}
                  anchorEl={menuDropdown[i]}
                  open={Boolean(menuDropdown[i])}
                  onClose={() => handleDropdownClose(i)}
                  getContentAnchorEl={null}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  keepMounted
                >
                  {item.links.map(link => (
                    <MenuItem
                      key={link.url}
                      component="a"
                      href={link.url}
                      style={{
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  ))}
                </Menu>
              )
          )}
        </Box>

        <div style={{ flexGrow: 1 }} />

        <div>
          {/* Render left side -  */}
          <AdminButton />

          <UserButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

CoursesHeader.propTypes = {
  settings: PropTypes.shape().isRequired,
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

export default connect(mapStateToProps)(withWidth()(withTranslation()(withTheme(CoursesHeader))));
