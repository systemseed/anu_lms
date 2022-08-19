import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import Box from '@material-ui/core/Box';
import { highlightText } from '@anu/utilities/searchHighlighter';

const useStyles = makeStyles((theme) => ({
  text: {
    boxDecorationBreak: 'clone',
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '5px',
    paddingRight: '5px',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '1.5rem',
    lineHeight: '2.3rem',
    backgroundColor: (props) => theme.palette.paragraphHighlight[props.color],
  },
  container: {
    maxWidth: '67%',
  },
}));

const ParagraphHighlightMarker = ({ text, color }) => {
  const classes = useStyles({ color: color });

  return (
    <LessonGrid>
      <Box className={classes.container}>
        <Typography component="span" className={classes.text}>
          {highlightText(text)}
        </Typography>
      </Box>
    </LessonGrid>
  );
};

ParagraphHighlightMarker.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['yellow', 'blue', 'green', 'purple']),
};

ParagraphHighlightMarker.defaultProps = {
  color: 'yellow',
};

export default ParagraphHighlightMarker;
