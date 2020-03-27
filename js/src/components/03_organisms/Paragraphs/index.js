import React from 'react';
import QuizTextAnswerStandaloneAdapter from '../../02_molecules/QuizTextAnswerStandaloneAdapter';
import QuizScaleStandaloneAdapter from '../../02_molecules/QuizScaleStandaloneAdapter';
import QuizOptionsStandaloneAdapter from '../../02_molecules/QuizOptionsStandaloneAdapter';
import paragraphsMapping from '../../../utils/paragraphsMapping';

const paragraphs = {
  ...paragraphsMapping,
  question_short_answer: QuizTextAnswerStandaloneAdapter,
  question_long_answer: QuizTextAnswerStandaloneAdapter,
  question_scale: QuizScaleStandaloneAdapter,
  question_single_choice: QuizOptionsStandaloneAdapter,
  question_multi_choice: QuizOptionsStandaloneAdapter,
}

const Paragraphs = ({ items, ...props }) => {
  return items.map(item => {
    if (item.bundle in paragraphs) {
      const Component = paragraphs[item.bundle];
      return <Component key={item.id} {...props} {...item} />;
    }
    return null;
  });
}

export default Paragraphs;
