import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';

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
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.2rem',
      lineHeight: '2.063rem',
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
  },
}));

const ParagraphHighlightFullWidth = ({ title, text, color }) => {
  const classes = useStyles({ color: color });

  return (
    <Box className={classes.container}>
      <LessonGrid>
        {title && (
          <Box mb={2}>
            <Typography className={classes.heading}>{title}</Typography>
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
