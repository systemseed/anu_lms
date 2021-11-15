import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Offline, Online } from 'react-detect-offline';
import ReactPlayer from 'react-player';
import LessonGrid from '@anu/components/LessonGrid';

const EmbeddedVideo = ({ url }) => {
  // Is the URL is empty - we obviously can't show the video.
  if (!url) {
    return null;
  }

  // Make sure the URL is playable. Does not include cases like private video
  // settings.
  const isValid = ReactPlayer.canPlay(url);

  return (
    <LessonGrid>
      <Online>
        {!isValid && (
          <Typography variant="subtitle1">
            <em>
              {Drupal.t(
                'The lesson contains video, but the link to it either invalid or broken.',
                {},
                { context: 'ANU LMS' }
              )}
            </em>
          </Typography>
        )}
        {isValid && <ReactPlayer url={url} controls playing={false} loop={false} width="100%" />}
      </Online>
      <Offline>
        <Typography variant="subtitle1">
          <em>
            {Drupal.t(
              'The lesson contains video, but it is not available offline.',
              {},
              { context: 'ANU LMS' }
            )}
          </em>
        </Typography>
      </Offline>
    </LessonGrid>
  );
};

EmbeddedVideo.propTypes = {
  url: PropTypes.string,
};

export default EmbeddedVideo;
