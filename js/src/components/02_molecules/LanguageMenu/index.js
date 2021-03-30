import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Offline, Online } from 'react-detect-offline';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import LanguageLink from '../../01_atoms/LanguageLink';
import SnackAlert from '../../01_atoms/SnackAlert';

import { getLangCode } from '../../../utils/settings';

const StyledMenu = withStyles({
  paper: {
    minWidth: '260px',
  },
  list: {
    paddingTop: '4px',
    paddingBottom: '4px',
  },
})(Menu);

const StyledMenuItem = withStyles(() => ({
  root: {
    padding: 0,
  },
}))(MenuItem);

const useStyles = makeStyles({
  more: {
    color: '#fff',
    lineHeight: '18px',
    padding: '9px 12px',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#212121',
    },
  },
  listLink: {
    padding: '13px 30px',
    lineHeight: '20px',
    minWidth: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const LanguageMenu = ({ options, t }) => {
  const classes = useStyles();
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
    <>
      <LanguageLink
        label={t('More')}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon style={{ fontSize: 18 }} />}
        className={classes.more}
      />

      <StyledMenu
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
          <div key={lang.code}>
            <Online>
              <StyledMenuItem key={lang.code} onClick={() => (window.location.href = lang.url)}>
                <LanguageLink
                  isActive={getLangCode() === lang.code}
                  label={lang.title}
                  className={classes.listLink}
                  url="#"
                />
              </StyledMenuItem>
            </Online>

            <Offline>
              <StyledMenuItem key={lang.code} onClick={handleOfflineClick}>
                <LanguageLink
                  isActive={getLangCode() === lang.code}
                  label={lang.title}
                  className={classes.listLink}
                  url="#"
                />
              </StyledMenuItem>
            </Offline>
          </div>
        ))}
      </StyledMenu>

      <SnackAlert
        show={alertOpen}
        message={t('It is not possible to change language while you are offline.')}
        onClose={handleAlertClose}
        severity="warning"
        variant="filled"
        spaced
        duration={5000}
      />
    </>
  );
};

LanguageMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape()),
  // Inherited from withTranslation HOC.
  t: PropTypes.func.isRequired,
};

LanguageMenu.defaultProps = {
  options: [],
};

export default withTranslation()(LanguageMenu);
