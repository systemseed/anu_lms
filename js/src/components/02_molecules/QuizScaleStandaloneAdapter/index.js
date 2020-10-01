import React from 'react';
import axios from 'axios';
import { withAlert } from 'react-alert';
import QuizScale from '../../01_atoms/QuizScale';
import { getLangCodePrefix } from '../../../utils/settings';

class QuizScaleStandaloneAdapter extends React.Component {
  constructor(props) {
    super(props);

    const { scale } = props;
    const defaultValue = Math.round((scale.from + scale.to) / 2);

    this.state = {
      value: defaultValue,
      correctValue: null,
      isSubmitting: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event, value) {
    this.setState({ value });
  }

  onSubmit() {
    const { aqid, alert } = this.props;
    const { value } = this.state;

    this.setState({
      isSubmitting: true,
      correctValue: null,
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
            alert.error('Could not submit the response. Please, refresh the page and try again or contact the administrator.');
            console.log(`Could not send quiz data: ${error}`);
          })
          .finally(() => {
            this.setState({ isSubmitting: false });
          });
      });
  }

  render() {
    const { question, scale } = this.props;
    const { value, correctValue, isSubmitting } = this.state;

    return (
      <QuizScale
        question={question}
        scale={scale}
        value={value}
        correctValue={correctValue}
        isSubmitting={isSubmitting}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default withAlert()(QuizScaleStandaloneAdapter);
