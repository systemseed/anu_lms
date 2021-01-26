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
import { withTheme } from '@material-ui/core/styles';

import CourseLabel from '../../01_atoms/CourseLabel';
import PageContainer from '../../01_atoms/PageContainer';
import Accented from '../../06_hocs/Accented';

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

class CourseList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: new URL(window.location),
      activeCategory: 'all',
    };
  }

  componentDidMount() {
    this.handleURLChange();
  }

  componentDidUpdate() {
    this.handleURLChange();
  }

  handleURLChange = () => {
    const { activeCategory, url } = this.state;

    if (url.searchParams.has('category')) {
      url.searchParams.set('category', activeCategory);
    } else {
      url.searchParams.append('category', activeCategory);
    }

    window.history.pushState(null, '', url.href);
  };

  handleCategoryClick = category => this.setState({ activeCategory: category.id });

  render() {
    const { nodes, settings, theme } = this.props;
    const { activeCategory } = this.state;
    const allCategories = nodes.map(node => node.categories).flat();
    // Keep unique categories only.
    const categories = allCategories.filter(
      (cat1, i, array) => array.findIndex(cat2 => cat1.id === cat2.id) === i
    );
    const allCoursesHaveCategories = nodes.every(node => {
      console.log(node.categories);
      return node.categories;
    });

    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box mt={4}>
            <Typography variant="h1">Courses</Typography>
          </Box>

          <div style={{ marginBottom: theme.spacing(5) }}>
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

          {settings.courses_description && (
            <StyledCoursesDescription
              variant="body2"
              color="textSecondary"
              component="div"
              dangerouslySetInnerHTML={{ __html: settings.courses_description }}
            />
          )}

          {allCoursesHaveCategories ? (categories.map(category => (
            (activeCategory === 'all' || activeCategory === category.id) && (
              <div style={{ marginBottom: 100 }}>
                <Accented>
                  <Typography variant="h4" component="h2">
                    {category.name}
                  </Typography>
                </Accented>

                <StyledGridContainer container spacing={4}>
                  {nodes.map(node => (
                    node.categories.find(filterCat => category.id === filterCat.id) && (
                      <Grid item md={4} sm={6} xs={12} key={node.id}>
                        <StyledCard>
                          <StyledCardActionArea component="div">
                            <StyledLink
                              href={`${getLangCodePrefix()}${node.path}?category=${category.id}`}
                            >
                              <Box position="relative">
                                <Box position="absolute" m={1} style={{ right: 0 }}>
                                  <CourseLabel {...node.label} />
                                </Box>

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
                    )
                  ))}
                </StyledGridContainer>
              </div>
            )
          ))) : (
            <StyledGridContainer container spacing={4}>
              {nodes.map(node => (
                <Grid item md={4} sm={6} xs={12} key={node.id}>
                  <StyledCard>
                    <StyledCardActionArea component="div">
                      <StyledLink
                        href={`${getLangCodePrefix()}${node.path}?category=${category.id}`}
                      >
                        <Box position="relative">
                          <Box position="absolute" m={1} style={{ right: 0 }}>
                            <CourseLabel {...node.label} />
                          </Box>

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
              ))}
            </StyledGridContainer>
          )}
        </Container>
      </PageContainer>
    );
  }
}

export default withTheme(CourseList);
