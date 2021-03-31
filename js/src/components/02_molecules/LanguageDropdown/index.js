import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Detector } from 'react-detect-offline';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import LanguageLink from '../../01_atoms/LanguageLink';
import SnackAlert from '../../01_atoms/SnackAlert';

import { getLangCode } from '../../../utils/settings';

const LanguageDropdown = ({ options, t }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOfflineClick = event => {
    event.preventDefault();
    setAnchorEl(null);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <Detector
      render={({ online }) => (
        <>
          <LanguageLink
            isActive={Boolean(
              options.find(lang => window.location.pathname.split('/')[1] === lang.code)
            )}
            label={t('More')}
            onClick={handleClick}
            endIcon={<ExpandMoreIcon />}
          />

          <Menu
            elevation={1}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {options.map(lang => (
              <MenuItem
                key={lang.code}
                onClick={() => (online ? (window.location.href = lang.url) : handleOfflineClick())}
                style={{ minWidth: 100 }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: getLangCode() === lang.code ? 700 : 'inherit',
                  }}
                >
                  {lang.title}
                </p>
              </MenuItem>
            ))}
          </Menu>

          {!online && (
            <SnackAlert
              show={alertOpen}
              message={t('It is not possible to change language while you are offline.')}
              onClose={handleAlertClose}
              severity="warning"
              variant="filled"
              spaced
              duration={5000}
            />
          )}
        </>
      )}
    />
  );
};

LanguageDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape()),
  // Inherited from withTranslation HOC.
  t: PropTypes.func.isRequired,
};

LanguageDropdown.defaultProps = {
  options: [],
};

export default withTranslation()(LanguageDropdown);
