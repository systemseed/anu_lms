import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import LessonGrid from '../../01_atoms/LessonGrid';
import QuizSubmit from '../../01_atoms/QuizSubmit';
import LessonNavigationButton from '../../01_atoms/LessonNavigationButton';
import QuizTextAnswerAssessmentAdapter from '../QuizTextAnswerAssessmentAdapter';
import QuizScaleAssessmentAdapter from '../QuizScaleAssessmentAdapter';
import QuizOptionsAssessmentAdapter from '../QuizOptionsAssessmentAdapter';

import paragraphsMapping from '../../../utils/paragraphsMapping';
import { getLangCodePrefix } from '../../../utils/settings';

const paragraphs = {
  ...paragraphsMapping,
  question_short_answer: QuizTextAnswerAssessmentAdapter,
  question_long_answer: QuizTextAnswerAssessmentAdapter,
  question_scale: QuizScaleAssessmentAdapter,
  question_single_choice: QuizOptionsAssessmentAdapter,
  question_multi_choice: QuizOptionsAssessmentAdapter,
};

class ParagraphsWithAssessments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assessmentData: {},
      correctValues: null,
      correctValuesCount: -1,
      isSubmitting: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(value, paragraphId) {
    this.setState(prevState => ({
      assessmentData: {
        ...prevState.assessmentData,
        [paragraphId]: value,
      }
    }))
  }

  handleSubmit() {
    const { node } = this.props;
    const { assessmentData } = this.state;

    this.setState({
      isSubmitting: true,
      correctValues: null,
    });

    axios
      .get('/session/token')
      .then(({ data }) => {
        axios.defaults.headers.common['X-CSRF-Token'] = data;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios
          .post(`${getLangCodePrefix()}/assessments/assessment`, {
            nid: node.id,
            data: assessmentData,
          })
          .then(({ data: response }) => {
            this.setState({
              correctValues: response.correctAnswers,
              correctValuesCount: response.correctAnswersCount
            });
          })
          .catch(error => {
            console.log(`Could not send quiz data: ${error}`);
          })
          .finally(() => {
            this.setState({ isSubmitting: false });
          });
      });
  }

  render() {
    const { t, items, node } = this.props;
    const { assessmentData, correctValues, correctValuesCount, isSubmitting } = this.state;

    const paragraphsRendered = items.map(paragraph => {
      if (paragraph.bundle in paragraphs) {
        const Component = paragraphs[paragraph.bundle];

        // Non-quiz paragraph - just render it.
        if (!paragraph.bundle.startsWith('question_')) {
          return <Component key={paragraph.id} {...paragraph} />;
        }

        // Quiz paragraph receives some extra props to handle widget's behavior.
        const value = paragraph.aqid in assessmentData ? assessmentData[paragraph.aqid] : null;
        const correctValue = correctValues && paragraph.aqid in correctValues
          ? correctValues[paragraph.aqid]
          : null;

        return (
          <Component
            key={paragraph.id}
            {...paragraph}
            value={value}
            onChange={val => this.handleChange(val, paragraph.aqid)}
            correctValue={correctValue}
            isSubmitting={isSubmitting}
          />
        );
      }
      return null;
    });

    return (
      <>
        {paragraphsRendered}

        <LessonGrid>
          {correctValues && correctValuesCount !== -1 && (
            <Typography variant="h3">
              {t('assessmentScore', {
                correctValuesCount,
                totalValuesCount: Object.keys(correctValues).length,
              })}
            </Typography>
          )}

          {!correctValues && (
            <QuizSubmit onSubmit={this.handleSubmit} isSubmitting={isSubmitting} isQuiz />
          )}

          {node.module && node.module.course && (
            <Box mt={4}>
              <LessonNavigationButton
                href={`${getLangCodePrefix()}${node.module.course.path}`}
                variant={correctValues ? 'contained' : 'outlined'}
              >
                {t('Back to the course')}
              </LessonNavigationButton>
            </Box>
          )}
        </LessonGrid>
      </>
    );
  }
}

export default withTranslation()(ParagraphsWithAssessments);
