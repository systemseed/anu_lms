import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';

const useHighlightStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: (props) => theme.palette.paragraphHighlight[props.color],
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const useHeadingStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '1.25rem',
  },
}));

const useBodyStyles = makeStyles((theme) => ({
  text: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.5rem',
      lineHeight: '2.063rem',
    },
    '& > p': {
      marginBottom: theme.spacing(4),
    },
    '& > p:first-child': {
      marginTop: 0,
    },
    '& > p:last-child': {
      marginBottom: 0,
    },
  },
}));

const ParagraphHighlightFullWidth = ({ title, text, color }) => {
  const highlightClasses = useHighlightStyles({ color: color });
  const headingClasses = useHeadingStyles();
  const bodyClasses = useBodyStyles();

  return (
    <Box className={highlightClasses.root}>
      <LessonGrid>
        {title && (
          <Box mb={2}>
            <Typography className={headingClasses.heading}>{title}</Typography>
          </Box>
        )}

        {text && (
          <Typography
            component="div"
            className={bodyClasses.text}
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
