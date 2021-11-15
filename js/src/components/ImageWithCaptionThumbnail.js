import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { styled, withStyles } from '@material-ui/core';
import LessonGrid from '@anu/components/LessonGrid';
import { textStyle } from '../theme';
import PropTypes from 'prop-types';

const StyledImg = styled('img')({
  width: '100%',
  display: 'block',
});

const StyledTypography = withStyles((theme) => ({
  root: {
    // Common styles for elements with an enabled rich text editor.
    ...textStyle(theme),
  },
}))(Typography);

const ImageWithCaptionThumbnail = ({ image, caption }) => (
  <LessonGrid>
    <Grid container spacing={4}>
      <Grid item md={4} xs={12}>
        <StyledImg src={image.url} alt={caption} />
      </Grid>

      <Grid item md={8} xs={12}>
        <StyledTypography dangerouslySetInnerHTML={{ __html: caption }} />
      </Grid>
    </Grid>
  </LessonGrid>
);

ImageWithCaptionThumbnail.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }).isRequired,
  caption: PropTypes.string,
};

export default ImageWithCaptionThumbnail;
