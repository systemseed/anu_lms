import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import ParagraphsWithQuiz from '@anu/components/ParagraphsWithQuiz';
import { quizPropTypes } from '@anu/utilities/transform.quiz';

const ContentQuiz = ({ quiz }) => (
  <Box mt={[2, 2, 0]}>
    <LessonGrid>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1">
          {quiz.title}
        </Typography>
      </Box>
    </LessonGrid>

    <Box my={3}>
      <ParagraphsWithQuiz
        items={quiz.questions}
        correctValuesCount={quiz.correctValuesCount}
        isSubmitted={quiz.isSubmitted}
        isSingleSubmission={quiz.isSingleSubmission}
        nodeId={quiz.id}
      />
    </Box>
  </Box>
);

ContentQuiz.propTypes = {
  quiz: quizPropTypes,
};

export default ContentQuiz;
