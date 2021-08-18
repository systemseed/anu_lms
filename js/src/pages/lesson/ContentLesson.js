import React, { useState } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ContentNavigation from '@anu/components/ContentNavigation';
import LessonGrid from '@anu/components/LessonGrid';
import LoadingIndicator from '@anu/components/LoadingIndicator';
import Paragraphs from '@anu/components/Paragraphs';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const ContentLesson = ({ lesson, nextLesson }) => {
  const [enableNext, setEnableNext] = useState(lesson.sections.map(() => 0));
  const [isChecklistLoading, setChecklistLoading] = useState(true);
  const [checklistLabel, setChecklistLabel] = useState(
    Drupal.t('Loading...', {}, { context: 'ANU LMS' })
  );

  // Mark question as completed on the page.
  const handleQuestionCompletion = (sectionIndex) =>
    setEnableNext({
      ...enableNext,
      [sectionIndex]: enableNext[sectionIndex] + 1,
    });

  return (
    <HashRouter hashType="noslash">
      <Switch>
        <Redirect exact from="/" to="/section-1" />

        {lesson.sections.map((paragraphs, index) => {
          const hasChecklist = paragraphs.find(
            (paragraph) => paragraph.bundle === 'lesson_checklist'
          );

          const quizCount = paragraphs.filter((paragraph) =>
            paragraph.bundle.startsWith('question_')
          ).length;

          return (
            <Route path={`/section-${index + 1}`} key={index} exact>
              <Box mt={[2, 2, 0]}>
                <LessonGrid>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{lesson.title}</Typography>

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
                    currentIndex={index}
                    isEnabled={enableNext[index] === quizCount}
                  />
                </Box>
              </Box>
            </Route>
          );
        })}
      </Switch>
    </HashRouter>
  );
};

ContentLesson.propTypes = {
  lesson: lessonPropTypes.isRequired,
  nextLesson: lessonPropTypes,
};

ContentLesson.defaultProps = {
  nextLesson: null,
};

export default ContentLesson;
