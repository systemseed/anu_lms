import React from 'react';
import Box from '@material-ui/core/Box';
import { styled, withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '../LessonGrid'

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
  }
}))(Typography);

const ImageWithCaption = ({ image, caption }) => (
  <StyledBox>
    <LessonGrid>
      <StyledImg src={image.url} alt={caption} />
      <StyledTypography variant="caption">{caption}</StyledTypography>
    </LessonGrid>
  </StyledBox>
);

export default ImageWithCaption;
