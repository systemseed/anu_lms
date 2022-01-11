import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { hex2rgba } from '@anu/utilities/helpers';
import { withStyles } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import ReactPlayer from 'react-player';

import LessonGrid from '@anu/components/LessonGrid';
import Duration from './AudioDuration';

const ProgressBar = withStyles({
  root: {
    height: 16,
    paddingBottom: 0,
  },
  thumb: {
    display: 'none',
  },
  active: {},
  track: {
    height: 16,
  },
  rail: {
    height: 16,
  },
})(Slider);

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: () => hex2rgba(theme.palette.primary.main, 0.08),
  },
}));

const Audio = ({ url, name }) => {
  const classes = useStyles();

  const [playing, setPlaying] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const player = useRef();

  const onAudioPlay = () => {
    setPlaying(!playing);
  };

  const handleSeekInProgress = (e, value) => {
    setSeeking(true);
    setPlaying(false);
    setPlayed(value);
  };

  const handleSeekChangeCommitted = (e, value) => {
    setSeeking(false);
    setPlayed(value);
    player.current.seekTo(value);
    setPlaying(true);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const label = playing ? 'Pause' : 'Play';

  return (
    <LessonGrid>
      <Box display="flex" p={2} className={classes.container}>
        <Box p={1} width={100}>
          <Button className="secondary" onClick={onAudioPlay}>
            {label}
          </Button>
        </Box>
        <Box flexGrow={1} p={1}>
          <Typography variant="body2">{name}</Typography>
          <ReactPlayer
            ref={player}
            playing={playing}
            url={url}
            height={0}
            width={0}
            config={{
              file: { forceAudio: true, attributes: { crossOrigin: 'anonymous' } },
            }}
            onProgress={handleProgress}
            onDuration={handleDuration}
          />

          <ProgressBar
            value={played}
            onChange={handleSeekInProgress}
            min={0.0}
            max={0.99}
            step={0.01}
            onChangeCommitted={handleSeekChangeCommitted}
          />

          <Box display="flex" justifyContent="space-between">
            <Duration seconds={duration * played} />
            <Duration seconds={duration} />
          </Box>
        </Box>
      </Box>
    </LessonGrid>
  );
};

Audio.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Audio;
