import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Offline, Online } from 'react-detect-offline';
import Button from '@material-ui/core/Button';
import { withStyles, withTheme } from '@material-ui/core/styles';

import SnackAlert from '../SnackAlert';

const CompactIconButton = withStyles(theme => ({
  endIcon: {
    margingLeft: theme.spacing(0.5),
  },
}))(Button);

const LanguageLink = ({ isActive, label, url, onClick, endIcon, t, theme }) => {
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleOfflineClick = event => {
    event.preventDefault();
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const linkStyle = {
    color: isActive ? 'inherit' : theme.palette.secondary.light,
    fontWeight: isActive ? 700 : 'inherit',
    textTransform: 'none',
    minWidth: 70,
    borderRadius: 0,
  };

  return (
    <>
      <Online>
        <CompactIconButton href={url} onClick={onClick} endIcon={endIcon} style={linkStyle}>
          {label}
        </CompactIconButton>
      </Online>

      <Offline>
        <CompactIconButton
          href={url}
          onClick={handleOfflineClick}
          endIcon={endIcon}
          style={linkStyle}
        >
          {label}
        </CompactIconButton>

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
  onClick: PropTypes.func,
  endIcon: PropTypes.element,
  // Inherited from withTranslation HOC.
  t: PropTypes.func.isRequired,
  // Inherited from withTheme HOC.
  theme: PropTypes.shape().isRequired,
};

LanguageLink.defaultProps = {
  isActive: false,
  url: null,
  onClick: () => {},
  endIcon: null,
};

export default withTranslation()(withTheme(LanguageLink));
