import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import LessonGrid from '../../06_hocs/LessonGrid';

const useStyles = makeStyles(theme => ({
  wrapper: ({ image }) => ({
    background: 'url(' + image.url + ') no-repeat center center',
    backgroundSize: 'cover',
    position: 'relative',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(8),
    }
  }),
  container: {
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      minHeight: '400px',
    }
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    background: 'rgba(0, 0, 0, 0.3)',
  },
  caption: {
    paddingBottom: theme.spacing(2),
    display: 'block',
    color: 'white',
    marginTop: 'auto'
  }
}));

const ImageWideWithCaption = ({ image, caption }) => {
  const classes = useStyles({ image });
  return (
    <Box className={classes.wrapper}>
      <Box className={classes.overlay}/>
      <LessonGrid>
        <Box className={classes.container}>
          <Typography className={classes.caption} variant="body1" component="div">
            {caption}
          </Typography>
        </Box>
      </LessonGrid>
    </Box>
  );
};

export default ImageWideWithCaption;
