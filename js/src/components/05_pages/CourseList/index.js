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

import { getLangCodePrefix, getCoursesSettings } from '../../../utils/settings';

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
    const pageSettings = getCoursesSettings();
    const allCategories = nodes.map(node => node.categories).flat();
    // Keep unique categories only.
    const filteredCategories = allCategories.filter(
      (cat1, i, array) => array.findIndex(cat2 => cat1.id === cat2.id) === i
    );
    // Sort categories by weight.
    const categories = filteredCategories.sort(
      (cat1, cat2) => (cat1.weight > cat2.weight) ? 1 : ((cat2.weight > cat1.weight) ? -1 : 0)
    );
    const allCoursesHaveCategories = nodes.every(node => node.categories.length > 0);
    const CourseListItem = ({ node, category }) => (
      <Grid item md={4} sm={6} xs={12} key={node.id}>
        <StyledCard>
          <StyledCardActionArea component="div">
            <StyledLink
              href={`${getLangCodePrefix()}${node.path}${
                category ? `?category=${category.id}` : ''
              }`}
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
    );

    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box mt={4}>
            <Typography variant="h1">{pageSettings.pageTitle}</Typography>
          </Box>

          {allCoursesHaveCategories && (
            <div style={{ marginBottom: theme.spacing(5) }}>
              {[{ id: 'all', name: pageSettings.allCoursesLabel }].concat(categories).map(category => (
                <Chip
                  label={category.name}
                  color={category.id === activeCategory ? 'secondary' : 'default'}
                  onClick={() => this.handleCategoryClick(category)}
                  clickable={category.id !== activeCategory}
                  variant={category.id === activeCategory ? 'default' : 'outlined'}
                />
              ))}
            </div>
          )}

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
                      <CourseListItem node={node} category={category} />
                    )
                  ))}
                </StyledGridContainer>
              </div>
            )
          ))) : (
            <StyledGridContainer container spacing={4}>
              {nodes.map(node => (
                <CourseListItem node={node} />
              ))}
            </StyledGridContainer>
          )}
        </Container>
      </PageContainer>
    );
  }
}

export default withTheme(CourseList);
