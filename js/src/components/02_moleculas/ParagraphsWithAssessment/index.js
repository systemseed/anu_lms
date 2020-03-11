import React from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuizTextAnswerAssessmentAdapter from '../../02_moleculas/QuizTextAnswerAssessmentAdapter';
import QuizScaleAssessmentAdapter from '../../02_moleculas/QuizScaleAssessmentAdapter';
import QuizOptionsAssessmentAdapter from '../../02_moleculas/QuizOptionsAssessmentAdapter';
import paragraphsMapping from '../../../utils/paragraphsMapping';
import LessonGrid from '../../01_atoms/LessonGrid';
import LessonNavigationButton from '../../01_atoms/LessonNavigationButton';

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
          .post('/assessments/assessment', {
            nid: node.id,
            data: assessmentData,
          })
          .then(({ data }) => {
            this.setState({
              correctValues: data.correctAnswers,
              correctValuesCount: data.correctAnswersCount
            });
          })
          .catch(error => {
            console.log('Could not send quiz data: ' + error);
          })
          .finally(() => {
            this.setState({ isSubmitting: false });
          });
      });
  }

  render () {
    const { items, node } = this.props;
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
        const correctValue = correctValues && paragraph.aqid in correctValues ? correctValues[paragraph.aqid] : null;
        return <Component
          key={paragraph.id}
          {...paragraph}
          value={value}
          onChange={value => this.handleChange(value, paragraph.aqid)}
          correctValue={correctValue}
          isSubmitting={isSubmitting}
        />
      }
      return null;
    });

    return (
      <>
        {paragraphsRendered}
        <LessonGrid>
          {correctValues && correctValuesCount !== -1 &&
          <Typography variant="h3">You scored {correctValuesCount} out of {Object.keys(correctValues).length}</Typography>
          }
          {!correctValues &&
          <LessonNavigationButton onClick={this.handleSubmit} disabled={isSubmitting}>
            {isSubmitting &&
            <><CircularProgress color="inherit" size={24}/>&nbsp;&nbsp;&nbsp;&nbsp;</>
            }
            Submit assessment
          </LessonNavigationButton>
          }
          {node.module && node.module.course &&
          <Box mt={4}>
            <LessonNavigationButton href={node.module.course.path} variant={correctValues ? "contained" : "outlined"}>
              Back to the course
            </LessonNavigationButton>
          </Box>
          }
        </LessonGrid>
      </>
    );
  }
}

export default ParagraphsWithAssessments;
