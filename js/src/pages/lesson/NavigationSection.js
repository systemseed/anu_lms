import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LessonNavigationItems from '@anu/pages/lesson/NavigationItems';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const useStyles = makeStyles((theme) => ({
  accordionRoot: ({ hasCurrentContent }) => ({
    margin: 0 + ' !important',
    borderTop: '6px solid ' + theme.palette.common.white,
    '&:first-child': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    '&:last-child': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderBottom: '6px solid ' + theme.palette.common.white,
    },
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      paddingTop: '5px', // Compensate more thin top border width.
      borderTop: '1px solid ' + theme.palette.grey[300],
      borderRight: '1px solid ' + theme.palette.grey[300],
      borderBottom: hasCurrentContent
        ? '4px solid ' + theme.palette.common.black
        : '1px solid ' + theme.palette.grey[300],
    },
  }),
  accordionSummaryRoot: {
    flexDirection: 'row-reverse',
    background: theme.palette.grey[200],
    transition: '.3s background-color',
    '&.Mui-expanded': {
      minHeight: theme.spacing(6),
      background: theme.palette.common.white,
    },
    '&:hover .MuiTypography-root': {
      color: theme.palette.primary.main,
    },
    '&:hover .MuiSvgIcon-root path': {
      fill: theme.palette.primary.main,
    },
  },
  accordionSummaryContent: {
    margin: theme.spacing(2, 0),
    '&.Mui-expanded': {
      margin: theme.spacing(2, 0, 1),
    },
  },
  accordionSummaryExpandIcon: {
    marginLeft: theme.spacing(-1.5),
    marginRight: 0,
    padding: theme.spacing(1),
    color: theme.palette.common.black,
  },
  accordionDetailsRoot: {
    display: 'block',
    padding: theme.spacing(0, 0, 0, 5.5),
  },
}));

const LessonNavigationSection = ({ module, lessons, currentLesson, quiz }) => {
  const content = quiz ? [...lessons, quiz] : lessons;
  const hasCurrentContent = content.filter((lesson) => lesson.id === currentLesson.id).length > 0;
  const classes = useStyles({ hasCurrentContent });

  return (
    <Accordion
      elevation={0}
      classes={{ root: classes.accordionRoot }}
      defaultExpanded={hasCurrentContent}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: classes.accordionSummaryRoot,
          content: classes.accordionSummaryContent,
          expandIcon: classes.accordionSummaryExpandIcon,
        }}
      >
        <Typography variant="body1">{module}</Typography>
      </AccordionSummary>

      <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
        <LessonNavigationItems lessons={content} currentLesson={currentLesson} />
      </AccordionDetails>
    </Accordion>
  );
};

LessonNavigationSection.propTypes = {
  module: PropTypes.string,
  lessons: PropTypes.arrayOf(lessonPropTypes),
  currentLesson: lessonPropTypes.isRequired,
};

LessonNavigationSection.defaultProps = {
  module: '',
  lessons: [],
};

export default LessonNavigationSection;
