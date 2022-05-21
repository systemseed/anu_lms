import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LessonGrid from '@anu/components/LessonGrid';
import QuizSubmit from '@anu/components/QuizSubmit';
import paragraphMappings from '@anu/utilities/paragraphMappings';
import Box from '@material-ui/core/Box';
import QuizAlert from '@anu/components/QuizAlert';
import SnackAlert from "@anu/components/SnackAlert";

// TODO - should be a pure function component with hooks.
class ParagraphsWithQuiz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assessmentData: {},
      correctValues: null,
      correctValuesCount: !isNaN(props.correctValuesCount) ? props.correctValuesCount : -1,
      isSubmitting: false,
      openDialog: false,
      alertOpen: false,
      readyToSubmit: !props.isSingleSubmission,
      isSingleSubmission: props.isSingleSubmission,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmissionConfirmation = this.handleSubmissionConfirmation.bind(this);
    this.checkSubmission = this.checkSubmission.bind(this);
  }

  /**
   * Capture form widget value change for each answer.
   */
  handleChange(value, paragraphId) {
    this.setState((prevState) => ({
      assessmentData: {
        ...prevState.assessmentData,
        [paragraphId]: value,
      },
    }));
  }

  handleSubmissionConfirmation(value) {
    this.setState(
      () => ({
        readyToSubmit: value,
        openDialog: false,
      }),
      this.handleSubmit
    );
  }

  checkSubmission() {
    if (this.state.isSingleSubmission) {
      this.setState({
        openDialog: true,
      });
    } else {
      this.handleSubmit();
    }
  }

  async handleSubmit() {
    if (this.state.isSingleSubmission && !this.state.readyToSubmit) {
      return;
    }

    const { nodeId } = this.props;
    const { assessmentData } = this.state;

    this.setState({
      isSubmitting: true,
      correctValues: null,
    });

    try {
      const token = await fetch(Drupal.url('session/token'));
      const response = await fetch(Drupal.url('assessments/assessment'), {
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
          correctValues: payload.correctAnswers || null,
          correctValuesCount: payload.correctAnswersCount,
        });
        this.props.submitQuiz(true);
      } else {
        this.setState({alertOpen: true});
        console.error(response.status, await response.text());
      }
    } catch (error) {
      console.error(error);
    }

    this.setState({ isSubmitting: false });
  }

  render() {
    const { items, isSingleSubmission, isSubmitted, prevLesson } = this.props;
    const {
      assessmentData,
      correctValues,
      correctValuesCount,
      isSubmitting,
      openDialog,
    } = this.state;

    const canSubmit = !isSubmitted;

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
              isSubmitted={isSubmitted}
              canSubmit={canSubmit}
              prevLesson={prevLesson}
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
          {isSubmitted && correctValuesCount !== -1 && (
            <Typography variant="h5">
              {Drupal.t(
                'You scored @amount out of @total.',
                {
                  '@amount': correctValuesCount,
                  '@total': Object.keys(assessmentData).length,
                },
                { context: 'ANU LMS' }
              )}
            </Typography>
          )}

          {isSingleSubmission && (
            <QuizAlert open={openDialog} handleClose={this.handleSubmissionConfirmation} />
          )}

          {canSubmit && (
            <QuizSubmit
              onSubmit={this.checkSubmission}
              prevLesson={prevLesson}
              isSubmitting={isSubmitting}
              isQuiz
            />
          )}
          <SnackAlert
            show={this.state.alertOpen}
            message={Drupal.t('Quiz submission failed. Please try again.', {}, { context: 'ANU LMS' })}
            onClose={() => this.setState({ alertOpen: false })}
            severity='warning'
            variant="filled"
            spaced
            duration={5000}
          />
        </LessonGrid>
      </>
    );
  }
}

ParagraphsWithQuiz.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
  nodeId: PropTypes.number,
  correctValuesCount: PropTypes.number,
  isSingleSubmission: PropTypes.bool,
  submitQuiz: PropTypes.func,
  isSubmitted: PropTypes.bool,
  prevLesson: PropTypes.shape(),
};

export default ParagraphsWithQuiz;
