import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';

import LessonGrid from '@anu/components/LessonGrid';
import AudioPlayer from '@anu/components/Audio/AudioPlayer';
import { getPwaSettings } from '@anu/utilities/settings';
import { Typography, withStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const Player = withStyles((theme) => ({
  wrapper: {
    display: 'flex',
    direction: 'row',
    width: '100%',
  },
  button: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2),
    marginBottom: 0,
    flexShrink: 0,
  },
  buttonActive: {
    border: '5px solid ' + theme.palette.primary.main,
  },
  buttonIcon: {
    fontSize: '2.2em',
  },
  loader: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}))(AudioPlayer);

const AvailableOfflineMessage = withStyles((theme) => ({
  root: {
    color: theme.palette.success.main,
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderTop: '1px solid white',
    '& p': {
      color: theme.palette.success.main,
      marginLeft: theme.spacing(0.5),
      fontSize: '0.875rem',
    },
    '& svg': {
      fontSize: '20px',
      position: 'relative',
      top: '2px',
    },
  },
}))(Box);

const AudioBase = ({ url, name, classes }) => {
  const [isAvailableOffline, setAvailableOffline] = useState(false);

  useEffect(async () => {
    const pwaSettings = getPwaSettings();
    if (!pwaSettings || !pwaSettings.current_cache) {
      return;
    }

    const cache = await caches.open(pwaSettings.current_cache);
    const response = await cache.match(url, { ignoreSearch: true, ignoreVary: true });
    setAvailableOffline(!!response);
  }, []);

  return (
    <LessonGrid>
      <Box p={3} pb={isAvailableOffline ? 1 : 3} mt={-1} className={classes.container}>
        <Player url={url} name={name} />
      </Box>
      {isAvailableOffline && (
        <AvailableOfflineMessage display="flex" className={classes.container}>
          <CheckCircleIcon />
          <Typography>
            {Drupal.t('This audio is ready to be used offline', {}, { context: 'ANU LMS' })}
          </Typography>
        </AvailableOfflineMessage>
      )}
    </LessonGrid>
  );
};

AudioBase.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object,
};

AudioBase.defaultProps = {
  classes: {
    container: '',
  },
};

export default AudioBase;
