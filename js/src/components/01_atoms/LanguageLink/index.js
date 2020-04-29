import React from 'react';
import PropTypes from 'prop-types';

import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core';

const StyledLink = withStyles({
  root: {
    fontWeight: ({ active }) => (active ? 700 : 400),
    opacity: ({ active }) => (active ? 1 : 0.7),
  }
})(Link);

const LanguageLink = ({ isActive, label, url, color }) => (
  <StyledLink
    href={url}
    active={isActive}
    style={{ color }}
  >
    {label}
  </StyledLink>
);

LanguageLink.propTypes = {
  isActive: PropTypes.bool,
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  color: PropTypes.string,
};

LanguageLink.defaultProps = {
  isActive: false,
  color: '#fff',
};

export default LanguageLink;
