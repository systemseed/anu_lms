import React from 'react';
import axios from 'axios';
import QuizScale from '../../01_atoms/QuizScale';
import { getLanguageSettings } from '../../../utils/settings';

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
    const { aqid } = this.props;
    const { value } = this.state;
    this.setState({
      isSubmitting: true,
      correctValue: null,
    });

    // Use current language in post request.
    const languageSettings = getLanguageSettings();
    const languagePrefix = languageSettings ? '/' + languageSettings.current_language : '';

    axios
      .get('/session/token')
      .then(({ data }) => {
        axios.defaults.headers.common['X-CSRF-Token'] = data;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios
          .post(languagePrefix + '/assessments/question', {
            questionId: aqid,
            value
          })
          .then(({ data }) => {
            this.setState({ correctValue: data.correctAnswer });
          })
          .catch(error => {
            console.log('Could not send quiz data: ' + error);
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

export default QuizScaleStandaloneAdapter;
