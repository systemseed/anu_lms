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
import LockIcon from '@material-ui/icons/Lock';
import TrophyIcon from '@material-ui/icons/EmojiEvents';
import Avatar from '@material-ui/core/Avatar';
import DownloadCoursePopup from '@anu/components/DownloadCoursePopup';
import CoursesSectionEmpty from '@anu/pages/courses/SectionEmpty';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { getPwaSettings } from '@anu/utilities/settings';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    '&.locked': {
      filter: 'opacity(40%)',
    },
    marginBottom: 25,
  },
  card: {
    border: '1px solid ' + theme.palette.grey[300],
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&.locked': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  content: {
    paddingBottom: 0,
  },
  preTitle: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&.completed': {
      color: theme.palette.accent2.main,
    },
  },
  title: {
    '&.locked': {
      color: theme.palette.grey[400],
    },
  },
  description: {
    '&.locked': {
      color: theme.palette.grey[400],
    },
  },
  progress: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    height: 12,
    width: '70%',
    flexGrow: 2,
    borderRadius: 5,
    backgroundColor: theme.palette.grey[300],
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: theme.palette.accent2.main,
    },
  },
  lockIcon: {
    color: theme.palette.grey[400],
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 'auto',
  },
  trophyIcon: {
    fontSize: 25,
  },
  completed: {
    backgroundColor: theme.palette.accent2.main,
    height: 50,
    width: 50,
    marginLeft: theme.spacing(2),
    marginTop: -50,
    border: '1px solid white',
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
          <Card elevation={0} className={`${classes.card} ${course.locked && 'locked'}`}>
            <CardActionArea
              disabled={!course.first_lesson_url || course.locked}
              component="a"
              href={course.first_lesson_url}
              style={{ flexGrow: 1 }}
            >
              {course.image && course.image.url && (
                <CardMedia
                  className={`${classes.media} ${course.locked && 'locked'}`}
                  image={course.image.url}
                  title={course.title}
                  alt={course.image.alt}
                />
              )}

              {course.progress_percent === 100 && (
                <Avatar className={classes.completed}>
                  <TrophyIcon className={classes.trophyIcon} />
                </Avatar>
              )}
              <CardContent className={classes.content}>
                <Box mb={2} display="flex" flexWrap="wrap">
                  <Typography
                    variant="overline"
                    className={`${classes.preTitle} ${
                      course.progress_percent === 100 && 'completed'
                    }`}
                  >
                    {course.progress_percent === 100
                      ? Drupal.t('Completed course', {}, { context: 'ANU LMS' })
                      : Drupal.t('Course', {}, { context: 'ANU LMS' })}
                  </Typography>
                  {course.progress &&
                    course.progress_percent > 0 &&
                    course.progress_percent < 100 && (
                      <LinearProgress
                        className={classes.progress}
                        variant="determinate"
                        value={course.progress_percent}
                      />
                    )}
                  {course.locked && <LockIcon className={classes.lockIcon} />}
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  className={`${classes.title} ${course.locked && 'locked'}`}
                >
                  {course.title}
                </Typography>

                <Box mt={[0, 2]}>
                  <Typography
                    variant="body2"
                    component="div"
                    className={`${classes.description} ${course.locked && 'locked'}`}
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </Box>
              </CardContent>
            </CardActionArea>

            {course && getPwaSettings() && (
              <CardActions>
                <DownloadCoursePopup course={course} showButton={true} />
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
