import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ImageBulletItem from '@anu/components/ImageBulletItem';
import LessonGrid from '@anu/components/LessonGrid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { textStyle } from '../theme';
import { highlightText } from '@anu/utilities/searchHighlighter';

const useHighlightStyles = makeStyles((theme) => ({
  root: {
    // Common styles for elements with an enabled rich text editor.
    ...textStyle(theme),
    borderRadius: '8px',
    backgroundColor: (props) => theme.palette.paragraphHighlight[props.color],
    padding: theme.spacing(3),
    '& ul > li::marker': {
      color: theme.palette.common.black,
    },
    '& ol > li::marker': {
      color: theme.palette.common.black,
    },
  },
}));

const ImageBulletList = ({ title, items, color }) => {
  const highlightClasses = useHighlightStyles({ color: color });
  const Content = () => (
    <>
      {title && (
        <Box mb={2}>
          <Typography variant="subtitle1">{highlightText(title)}</Typography>
        </Box>
      )}

      {items.map(({ id, image, size, align, text }) => (
        <ImageBulletItem key={id} image={image} size={size} align={align} text={text} />
      ))}
    </>
  );

  return (
    <LessonGrid>
      {color ? (
        <Box className={highlightClasses.root}>
          <Content />
        </Box>
      ) : (
        <Content />
      )}
    </LessonGrid>
  );
};

ImageBulletList.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  color: PropTypes.oneOf(['yellow', 'blue', 'green', 'purple']),
};

export default ImageBulletList;
