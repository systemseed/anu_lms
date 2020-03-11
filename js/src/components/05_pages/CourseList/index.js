import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Container,
  Grid,
  Typography,
  withStyles,
  styled
} from '@material-ui/core';
import BackButton from '../../01_atoms/BackButton'
import { COURSE_LIST_PATH } from '../../../utils/constants'

const StyledGridContainer = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    }
  }
}))(Grid);

const StyledCard = withStyles(theme => ({
  root: {
    height: '100%',
  }
}))(Card);

const StyledCardActionArea = withStyles(theme => ({
  root: {
    height: '100%',
  }
}))(CardActionArea);

const StyledCardMedia = withStyles({
  root: {
    height: '250px',
  }
})(CardMedia);

const StyledLink = styled('a')({
  textDecoration: 'none',
  color: 'black',
});

const CourseList = ({ nodes }) => (
  <Container maxWidth="lg">

    <StyledGridContainer container spacing={4}>
    {nodes.map(node => (
      <Grid item md={4} sm={6} xs={12} key={node.id}>
        <StyledCard>
          <StyledCardActionArea component="div">
            <StyledLink href={node.path}>
              <StyledCardMedia
                image={node.image.url}
                title={node.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h4" component="h2">{node.title}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: node.description }}
                />
              </CardContent>
            </StyledLink>
          </StyledCardActionArea>
        </StyledCard>
      </Grid>
    ))}
    </StyledGridContainer>
  </Container>
);

export default CourseList;
