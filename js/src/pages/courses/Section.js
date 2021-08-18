import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import DownloadCourse from '@anu/components/DownloadCourse';
import CoursesSectionEmpty from '@anu/pages/courses/SectionEmpty';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { getPwaSettings } from '@anu/utilities/settings';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    border: '1px solid ' + theme.palette.grey[300],
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  progress: {
    marginTop: theme.spacing(3),
  },
}));

const CoursesSection = ({ courses }) => {
  const classes = useStyles();

  if (courses.length === 0) {
    return <CoursesSectionEmpty />;
  }

  return (
    <Grid container spacing={4}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course.id}>
          <Card elevation={0} className={classes.card}>
            <CardActionArea
              disabled={!course.first_lesson_url}
              component="a"
              href={course.first_lesson_url}
              style={{ flexGrow: 1 }}
            >
              {course.image && course.image.url && (
                <CardMedia
                  className={classes.media}
                  image={course.image.url}
                  title={course.title}
                  alt={course.image.alt}
                />
              )}

              <CardContent className={classes.content}>
                <Box mb={2}>
                  <Typography variant="overline">
                    {Drupal.t('Course', {}, { context: 'ANU LMS' })}
                  </Typography>
                </Box>

                <Typography variant="h5" component="h3">
                  {course.title}
                </Typography>

                {typeof course.progress !== 'undefined' && (
                  <LinearProgress
                    className={classes.progress}
                    variant="determinate"
                    color="secondary"
                    value={course.progress}
                  />
                )}

                <Box mt={[0, 2]}>
                  <Typography
                    variant="body2"
                    component="div"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </Box>
              </CardContent>
            </CardActionArea>

            {course && getPwaSettings() && (
              <CardActions>
                <DownloadCourse course={course} messagePosition="top" />
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

CoursesSection.propTypes = {
  courses: PropTypes.arrayOf(coursePropTypes),
};

CoursesSection.defaultProps = {
  courses: [],
};

export default CoursesSection;
