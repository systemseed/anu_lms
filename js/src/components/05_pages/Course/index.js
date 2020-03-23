import React from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  withStyles,
  styled
} from '@material-ui/core';
import { withWidth, isWidthUp } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Hidden from '@material-ui/core/Hidden';
import BackButton from '../../01_atoms/BackButton';
import { getMenuPathByTitle } from '../../../utils/menu';

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

const StyledCardMedia = withStyles(theme => ({
  root: {
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      height: '350px',
    }
  }
}))(CardMedia);

const StyledShadowBox = withStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    transition: '.3s all',
    zIndex: 5,
    [theme.breakpoints.up('lg')]: {
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.2)',
      }
    }
  }
}))(Box);

const StyledTypography = withStyles(theme => ({
  root: {
    color: 'white',
    textShadow: '1px 1px 1px black',
    position: 'relative',
    zIndex: 10,
  }
}))(Typography);

const Image = styled('img')({
  width: '100%',
});

const Course = ({ node, width }) => {
  let firstLesson = null;
  if (node.modules.length > 0) {
    const module = node.modules.find(module => module.lessons.length > 0);
    if (module) {
      firstLesson = module.lessons[0];
    }
  }

  return (
    <Container maxWidth="lg">

      <BackButton title="Back to courses" href={getMenuPathByTitle('Courses')}/>

      <StyledGridContainer container spacing={isWidthUp('sm', width) ? 2 : 0} alignItems="center">
        <Grid item md={5}>
          {node.title &&
          <Typography component="h2" variant="h2">{node.title}</Typography>
          }
          {node.description &&
          <Box dangerouslySetInnerHTML={{__html: node.description}}/>
          }
          {firstLesson && firstLesson.path &&
          <Box mb={2} mt={2}>
            <Button
              href={firstLesson.path}
              variant="contained"
              color="primary"
              size="large"
              fullWidth={!isWidthUp('sm', width)}
            >
              Start Course
            </Button>
          </Box>
          }
        </Grid>
        <Grid item md={2}/>
        <Grid item md={5}>
          {node.image && node.image.url &&
          <Hidden smDown>
            <Image src={node.image.url} alt={node.title}/>
          </Hidden>
          }
        </Grid>
      </StyledGridContainer>

      <Typography component="h3" variant="h3" align="center">Course modules</Typography>

      <StyledGridContainer container spacing={isWidthUp('sm', width) ? 6 : 2}>
        {node.modules.map(module => (
          <Grid item xs={12} md={6} key={module.id}>
            <Card>
              <CardActionArea onClick={() => window.location.href = module.path}>
                <StyledCardMedia image={module.image.url}>
                  <StyledShadowBox />
                  <StyledTypography component="h2" variant="h1">{module.title}</StyledTypography>
                </StyledCardMedia>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </StyledGridContainer>

    </Container>
  );
}

export default withWidth()(Course);
