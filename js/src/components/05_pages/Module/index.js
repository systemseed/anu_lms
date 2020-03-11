import React from 'react';
import { Container, Box, Grid, Typography, Button, withStyles, styled } from '@material-ui/core';
import { withWidth, isWidthUp } from '@material-ui/core';
import LessonList from '../../01_atoms/LessonList';
import BackButton from '../../01_atoms/BackButton'

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

const Image = styled('img')({
  width: '100%',
});

const Module = ({ node, width }) => {
  const firstLesson = node.lessons.length > 0 ? node.lessons[0] : null;

  return (
    <Container maxWidth="lg">

      {node.course &&
      <BackButton title="Back to modules" href={node.course.path}/>
      }

      <StyledGridContainer container spacing={2} alignItems="center">
        <Grid item md={4}>
          {node.title &&
          <Typography component="h2" variant="h2">{node.title}</Typography>
          }
          {firstLesson && firstLesson.path && isWidthUp('sm', width) &&
          <Button href={firstLesson.path} variant="contained" color="primary" size="large">
            Start Module
          </Button>
          }
        </Grid>
        <Grid item md={2}/>
        <Grid item md={6}>
          {node.image && node.image.url &&
          <Image src={node.image.url} alt={node.title}/>
          }
          {firstLesson && firstLesson.path && !isWidthUp('sm', width) &&
          <Button href={firstLesson.path} variant="contained" color="primary" size="large" fullWidth>
            Start Module
          </Button>
          }
        </Grid>
      </StyledGridContainer>

      <StyledGridContainer container spacing={2}>
        <Grid item md={4}>
          {node.lessons && node.lessons.length > 0 &&
          <>
            <Typography component="h4" variant="h4">Module content</Typography>
            <LessonList lessons={node.lessons} assessment={node.assessment} />
          </>
          }
        </Grid>
        <Grid item md={2}/>
        <Grid item md={6}>
          {node.description &&
          <>
            <Typography component="h4" variant="h4">Overview</Typography>
            <Box dangerouslySetInnerHTML={{__html: node.description}}/>
          </>
          }
        </Grid>
      </StyledGridContainer>

    </Container>
  );
}

export default withWidth()(Module);
