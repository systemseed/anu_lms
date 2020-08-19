import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  }
}))(Box);

const StyledTypography = withStyles(theme => ({
  root: {
    marginRight: theme.spacing(2),
  }
}))(Typography);

const ImageBulletItem = ({image, size, text}) => (
  <StyledBox display="flex">
    {console.log(image)}
    <img src={image.url} alt={image.alt} height={size} width={size} />

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
