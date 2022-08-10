import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import ReactPlayer from 'react-player';
import { formatTime } from '@anu/utilities/helpers';
import { highlightText } from '@anu/utilities/searchHighlighter';

/**
 * Reusable player component.
 *
 * See ./index.js for example usage.
 */
const AudioPlayer = ({
  url,
  name,
  playing,
  showButton,
  showTimings,
  showLoading,
  classes,
  ...props
}) => {
  const [isPlaying, setPlaying] = useState(isPlaying);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setReady] = useState(false);

  // During seeking progress we temporarily pause playback until the selected
  // part of the audio is ready to play. During this seeking process we avoid
  // play button change to keep interface clean.
  const [seeking, setSeeking] = useState({ isSeeking: false, forcePlayButton: false });

  useEffect(() => {
    setPlaying(playing);
  }, [playing]);

  const player = useRef();

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
  };

  const handleSeekInProgress = (e, value) => {
    setSeeking({
      isSeeking: true,
      forcePlayButton: seeking.forcePlayButton || isPlaying,
    });
    setPlaying(false);
    setPlayed(value);
  };

  const handleSeekChangeCommitted = (e, value) => {
    setSeeking({ isSeeking: false, forcePlayButton: false });
    setPlayed(value);
    player.current.seekTo(value);
    setPlaying(true);
  };

  const handleProgress = (state) => {
    if (!seeking.isSeeking && state.played !== 1) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleReady = () => {
    setReady(true);
  };

  const handleEnded = () => {
    setPlayed(0);
    setPlaying(false);
  };

  const showPauseButton = isPlaying || seeking.forcePlayButton;

  return (
    <Box className={classes.wrapper}>
      {showButton && (
        <Box className={`${classes.button} ${isReady ? classes.buttonActive : ''}`}>
          {!isReady && showLoading && <CircularProgress size={null} className={classes.loader} />}
          {showPauseButton && (
            <PauseIcon
              onClick={handlePlayPause}
              className={`${classes.buttonIcon} ${isReady ? classes.buttonIconActive : ''}`}
            />
          )}
          {!showPauseButton && (
            <PlayIcon
              onClick={handlePlayPause}
              className={`${classes.buttonIcon} ${isReady ? classes.buttonIconActive : ''}`}
              role="button"
            />
          )}
        </Box>
      )}
      <Box className={classes.player}>
        <ReactPlayer
          ref={player}
          url={url}
          height={0}
          width={0}
          config={{
            file: { forceAudio: true, attributes: { crossOrigin: 'anonymous' } },
          }}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onEnded={handleEnded}
          {...props}
          playing={isPlaying}
        />

        {name && (
          <Typography variant="body2" className={classes.name}>
            {highlightText(name)}
          </Typography>
        )}
        <Slider
          value={played}
          min={0.0}
          max={1}
          step={0.01}
          onChange={handleSeekInProgress}
          onChangeCommitted={handleSeekChangeCommitted}
          classes={{
            root: classes.progressRoot,
            thumb: classes.progressThumb,
            active: classes.progressActive,
            track: classes.progressTrack,
            rail: classes.progressRail,
          }}
        />
        {showTimings && (
          <Box
            className={classes.timings}
            display="flex"
            justifyContent="space-between"
            style={{ visibility: isReady ? 'visible' : 'hidden' }}
          >
            <Typography variant="body2" className={classes.time}>
              {formatTime(duration * played)}
            </Typography>
            <Typography variant="body2" className={classes.time}>
              {formatTime(duration)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

AudioPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string,
  playing: PropTypes.bool,
  showButton: PropTypes.bool,
  showTimings: PropTypes.bool,
  showLoading: PropTypes.bool,
  classes: PropTypes.object,
};

AudioPlayer.defaultProps = {
  name: '',
  playing: false,
  showButton: true,
  showTimings: true,
  showLoading: true,
  classes: {},
};

export default withStyles((theme) => ({
  wrapper: {},
  player: {
    width: '100%',
  },
  name: {
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    color: theme.palette.primary.main,
  },
  timings: {
    paddingLeft: '2px',
    paddingRight: '2px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: '0 auto',
    width: theme.spacing(13),
    height: theme.spacing(13),
    marginBottom: theme.spacing(5),
  },
  buttonActive: {
    padding: theme.spacing(2),
    borderRadius: '50%',
    cursor: 'pointer',
    border: '10px solid ' + theme.palette.primary.main,
  },
  loader: {
    width: 104,
    height: 104,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: theme.palette.primary.main + 60,
  },
  buttonIcon: {
    color: theme.palette.primary.main + 60,
    fontSize: '4em',
  },
  buttonIconActive: {
    color: theme.palette.primary.main,
  },
  time: {
    color: theme.palette.primary.main,
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },
  // Progress Bar styles.
  progressRoot: {
    height: 16,
    padding: 0,
    marginTop: theme.spacing(1),
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressThumb: {
    display: 'none',
  },
  progressActive: {},
  progressTrack: {
    height: 16,
    backgroundColor: theme.palette.primary.main,
  },
  progressRail: {
    height: 16,
    backgroundColor: theme.palette.primary.main + 40,
  },
}))(AudioPlayer);
