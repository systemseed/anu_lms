import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import Box from '@material-ui/core/Box';

const useBodyStyles = makeStyles((theme) => ({
  text: {
    boxDecorationBreak: 'clone',
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '5px',
    paddingRight: '5px',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '1.5rem',
    lineHeight: '2.2rem',
    backgroundColor: (props) => theme.palette.paragraphHighlight[props.color],
  },
}));
const useContainerStyles = makeStyles(() => ({
  root: {
    maxWidth: '67%',
  },
}));

const ParagraphHighlightMarker = ({ text, color }) => {
  const bodyClasses = useBodyStyles({ color: color });
  const containerClasses = useContainerStyles();

  return (
    <LessonGrid>
      <Box className={containerClasses.root}>
        <Typography component="marker" className={bodyClasses.text}>
          {text}
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
