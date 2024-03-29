import React, { useState } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ContentNavigation from '@anu/components/ContentNavigation';
import LessonGrid from '@anu/components/LessonGrid';
import LoadingIndicator from '@anu/components/LoadingIndicator';
import Paragraphs from '@anu/components/Paragraphs';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';
import ContentTopNavigation from '@anu/components/TopContentNavigation';
import { coursePropTypes } from '@anu/utilities/transform.course';
import {
  highlightText,
  pageHasSearchKeywords,
  getFirstSectionWithHighlightedKeywords,
} from '@anu/utilities/searchHighlighter';

const useStyles = makeStyles((theme) => ({
  lessonGrid: {
    [theme.breakpoints.up('md')]: {
      justifyContent: 'end',
    },
  },
}));

const ContentLesson = ({ lesson, nextLesson, prevLesson, course }) => {
  const [enableNext, setEnableNext] = useState(lesson.sections.map(() => 0));
  const [isChecklistLoading, setChecklistLoading] = useState(true);
  const [checklistLabel, setChecklistLabel] = useState(
    Drupal.t('Loading...', {}, { context: 'ANU LMS' })
  );

  // Get the default section (page) within the lesson to redirect to.
  // If no search keywords present in the URL then it's always the first section,
  // otherwise we find the first section that matches search keywords and
  // switch the user to it.
  const [defaultSection] = useState(() => {
    if (pageHasSearchKeywords) {
      return getFirstSectionWithHighlightedKeywords(lesson.sections) + 1;
    }
    return 1;
  });

  // Mark question as completed on the page.
  const handleQuestionCompletion = (sectionIndex) =>
    setEnableNext({
      ...enableNext,
      [sectionIndex]: enableNext[sectionIndex] + 1,
    });
  const backUrl = `/page-${lesson.sections.length}`;

  const classes = useStyles();

  // Keep the number of the current page to provide
  // this info to ContentTopNavigation component.
  const [currentPage, setCurrentPage] = useState(null);

  return (
    <>
      <HashRouter hashType="noslash">
        <Switch>
          <Redirect exact from="/" to={`/page-${defaultSection}`} />
          <Redirect exact from="/back" to={backUrl} />

          {lesson.sections.map((paragraphs, index) => {
            const hasChecklist = paragraphs.find(
              (paragraph) => paragraph.bundle === 'lesson_checklist'
            );

            const quizCount = paragraphs.filter((paragraph) =>
              paragraph.bundle.startsWith('question_')
            ).length;

            return (
              <Route path={`/page-${index + 1}`} key={index} exact>
                <Box>
                  <ContentTopNavigation
                    sections={lesson.sections}
                    currentLesson={lesson}
                    nextLesson={nextLesson}
                    prevLesson={prevLesson}
                    currentIndex={index}
                    isEnabled={enableNext[index] === quizCount}
                    course={course}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                  <LessonGrid>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      className={classes.lessonGrid}
                    >
                      <Hidden mdUp>
                        <Typography variant="h4">{highlightText(lesson.title)}</Typography>
                      </Hidden>

                      {hasChecklist && (
                        <LoadingIndicator isLoading={isChecklistLoading} label={checklistLabel} />
                      )}
                    </Box>
                  </LessonGrid>

                  <Box my={3}>
                    <Paragraphs
                      items={paragraphs}
                      onQuestionComplete={() => handleQuestionCompletion(index)}
                      checkListState={{
                        isLoading: [isChecklistLoading, setChecklistLoading],
                        label: [checklistLabel, setChecklistLabel],
                      }}
                    />

                    <ContentNavigation
                      sections={lesson.sections}
                      currentLesson={lesson}
                      nextLesson={nextLesson}
                      prevLesson={prevLesson}
                      currentIndex={index}
                      isEnabled={enableNext[index] === quizCount}
                      ignorePaddings={true}
                      hideButtonsLabelsOnMobile={false}
                    />
                  </Box>
                </Box>
              </Route>
            );
          })}
        </Switch>
      </HashRouter>
    </>
  );
};

ContentLesson.propTypes = {
  lesson: lessonPropTypes.isRequired,
  nextLesson: lessonPropTypes,
  prevLesson: lessonPropTypes,
  course: coursePropTypes,
};

ContentLesson.defaultProps = {
  nextLesson: null,
  prevLesson: null,
};

export default ContentLesson;
