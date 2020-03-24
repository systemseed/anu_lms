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
import PageContainer from '../../01_atoms/PageContainer';

const StyledGridContainer = withStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
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
  <PageContainer>
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
  </PageContainer>
);

export default CourseList;
