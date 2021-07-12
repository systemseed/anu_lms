import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Highlighted from '@anu/components/Highlighted';
import LessonGrid from '@anu/components/LessonGrid';

const useStyles = makeStyles((theme) => ({
  text: {
    fontWeight: theme.typography.fontWeightMedium,
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

const TextHighlighted = ({ title, text, color }) => {
  const classes = useStyles();

  return (
    <Highlighted color={color === '' ? 'yellow' : color}>
      <LessonGrid>
        {title && (
          <Box mb={2}>
            <Typography variant="subtitle1">{title}</Typography>
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
    </Highlighted>
  );
};

TextHighlighted.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
};

TextHighlighted.defaultProps = {
  title: null,
  color: '',
};

export default TextHighlighted;
