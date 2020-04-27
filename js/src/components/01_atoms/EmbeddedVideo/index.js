import React  from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { Offline, Online } from 'react-detect-offline';
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

const EmbeddedVideo = ({ url }) => {

  // Is the URL is empty - we obviously can't show the video.
  if (!url) {
    return null;
  }

  // Make sure the URL is playable. Does not include cases like private video
  // settings.
  const isValid = ReactPlayer.canPlay(url);

  return (
    <StyledBox>
      <LessonGrid>
        <Online>
          {!isValid &&
          <Typography variant="subtitle1">
            <em>The lesson contains video, but the link to it either invalid or broken.</em>
          </Typography>
          }
          {isValid &&
          <ReactPlayer
            url={url}
            controls
            playing={false}
            loop={false}
            width="100%"
          />
          }
        </Online>
        <Offline>
          <Typography variant="subtitle1">
            <em>The lesson contains video, but it is not available offline.</em>
          </Typography>
        </Offline>
      </LessonGrid>
    </StyledBox>
  );
};

export default EmbeddedVideo;
