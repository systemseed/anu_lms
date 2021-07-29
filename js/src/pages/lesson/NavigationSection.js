import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import LockIcon from '@material-ui/icons/Lock';
import CheckIcon from '@material-ui/icons/Check';
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
  accordionSummaryRoot: ({ isRestricted }) => ({
    flexDirection: 'row-reverse',
    background: theme.palette.grey[200],
    transition: isRestricted ? '' : '.3s background-color',
    // Border is needed to compensate border-right appearing
    // when accordion is being open, to prevent icons jumping.
    borderRight: '1px solid transparent',
    '&.Mui-expanded': {
      minHeight: theme.spacing(6),
      background: isRestricted ? theme.palette.grey[200] : theme.palette.common.white,
      borderRight: 'none',
    },
    '&:hover .MuiTypography-root': {
      color: theme.palette.primary.main,
    },
    '&:hover .MuiSvgIcon-root path': {
      fill: theme.palette.primary.main,
    },
  }),
  accordionSummaryContent: {
    color: theme.palette.grey[400],
    margin: theme.spacing(2, 0),
    alignItems: 'center',
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
  accordionDetailsRoot: ({ isRestricted }) => ({
    display: 'block',
    padding: theme.spacing(0, 0, 0, 5.5),
    color: theme.palette.black,
    background: isRestricted ? theme.palette.grey[200] : theme.palette.common.white,
  }),
  moduleTitle: ({ isRestricted }) => ({
    color: isRestricted ? theme.palette.grey[400] : theme.palette.black,
  }),
  icon: ({ isRestricted }) => ({
    marginLeft: 'auto',
    color: isRestricted ? theme.palette.grey[400] : theme.palette.success.main,
    width: theme.spacing(2),
    height: theme.spacing(2),
  }),
}));

const LessonNavigationSection = ({ module, lessons, currentLesson, quiz }) => {
  const content = quiz ? [...lessons, quiz] : lessons;
  const hasCurrentContent = content.filter((lesson) => lesson.id === currentLesson.id).length > 0;
  const isCompleted = content.filter((lesson) => lesson.isCompleted).length === content.length;
  const isRestricted = content.find((lesson) => lesson !== undefined).isRestricted;
  const classes = useStyles({ hasCurrentContent, isRestricted });

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
        <Typography variant="body1" className={classes.moduleTitle}>
          {module}
        </Typography>
        {isRestricted && <LockIcon classes={{ root: classes.icon }} />}
        {isCompleted && <CheckIcon classes={{ root: classes.icon }} />}
      </AccordionSummary>

      <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
        <LessonNavigationItems
          lessons={content}
          currentLesson={currentLesson}
          isSectionRestricted={isRestricted}
        />
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
