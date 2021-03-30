import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import { styled, withStyles } from '@material-ui/core';

import CourseLabel from '../../01_atoms/CourseLabel';

import { getLangCodePrefix } from '../../../utils/settings';

const StyledCard = withStyles({
  root: {
    height: '100%',
  },
})(Card);

const StyledCardActionArea = withStyles({
  root: {
    height: '100%',
  },
})(CardActionArea);

const StyledCardMedia = withStyles({
  root: {
    height: '250px',
  },
})(CardMedia);

const StyledLink = styled('a')({
  textDecoration: 'none',
  color: 'black',
});

const CourseListItem = ({ node, category }) => (
  <Grid item md={4} sm={6} xs={12}>
    <StyledCard>
      <StyledCardActionArea component="div">
        <StyledLink
          href={`${getLangCodePrefix()}${node.path}${category ? `?category=${category.id}` : ''}`}
        >
          <Box position="relative">
            {node.label && node.label && (
              <Box position="absolute" m={1} style={{ right: 0 }}>
                <CourseLabel name={node.label.name} color={node.label.color} />
              </Box>
            )}

            <StyledCardMedia image={node.image.url} title={node.title} />
          </Box>

          <CardContent>
            <Typography gutterBottom variant="h4">
              {node.title}
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              dangerouslySetInnerHTML={{ __html: node.description }}
            />
          </CardContent>
        </StyledLink>
      </StyledCardActionArea>
    </StyledCard>
  </Grid>
);

CourseListItem.propTypes = {
  node: PropTypes.shape().isRequired,
  category: PropTypes.shape().isRequired,
};

export default CourseListItem;
