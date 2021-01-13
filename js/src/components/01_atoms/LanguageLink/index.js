import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Offline, Online } from 'react-detect-offline';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

import SnackAlert from '../SnackAlert';

const StyledButton = withStyles(theme => ({
  root: {
    fontWeight: ({ active }) => (active ? 700 : 400),
    textTransform: 'none',
  },
}))(Button);

const LanguageLink = ({ isActive, label, url, onClick, endIcon, className, t }) => {
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleOfflineClick = (event) => {
    event.preventDefault();
    setAlertOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    setAlertOpen(false);
  };

  return (
    <>
      <Online>
        <StyledButton
          href={url}
          onClick={onClick}
          active={isActive}
          endIcon={endIcon}
          className={className}
        >
          {label}
        </StyledButton>
      </Online>
      <Offline>
        <StyledButton
          href={url}
          onClick={handleOfflineClick}
          active={isActive}
          endIcon={endIcon}
          className={className}
        >
          {label}
        </StyledButton>
        <SnackAlert
          show={alertOpen}
          message={t('It is not possible to change language whilst you are offline.')}
          onClose={handleAlertClose}
          severity="warning"
          variant="filled"
          spaced
          duration={5000}
        />
      </Offline>
    </>
  );
};

LanguageLink.propTypes = {
  isActive: PropTypes.bool,
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  endIcon: PropTypes.string,
};

LanguageLink.defaultProps = {
  isActive: false,
  className: '',
  url: null,
  onClick: () => {},
  endIcon: null,
};

export default withTranslation()(LanguageLink);
