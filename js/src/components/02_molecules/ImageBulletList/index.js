import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';

import ImageBulletItem from '../../01_atoms/ImageBulletItem';
import LessonGrid from '../../06_hocs/LessonGrid';
import Highlighted from '../../06_hocs/Highlighted'

const StyledBox = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(4),
  }
}))(Box);

const StyledHeading = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  }
}))(Typography);

const ImageBulletListContents = ({title, items}) => (
  <LessonGrid>
    {title && <StyledHeading variant="h5" component="h5">{title}</StyledHeading>}

    {items.map(({id, image, size, text}) => (
      <ImageBulletItem
        key={id}
        image={image}
        size={size}
        text={text}
      />
    ))}
  </LessonGrid>
);

const ImageBulletList = ({title, isHighlight, items}) => (
  <StyledBox>
    {isHighlight ? (
      <Highlighted>
        <ImageBulletListContents
          title={title}
          items={items}
        />
      </Highlighted>
    ) : (
      <ImageBulletListContents
        title={title}
        items={items}
      />
    )}
  </StyledBox>
);

ImageBulletList.propTypes = {
  title: PropTypes.string,
  isHighlight: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape()),
};

export default ImageBulletList;
