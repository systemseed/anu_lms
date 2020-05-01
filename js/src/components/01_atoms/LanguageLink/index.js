import React from 'react';
import PropTypes from 'prop-types';

import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core';

const StyledLink = withStyles(theme => ({
  root: {
    fontWeight: ({ active }) => (active ? 700 : 400),
    opacity: ({ active }) => (active ? 1 : 0.7),
    marginRight: theme.spacing(3),
    '&:last-child': {
      marginRight: 0,
    },
  },
}))(Link);

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
