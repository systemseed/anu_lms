import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import LessonGrid from '@anu/components/LessonGrid';
import makeStyles from '@material-ui/core/styles/makeStyles';

const StyledBox = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}))(Box);

const useStyles = makeStyles((theme) => ({
  divider: {
    height: '1px',
    background: theme.palette.grey[300],
    top: theme.spacing(3),
  },
}));

const StyledTypography = withStyles((theme) => ({
  root: {
    '& a': {
      fontWeight: 700,
    },
    '& ul, & ol': {
      paddingLeft: theme.spacing(2),
    },
  },
  body2: {
    color: theme.palette.grey[400],
    fontSize: '0.875rem',
  },
}))(Typography);

const Footnotes = ({ value }) => {
  const classes = useStyles();
  return (
    <StyledBox>
      <LessonGrid>
        <Box className={classes.divider} />
        <StyledTypography
          variant="body2"
          component="div"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </LessonGrid>
    </StyledBox>
  );
};

Footnotes.propTypes = {
  value: PropTypes.node,
};

export default Footnotes;
