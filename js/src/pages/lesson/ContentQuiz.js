import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import ParagraphsWithQuiz from '@anu/components/ParagraphsWithQuiz';
import { quizPropTypes } from '@anu/utilities/transform.quiz';
import ContentNavigation from '@anu/components/ContentNavigation';
import Hidden from '@material-ui/core/Hidden';
import { lessonPropTypes } from '@anu/utilities/transform.lesson';

const ContentQuiz = ({ quiz, nextLesson }) => {
  const [isSubmitted, submitQuiz] = useState(!!quiz.isSubmitted);
  return (
    <Box mt={[2, 2, 0]}>
      <LessonGrid>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Hidden smDown>
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
          currentIndex={0}
          isEnabled={isSubmitted}
        />
      )}
    </Box>
  );
};

ContentQuiz.propTypes = {
  quiz: quizPropTypes,
  nextLesson: lessonPropTypes,
};

export default ContentQuiz;
