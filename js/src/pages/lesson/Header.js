import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import BackLink from '@anu/components/BackLink';
import DownloadCourse from '@anu/components/DownloadCourse';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { getPwaSettings } from '@anu/utilities/settings';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    [theme.breakpoints.up('md')]: {
      borderBottom: '1px solid ' + theme.palette.grey[300],
    },
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    maxWidth: 680,
    paddingRight: theme.spacing(2),
  },
  label: {
    borderRadius: '4px',
    padding: theme.spacing(1, 1.5),
    background: theme.palette.grey[200],
    ...theme.typography.label2,
    marginRight: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
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
          <Grid item xs={12} md={8} className={classes.titleGroup}>
            {course && course.title && (
              <Typography variant="h5" component="h1" className={classes.title}>
                {course.title}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4} className={classes.actions} style={{ padding: 0 }}>
            {course &&
              course.labels.map((label) => (
                <Grid item key={label}>
                  <Box className={classes.label}>{label}</Box>
                </Grid>
              ))}
            {course && getPwaSettings() && (
              <DownloadCourse course={course} messagePosition="left" />
            )}
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
