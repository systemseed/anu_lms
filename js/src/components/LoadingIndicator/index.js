import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import SyncIcon from '@material-ui/icons/Sync';

import './loading-indicator.css';

const LoadingIndicator = ({ isLoading, label }) => {
  const theme = useTheme();

  return (
    <Box display="flex">
      <SyncIcon
        style={{
          animation: isLoading ? 'rotation 1s linear infinite' : 'none',
          marginRight: theme.spacing(0.5),
        }}
      />

      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

LoadingIndicator.propTypes = {
  isLoading: PropTypes.bool,
  label: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  isLoading: false,
  label: null,
};

export default LoadingIndicator;
