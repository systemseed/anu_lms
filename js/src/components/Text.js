import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';

import LessonGrid from '@anu/components/LessonGrid';

const StyledBox = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}))(Box);

const StyledTypography = withStyles((theme) => ({
  root: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& a': {
      fontWeight: 700,
    },
    '& > p': {
      marginBottom: theme.spacing(2),
    },
    '& > p:first-child': {
      marginTop: 0,
    },
    '& > p:last-child': {
      marginBottom: 0,
    },
    '& ul': {
      paddingLeft: theme.spacing(4.5),
    },
    '& ul > li': {
      marginBottom: theme.spacing(2),
    },
    '& ul > li::marker': {
      fontSize: '1.1875rem',
      color: theme.palette.primary.main,
    },
    '& ol': {
      paddingLeft: theme.spacing(3.75),
    },
    '& ol > li': {
      marginBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
    '& ol > li::marker': {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
  },
}))(Typography);

const Text = ({ value }) => (
  <StyledBox>
    <LessonGrid>
      <StyledTypography component="div" dangerouslySetInnerHTML={{ __html: value }} />
    </LessonGrid>
  </StyledBox>
);

Text.propTypes = {
  value: PropTypes.node,
};

export default Text;
