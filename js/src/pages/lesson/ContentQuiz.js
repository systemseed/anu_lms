import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import LessonGrid from '@anu/components/LessonGrid';
import ParagraphsWithQuiz from '@anu/components/ParagraphsWithQuiz';
import { quizPropTypes } from '@anu/utilities/transform.quiz';
import ContentNavigation from '@anu/components/ContentNavigation';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';
import ContentTopNavigation from '@anu/components/TopContentNavigation';
import { coursePropTypes } from '@anu/utilities/transform.course';

const ContentQuiz = ({ quiz, nextLesson, prevLesson, course }) => {
  const [isSubmitted, submitQuiz] = useState(!!quiz.isSubmitted);
  return (
    <Box>
      <ContentTopNavigation
        isIntro={false}
        sections={[]}
        currentLesson={quiz}
        nextLesson={nextLesson}
        prevLesson={prevLesson}
        currentIndex={0}
        isEnabled={isSubmitted}
        course={course}
      />
      <LessonGrid>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Hidden mdUp>
            <Typography variant="h4" component="h1">
              {quiz.title}
            </Typography>
          </Hidden>
        </Box>
      </LessonGrid>

      <Box my={3}>
        <ParagraphsWithQuiz
          items={quiz.questions}
          correctValuesCount={quiz.correctValuesCount}
          isSubmitted={isSubmitted}
          prevLesson={prevLesson}
          isSingleSubmission={quiz.isSingleSubmission}
          nodeId={quiz.id}
          submitQuiz={submitQuiz}
        />
      </Box>

      {isSubmitted && (
        <ContentNavigation
          isIntro={false}
          sections={[]}
          currentLesson={quiz}
          nextLesson={nextLesson}
          prevLesson={prevLesson}
          currentIndex={0}
          isEnabled={isSubmitted}
          ignorePaddings={true}
          hideButtonsLabelsOnMobile={false}
        />
      )}
    </Box>
  );
};

ContentQuiz.propTypes = {
  quiz: quizPropTypes,
  nextLesson: lessonPropTypes,
  prevLesson: lessonPropTypes,
  course: coursePropTypes,
};

export default ContentQuiz;
