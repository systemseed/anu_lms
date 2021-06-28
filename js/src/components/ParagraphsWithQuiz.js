import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import QuizSubmit from '@anu/components/QuizSubmit';
import paragraphMappings from '@anu/utilities/paragraphMappings';
import Box from '@material-ui/core/Box';

// TODO - should be a pure function component with hooks.
class ParagraphsWithQuiz extends React.Component {
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
    this.setState((prevState) => ({
      assessmentData: {
        ...prevState.assessmentData,
        [paragraphId]: value,
      },
    }));
  }

  async handleSubmit() {
    const { nodeId } = this.props;
    const { assessmentData } = this.state;

    this.setState({
      isSubmitting: true,
      correctValues: null,
    });

    const token = await fetch(`${window.location.origin}/session/token`);
    const response = await fetch(`${window.location.origin}/assessments/assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await token.text(),
      },
      body: JSON.stringify({
        nid: nodeId,
        data: assessmentData,
      }),
    });

    if (response.ok) {
      const payload = await response.json();

      this.setState({
        correctValues: payload.correctAnswers,
        correctValuesCount: payload.correctAnswersCount,
      });
    } else {
      alert(Drupal.t('Quiz submission failed. Please try again.', {}, { context: 'ANU LMS' }));
      console.error(response.status, await response.text());
    }

    this.setState({ isSubmitting: false });
  }

  render() {
    const { items } = this.props;
    const { assessmentData, correctValues, correctValuesCount, isSubmitting } = this.state;

    const paragraphs = items.map((paragraph) => {
      if (paragraph.bundle in paragraphMappings) {
        const Component = paragraphMappings[paragraph.bundle];

        // Non-quiz paragraph - just render it.
        if (!paragraph.bundle.startsWith('question_')) {
          return (
            <Box mt={4} mb={4} key={paragraph.id}>
              <Component key={paragraph.id} {...paragraph} />
            </Box>
          );
        }

        // Quiz paragraph receives some extra props to handle widget's behavior.
        const value = paragraph.aqid in assessmentData ? assessmentData[paragraph.aqid] : null;
        const correctValue =
          correctValues && paragraph.aqid in correctValues ? correctValues[paragraph.aqid] : null;

        return (
          <Box mt={4} mb={4} key={paragraph.id}>
            <Component
              key={paragraph.id}
              {...paragraph}
              value={value}
              onChange={(value) => this.handleChange(value, paragraph.aqid)}
              correctQuizValue={correctValue}
              isSubmitting={isSubmitting}
              isQuiz
            />
          </Box>
        );
      }
      return null;
    });

    return (
      <>
        {paragraphs}

        <LessonGrid>
          {correctValues && correctValuesCount !== -1 && (
            <Typography variant="h5">
              {Drupal.t(
                'You scored @amount out of @total.',
                {
                  '@amount': correctValuesCount,
                  '@total': Object.keys(correctValues).length,
                },
                { context: 'ANU LMS' }
              )}
            </Typography>
          )}

          {!correctValues && (
            <QuizSubmit onSubmit={this.handleSubmit} isSubmitting={isSubmitting} isQuiz />
          )}
        </LessonGrid>
      </>
    );
  }
}

ParagraphsWithQuiz.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
  nodeId: PropTypes.number,
};

export default ParagraphsWithQuiz;
