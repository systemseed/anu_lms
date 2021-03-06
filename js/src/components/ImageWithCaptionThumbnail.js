import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core';
import LessonGrid from '@anu/components/LessonGrid';

const StyledImg = styled('img')({
  width: '100%',
  display: 'block',
});

const ImageWithCaptionThumbnail = ({ image, caption }) => (
  <LessonGrid>
    <Grid container spacing={4}>
      <Grid item md={4} xs={12}>
        <StyledImg src={image.url} alt={caption} />
      </Grid>

      <Grid item md={8} xs={12}>
        <Typography>{caption}</Typography>
      </Grid>
    </Grid>
  </LessonGrid>
);

export default ImageWithCaptionThumbnail;
