import React from 'react';
import { Box, Card, Link, Typography, withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

import CardMedia from '@material-ui/core/CardMedia';

import LessonList from '../../01_atoms/LessonList';

const StyledCard = withStyles({
  root: {
    borderRadius: 0,
  },
})(Card);

const StyledCardMediaLink = withStyles({
  root: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})(Link);

const StyledCardMedia = withStyles({
  root: {
    height: '150px',
    position: 'relative',
  },
})(CardMedia);

const StyledCardMediaOverlay = withStyles({
  root: {
    background: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
})(Box);

const StyledCardMediaTypography = withStyles(theme => ({
  root: {
    color: 'white',
    fontWeight: 'bold',
    padding: theme.spacing(2),
    position: 'relative',
    textShadow: '1px 1px 1px black',
  },
}))(Typography);

const StyledTypography = withStyles(theme => ({
  root: {
    fontSize: '0.75em',
    fontWeight: 'bold',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.875em',
      paddingBottom: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
    },
  },
}))(Typography);

const LessonSidebar = ({ t, module }) => (
  <Box>
    <StyledCard>
      <StyledCardMediaLink href={module.path}>
        <StyledCardMedia image={module.image.url} title={module.title}>
          <StyledCardMediaOverlay/>

          <StyledCardMediaTypography>{module.title}</StyledCardMediaTypography>
        </StyledCardMedia>
      </StyledCardMediaLink>
    </StyledCard>

    {(module.lessons.length > 0 || module.assessment) && (
      <Box>
        <StyledTypography>{t('Module content')}</StyledTypography>

        <LessonList
          lessons={module.lessons}
          assessment={module.assessment}
          fontSize="small"
        />
      </Box>
    )}
  </Box>
);

export default withTranslation()(LessonSidebar);
