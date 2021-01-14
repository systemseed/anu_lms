import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  // Chip,
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
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
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
    paddingBottom: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(4),
    },
  },
}))(Typography);

const StyledLink = styled('a')({
  textDecoration: 'none',
  color: 'black',
});

const AccentTypography = withStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 35,
    borderLeft: `4px solid ${theme.palette.accent}`,
    paddingLeft: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      height: 50,
    },
  },
}))(Typography);

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
            <Typography variant="h1">Courses</Typography>
          </Box>

          {/* TODO in
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

          {categories.map(category => (
            <div style={{ marginBottom: 100 }}>
              <AccentTypography variant="h4" component="h2">
                {category.name}
              </AccentTypography>

              <StyledGridContainer container spacing={4}>
                {nodes.map(node =>
                  node.categories.find(filterCat => category.id === filterCat.id) && (
                    <Grid item md={4} sm={6} xs={12} key={node.id}>
                      <StyledCard>
                        <StyledCardActionArea component="div">
                          <StyledLink href={`${getLangCodePrefix()}${node.path}`}>
                            <StyledCardMedia image={node.image.url} title={node.title} />

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
                  )
                )}
              </StyledGridContainer>
            </div>
          ))}
        </Container>
      </PageContainer>
    );
  }
}

export default CourseList;
