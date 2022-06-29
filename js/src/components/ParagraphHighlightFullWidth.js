import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import { textStyle } from '../theme';
import { highlightText } from '@anu/utilities/searchHighlighter';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: (props) => theme.palette.paragraphHighlight[props.color],
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
  heading: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '1.25rem',
  },
  text: {
    // Common styles for elements with an enabled rich text editor.
    ...textStyle(theme),
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.125rem',
      lineHeight: '2.063rem',
    },
    '& ul > li::marker': {
      color: theme.palette.common.black,
    },
    '& ol > li::marker': {
      color: theme.palette.common.black,
    },
  },
}));

const ParagraphHighlightFullWidth = ({ title, text, color }) => {
  const classes = useStyles({ color: color });

  return (
    <Box className={classes.container}>
      <LessonGrid>
        {title && (
          <Box mb={2}>
            <Typography className={classes.heading} data-test="anu-lms-highlight-heading">
              {highlightText(title)}
            </Typography>
          </Box>
        )}

        {text && (
          <Typography
            component="div"
            className={classes.text}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
      </LessonGrid>
    </Box>
  );
};

ParagraphHighlightFullWidth.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['yellow', 'blue', 'green', 'purple']),
};

ParagraphHighlightFullWidth.defaultProps = {
  color: 'yellow',
};

export default ParagraphHighlightFullWidth;
