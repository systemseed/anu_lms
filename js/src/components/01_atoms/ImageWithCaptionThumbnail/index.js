import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { styled, withStyles } from '@material-ui/core';
import LessonGrid from '../../06_hocs/LessonGrid';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    }
  }
}))(Box);

const StyledImg = styled('img')({
  width: '100%',
  display: 'block',
});

const StyledTypography = withStyles(theme => ({
  root: {
    color: theme.palette.secondary.main,
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
    }
  }
}))(Typography);

const ImageWithCaptionThumbnail = ({ image, caption }) => (
  <StyledBox>
    <LessonGrid>
      <Grid container>
        <Grid item md={4} xs={12}>
          <StyledImg src={image.url} alt={caption} />
        </Grid>
        <Grid item md={1} xs={false} />
        <Grid item md={7} xs={12}>
          <StyledTypography>{caption}</StyledTypography>
        </Grid>
      </Grid>
    </LessonGrid>
  </StyledBox>
);

export default ImageWithCaptionThumbnail;
