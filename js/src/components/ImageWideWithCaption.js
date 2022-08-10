import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { highlightText } from '@anu/utilities/searchHighlighter';

const useStyles = makeStyles((theme) => ({
  wrapper: ({ image }) => ({
    position: 'relative',
    background: 'url(' + image.url + ') no-repeat center center',
    backgroundSize: 'cover',
    height: 200,
    [theme.breakpoints.up('sm')]: {
      height: 320,
    },
    [theme.breakpoints.up('md')]: {
      height: 420,
    },
  }),
  overlay: {
    position: 'absolute',
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
  },
  caption: {
    display: 'block',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    color: theme.palette.common.white,
  },
}));

const ImageWideWithCaption = ({ image, caption }) => {
  const classes = useStyles({ image });

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.overlay}>
        <Typography className={classes.caption} variant="caption">
          {highlightText(caption)}
        </Typography>
      </Box>
    </Box>
  );
};

ImageWideWithCaption.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
  }),
  caption: PropTypes.string,
};

export default ImageWideWithCaption;
