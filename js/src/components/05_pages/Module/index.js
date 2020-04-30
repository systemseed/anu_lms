import React from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  withStyles,
  styled,
  withWidth,
  isWidthUp,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';

import LessonList from '../../01_atoms/LessonList';
import BackButton from '../../01_atoms/BackButton';
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

const Image = styled('img')({
  maxWidth: '100%',
  maxHeight: '250px',
  display: 'block',
  margin: '0 auto',
  marginBottom: '16px',
});

const Module = ({ t, node, width }) => {
  const firstLesson = node.lessons.length > 0 ? node.lessons[0] : null;

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <StyledGridContainer container spacing={2} alignItems="center">
          <Grid item md={4}>
            {node.course &&
              <BackButton
                title={t('Back to Modules')}
                href={`${getLangCodePrefix()}${node.course.path}`}
              />
            }

            {node.title && (
              <Typography component="h2" variant="h2">
                {node.title}
              </Typography>
            )}

            {firstLesson && firstLesson.path && isWidthUp('sm', width) && (
              <Button
                href={`${getLangCodePrefix()}${firstLesson.path}`}
                variant="contained"
                color="primary"
                size="large"
              >
                {t('Start Module')}
              </Button>
            )}
          </Grid>

          <Grid item md={2} />

          <Grid item md={6}>
            {node.image && node.image.url && (
              <Image src={node.image.url} alt={node.title} />
            )}

            {firstLesson && firstLesson.path && !isWidthUp('sm', width) && (
              <Button
                href={`${getLangCodePrefix()}${firstLesson.path}`}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                {t('Start Module')}
              </Button>
            )}
          </Grid>
        </StyledGridContainer>

        <StyledGridContainer container spacing={2}>
          <Grid item md={4} xs={12}>
            {(node.lessons.length > 0 || node.assessment) && (
              <>
                <Typography component="h4" variant="h4">
                  {t('Module content')}
                </Typography>

                <LessonList lessons={node.lessons} assessment={node.assessment} />
              </>
            )}
          </Grid>

          <Grid item md={2} xs={false} />

          <Grid item md={6} xs={12}>
            {node.description && (
              <>
                <Typography component="h4" variant="h4">
                  {t('Overview')}
                </Typography>

                <Box dangerouslySetInnerHTML={{ __html: node.description }} />
              </>
            )}
          </Grid>
        </StyledGridContainer>
      </Container>
    </PageContainer>
  );
};

export default withWidth()(withTranslation()(Module));
