import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import { highlightText } from '@anu/utilities/searchHighlighter';

const useStyles = makeStyles((theme) => ({
  borderedImage: {
    display: 'block',
    width: '100%',
    objectFit: 'cover',
    [theme.breakpoints.up('sm')]: {
      borderRadius: 8,
    },
  },
}));

const ImageWithCaption = ({ image, caption }) => {
  const classes = useStyles();

  return (
    <LessonGrid>
      <img src={image.url} alt={caption || ''} className={classes.borderedImage} />
      {caption && (
        <Box mt={1}>
          <Typography variant="caption">{highlightText(caption)}</Typography>
        </Box>
      )}
    </LessonGrid>
  );
};

ImageWithCaption.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
  }),
  caption: PropTypes.string,
};

export default ImageWithCaption;
