import React from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';

const BackLink = () => {
  const history = useHistory();

  return (
    <Link
      onClick={() => history.goBack()}
      variant="body2"
      color="inherit"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        textTransform: 'uppercase',
      }}
    >
      <Icon style={{ textDecoration: 'none' }}>arrow_back</Icon>

      <Box ml={1} mr={1}>
        {Drupal.t('Back', {}, { context: 'ANU LMS' })}
      </Box>
    </Link>
  );
};

export default BackLink;
