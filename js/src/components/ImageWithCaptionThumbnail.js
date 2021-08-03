import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { styled, withStyles } from '@material-ui/core';
import LessonGrid from '@anu/components/LessonGrid';

const StyledImg = styled('img')({
  width: '100%',
  display: 'block',
});

const StyledTypography = withStyles((theme) => ({
  root: {
    '& > p': {
      marginBottom: theme.spacing(4),
    },
    '& > p:first-child': {
      marginTop: 0,
    },
    '& > p:last-child': {
      marginBottom: 0,
    },
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

export default ImageWithCaptionThumbnail;
