import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Chip,
  Container,
  Grid,
  Typography,
  withStyles,
  styled,
} from '@material-ui/core';

import PageContainer from '../../01_atoms/PageContainer';

import { getLangCodePrefix } from '../../../utils/settings';

const StyledGridContainer = withStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  },
}))(Grid);

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

const StyledCoursesDescription = withStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(2),
    },
  },
}))(Typography);

const StyledLink = styled('a')({
  textDecoration: 'none',
  color: 'black',
});

class CourseList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCategory: 'all',
    };
  }

  handleCategoryClick = category => this.setState({ activeCategory: category.id });

  render() {
    const { nodes, settings } = this.props;
    const { activeCategory } = this.state;
    const allCategories = nodes.map(node => node.categories).flat();
    // Keep unique categories only.
    const categories = allCategories.filter(
      (cat1, i, array) => array.findIndex(cat2 => cat1.id === cat2.id) === i
    );

    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box mt={4}>
            <Typography variant="h1" style={{ marginBottom: '0.6em' }}>
              Courses
            </Typography>
          </Box>

          {/*
          <div>
            {[{ id: 'all', name: 'All courses' }].concat(categories).map(category => (
              <Chip
                label={category.name}
                color={category.id === activeCategory ? 'secondary' : 'default'}
                onClick={() => this.handleCategoryClick(category)}
                clickable={category.id !== activeCategory}
                variant={category.id === activeCategory ? 'default' : 'outlined'}
              />
            ))}
          </div>
          */}

          {settings.courses_description && (
            <StyledCoursesDescription
              variant="body2"
              color="textSecondary"
              component="div"
              dangerouslySetInnerHTML={{ __html: settings.courses_description }}
            />
          )}

          <StyledGridContainer container spacing={4}>
            {nodes.map(node => (
              <Grid item md={4} sm={6} xs={12} key={node.id}>
                <StyledCard>
                  <StyledCardActionArea component="div">
                    <StyledLink href={`${getLangCodePrefix()}${node.path}`}>
                      <StyledCardMedia image={node.image.url} title={node.title} />

                      <CardContent>
                        <Typography gutterBottom variant="h4" component="h2">
                          {node.title}
                        </Typography>

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
  }
}

export default CourseList;
