import React from 'react';
import axios from 'axios';
import QuizTextAnswer from '../../01_atoms/QuizTextAnswer';
import { getLangCodePrefix } from '../../../utils/settings';

class QuizTextAnswerStandaloneAdapter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      correctValue: '',
      isSubmitting: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onSubmit() {
    const { aqid } = this.props;
    const { value } = this.state;

    this.setState({
      isSubmitting: true,
      correctValue: '',
    });

    axios
      .get('/session/token')
      .then(({ data }) => {
        axios.defaults.headers.common['X-CSRF-Token'] = data;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios
          .post(`${getLangCodePrefix()}/assessments/question`, {
            questionId: aqid,
            value
          })
          .then(({ data: response }) => {
            this.setState({ correctValue: response.correctAnswer });
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
    const { question, bundle } = this.props;
    const { value, correctValue, isSubmitting } = this.state;

    return (
      <QuizTextAnswer
        question={question}
        value={value}
        correctValue={correctValue}
        isSubmitting={isSubmitting}
        multiline={bundle === 'question_long_answer'}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default QuizTextAnswerStandaloneAdapter;
