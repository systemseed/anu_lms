import React from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import ReactPlayer from 'react-player';
import LessonGrid from '../LessonGrid';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    }
  }
}))(Box);

const EmbeddedVideo = ({ url }) => (
  <StyledBox>
    <LessonGrid>
      {url &&
      <ReactPlayer
        url={url}
        controls
        playing={false}
        loop={false}
        width="100%"
      />
      }
    </LessonGrid>
  </StyledBox>
);

export default EmbeddedVideo;
