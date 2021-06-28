import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ImageBulletItem from '@anu/components/ImageBulletItem';
import LessonGrid from '@anu/components/LessonGrid';
import Highlighted from '@anu/components/Highlighted';

const ImageBulletListContents = ({ title, items }) => (
  <LessonGrid>
    {title && (
      <Box mb={2}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
    )}

    {items.map(({ id, image, size, text }) => (
      <ImageBulletItem key={id} image={image} size={size} text={text} />
    ))}
  </LessonGrid>
);

const ImageBulletList = ({ title, isHighlight, items }) => (
  <>
    {isHighlight ? (
      <Highlighted>
        <ImageBulletListContents title={title} items={items} />
      </Highlighted>
    ) : (
      <ImageBulletListContents title={title} items={items} />
    )}
  </>
);

ImageBulletList.propTypes = {
  title: PropTypes.string,
  isHighlight: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape()),
};

export default ImageBulletList;
