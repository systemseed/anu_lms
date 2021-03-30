import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Container, Grid, Typography, withStyles } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import PageContainer from '../../01_atoms/PageContainer';
import CourseListItem from '../../02_molecules/CourseListItem';
import Accented from '../../06_hocs/Accented';

import { getCoursesSettings } from '../../../utils/settings';

const StyledGridContainer = withStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(4),
    },
  },
}))(Grid);

const StyledCoursesDescription = withStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(4),
    },
  },
}))(Typography);

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
    const categories = filteredCategories.sort((cat1, cat2) => {
      if (cat1.weight > cat2.weight) {
        return 1;
      }
      if (cat2.weight > cat1.weight) {
        return -1;
      }
      return 0;
    });
    const allCoursesHaveCategories = nodes.every(node => node.categories.length > 0);

    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box mt={4}>
            <Typography variant="h1">{pageSettings.pageTitle}</Typography>
          </Box>

          {allCoursesHaveCategories && (
            <div style={{ marginBottom: theme.spacing(5) }}>
              {[{ id: 'all', name: pageSettings.filterAllCoursesLabel }]
                .concat(categories)
                .map(category => (
                  <Chip
                    key={category.id}
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

          {allCoursesHaveCategories ? (
            categories.map(
              category =>
                (activeCategory === 'all' || activeCategory === category.id) && (
                  <div key={category.id} style={{ marginBottom: 100 }}>
                    <Accented>
                      <Typography variant="h4" component="h2">
                        {category.name}
                      </Typography>
                    </Accented>

                    <StyledGridContainer container spacing={4}>
                      {nodes.map(
                        node =>
                          node.categories.find(filterCat => category.id === filterCat.id) && (
                            <Fragment key={node.id}>
                              <CourseListItem node={node} category={category} />
                            </Fragment>
                          )
                      )}
                    </StyledGridContainer>
                  </div>
                )
            )
          ) : (
            <StyledGridContainer container spacing={4}>
              {nodes.map(node => (
                <Fragment key={node.id}>
                  <CourseListItem node={node} />
                </Fragment>
              ))}
            </StyledGridContainer>
          )}
        </Container>
      </PageContainer>
    );
  }
}

CourseList.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  settings: PropTypes.shape().isRequired,
  theme: PropTypes.shape().isRequired,
};

export default withTheme(CourseList);
