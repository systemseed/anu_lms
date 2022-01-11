import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { hex2rgba } from '@anu/utilities/helpers';
import makeStyles from '@material-ui/core/styles/makeStyles';

import LessonGrid from '@anu/components/LessonGrid';
import Player from './Player';
import { withStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: hex2rgba(theme.palette.primary.main, 0.08),
  },
}));

const SmallPlayer = withStyles((theme) => ({
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
}))(Player);

const Audio = ({ url, name }) => {
  const classes = useStyles();

  return (
    <LessonGrid>
      <Box p={3} className={classes.container}>
        <SmallPlayer url={url} name={name} />
      </Box>
    </LessonGrid>
  );
};

Audio.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Audio;
