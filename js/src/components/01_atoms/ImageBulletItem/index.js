import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { styled, withStyles } from '@material-ui/core';

const StyledBox = withStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: ({ size }) => parseInt(size, 10) === 50 ? theme.spacing(3) : 0,
  },
}))(Box);

const StyledTypography = withStyles(theme => ({
  root: {
    '& p': {
      marginTop: 0,
    },
  },
}))(Typography);

const ImageContainerSmall = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(2),
  },
}))(Box);

const ImageContainerLarge = withStyles(theme => ({
  root: {
    marginRight: theme.spacing(3),
  },
}))(Box);

const ImageBulletItem = ({image, size, text}) => (
  <StyledBox size={size}>
    {parseInt(size, 10) === 20 ? (
      <ImageContainerSmall>
        <img src={image.url} alt={image.alt} height={size} width={size} />
      </ImageContainerSmall>
    ) : (
      <ImageContainerLarge>
        <img src={image.url} alt={image.alt} height={size} width={size} />
      </ImageContainerLarge>
    )}

    <StyledTypography component="div" dangerouslySetInnerHTML={{ __html: text }} />
  </StyledBox>
);

ImageBulletItem.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }).isRequired,
  size: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default ImageBulletItem;
