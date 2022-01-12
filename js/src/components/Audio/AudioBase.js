import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';

import LessonGrid from '@anu/components/LessonGrid';
import AudioPlayer from '@anu/components/Audio/AudioPlayer';
import { withStyles } from '@material-ui/core';

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

const AudioBase = ({ url, name, classes }) => {
  return (
    <LessonGrid>
      <Box p={3} mt={-1} className={classes.container}>
        <Player url={url} name={name} />
      </Box>
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
