import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Detector } from 'react-detect-offline';

import Box from '@material-ui/core/Box';
import { Typography, withStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloudOffIcon from '@material-ui/icons/CloudOff';

import LessonGrid from '@anu/components/LessonGrid';
import AudioPlayer from '@anu/components/Audio/AudioPlayer';
import { getPwaSettings } from '@anu/utilities/settings';
import { hex2rgba } from '@anu/utilities/helpers';

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

const NotAvailableOfflineMessage = withStyles((theme) => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: hex2rgba(theme.palette.grey[200], 0.95),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& p': {
      marginLeft: theme.spacing(1),
    },
  },
}))(Box);

const AudioBase = ({ url, name, classes }) => {
  const [isAvailableOffline, setAvailableOffline] = useState(-1);

  // Check PWA cache for the audio file and set isAvailableOffline accordingly.
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
      <Box
        p={3}
        pb={isAvailableOffline ? 1 : 3}
        mt={-1}
        position="relative"
        className={classes.container}
      >
        <Detector
          polling={false}
          render={({ online }) => {
            const showOfflineMessage = !online && isAvailableOffline === false;
            return (
              <>
                <Player url={url} name={name} showLoading={!showOfflineMessage} />
                {showOfflineMessage && (
                  <NotAvailableOfflineMessage p={3}>
                    <CloudOffIcon />
                    <Typography>
                      {Drupal.t('Audio not available offline', {}, { context: 'ANU LMS' })}
                    </Typography>
                  </NotAvailableOfflineMessage>
                )}
              </>
            );
          }}
        />
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
