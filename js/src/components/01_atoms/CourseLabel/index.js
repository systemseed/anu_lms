import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';

const CourseLabel = ({ name, color }) => {
  const colorLookup = {
    yellow: '#FFE082',
    grey: '#CFD8DC',
    green: '#B2DFDB',
    purple: '#C8D4F7',
    blue: '#BBDEFB',
    red: '#FFCDD2',
  };

  return (
    <Box
      px={1}
      py={0.5}
      bgcolor={colorLookup[color]}
      style={{ borderRadius: 4, width: 'max-content', height: 'max-content' }}
    >
      <Typography variant="subtitle2" style={{ textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {name}
      </Typography>
    </Box>
  );
};

CourseLabel.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['yellow', 'grey', 'green', 'purple', 'blue', 'red']).isRequired,
};

export default CourseLabel;
