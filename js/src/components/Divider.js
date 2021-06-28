import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';

const useStyles = makeStyles((theme) => ({
  divider: ({ isNumeric }) => ({
    position: isNumeric ? 'absolute' : 'static',
    width: '100%',
    height: isNumeric ? '2px' : '1px',
    background: isNumeric ? theme.palette.primary.main : theme.palette.grey[300],
    top: isNumeric ? theme.spacing(3) : 0,
  }),
  numberWrapper: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    background: theme.palette.primary.main,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: '0 auto',
  },
}));

const Divider = ({ type, counter }) => {
  const theme = useTheme();
  const isNumeric = type === 'numeric';
  const classes = useStyles({ isNumeric });

  return (
    <LessonGrid>
      <Box position="relative">
        <Box className={classes.divider} />

        {isNumeric && counter > 0 && (
          <Box className={classes.numberWrapper}>
            <Typography variant="subtitle1" style={{ color: theme.palette.primary.contrastText }}>
              {counter}
            </Typography>
          </Box>
        )}
      </Box>
    </LessonGrid>
  );
};

Divider.propTypes = {
  type: PropTypes.string.isRequired,
  counter: PropTypes.number.isRequired,
};

export default Divider;
