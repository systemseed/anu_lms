import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

const StyledButton = withStyles(theme => ({
  root: {
    fontWeight: ({ active }) => (active ? 700 : 400),
    textTransform: 'none',
  },
}))(Button);

const LanguageLink = ({ isActive, label, url, onClick, endIcon, className }) => (
  <StyledButton
    href={url}
    onClick={onClick}
    active={isActive}
    endIcon={endIcon}
    className={className}
  >
    {label}
  </StyledButton>
);

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

export default LanguageLink;
