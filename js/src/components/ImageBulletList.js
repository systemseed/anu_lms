import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ImageBulletItem from '@anu/components/ImageBulletItem';
import LessonGrid from '@anu/components/LessonGrid';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useHighlightStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '8px',
    backgroundColor: (props) => theme.palette.paragraphHighlight[props.color],
    padding: theme.spacing(3),
  },
}));

const ImageBulletList = ({ title, items, color }) => {
  const highlightClasses = useHighlightStyles({ color: color });
  const Content = () => (
    <>
      {title && (
        <Box mb={2}>
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
      )}

      {items.map(({ id, image, size, text }) => (
        <ImageBulletItem key={id} image={image} size={size} text={text} />
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
