import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import BackLink from '@anu/components/BackLink';
import { coursePropTypes } from '@anu/utilities/transform.course';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    [theme.breakpoints.up('md')]: {
      borderBottom: '1px solid ' + theme.palette.grey[300],
    },
  },
  label: {
    borderRadius: '4px',
    padding: theme.spacing(1, 1.5),
    background: theme.palette.grey[200],
    ...theme.typography.label2,
  },
  labelGrid: {
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
  },
}));

const LessonHeader = ({ course }) => {
  const classes = useStyles();

  return (
    <Box pt={[2, 3]} pb={[2, 3]} className={classes.wrapper}>
      <Container maxWidth={false}>
        <Box mb={2}>
          <BackLink />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            {course && course.title && (
              <Typography variant="h5" component="h1" style={{ maxWidth: 680 }}>
                {course.title}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={5} container spacing={1} className={classes.labelGrid}>
            {course &&
              course.labels.map((label) => (
                <Grid item key={label}>
                  <Box className={classes.label}>{label}</Box>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

LessonHeader.propTypes = {
  course: coursePropTypes,
};

LessonHeader.defaultProps = {
  course: null,
};

export default LessonHeader;
