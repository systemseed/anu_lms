import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const StyledBox = withStyles(() => ({
  root: {
    display: 'flex',
  },
}))(Box);

const StyledTypography = withStyles((theme) => ({
  root: {
    '& > p': {
      marginBottom: theme.spacing(2),
    },
    '& > p:first-child': {
      marginTop: 0,
    },
    '& > p:last-child': {
      marginBottom: 0,
    },
    '& > ul': {
      margin: 0,
    },
  },
}))(Typography);

const ImageContainerSmall = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}))(Box);

const ImageContainerLarge = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
}))(Box);

const ImageBulletItem = ({ image, size, text }) => {
  const Image = () => (
    <img src={image.url} alt={image.alt} height={size} width={size} style={{ maxWidth: 'none' }} />
  );

  return (
    <StyledBox size={size}>
      {parseInt(size, 10) === 20 ? (
        <ImageContainerSmall>
          <Image />
        </ImageContainerSmall>
      ) : (
        <ImageContainerLarge>
          <Image />
        </ImageContainerLarge>
      )}

      <StyledTypography component="div" dangerouslySetInnerHTML={{ __html: text }} />
    </StyledBox>
  );
};

ImageBulletItem.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }).isRequired,
  size: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default ImageBulletItem;
