import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Offline, Online } from 'react-detect-offline';

import Button from '@material-ui/core/Button';

import SnackAlert from '../SnackAlert';

const LanguageLink = ({ isActive, label, url, onClick, endIcon, className, t }) => {
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleOfflineClick = event => {
    event.preventDefault();
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <Online>
        <Button
          href={url}
          onClick={onClick}
          endIcon={endIcon}
          className={className}
          style={{
            fontWeight: isActive ? 700 : 400,
            textTransform: 'none',
          }}
        >
          {label}
        </Button>
      </Online>

      <Offline>
        <Button
          href={url}
          onClick={handleOfflineClick}
          endIcon={endIcon}
          className={className}
          style={{
            fontWeight: isActive ? 700 : 400,
            textTransform: 'none',
          }}
        >
          {label}
        </Button>

        <SnackAlert
          show={alertOpen}
          message={t('It is not possible to change language while you are offline.')}
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
  endIcon: PropTypes.element,
  // Inherited from withTranslation HOC.
  t: PropTypes.func.isRequired,
};

LanguageLink.defaultProps = {
  isActive: false,
  className: '',
  url: null,
  onClick: () => {},
  endIcon: null,
};

export default withTranslation()(LanguageLink);
