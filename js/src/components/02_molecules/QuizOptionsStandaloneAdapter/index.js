import React from 'react';
import axios from 'axios';
import QuizOptions from '../../01_atoms/QuizOptions';

class QuizOptionsStandaloneAdapter extends React.Component {
  constructor(props) {
    super(props);
    const { bundle } = props;

    this.state = {
      values: bundle === 'question_single_choice' ? null : [],
      correctValue: null,
      isSubmitting: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  onSubmit() {
    const { aqid, bundle, onChange } = this.props;
    const { value } = this.state;

    this.setState({
      isSubmitting: true,
      correctValue: null,
    });

    let formatterValue;
    if (bundle === 'question_single_choice') {
      formatterValue = Number.parseInt(value);
    }
    else {
      formatterValue = [];
      for (let id in value) {
        if (value.hasOwnProperty(id) && value[id]) {
          formatterValue.push(Number.parseInt(id, 10));
        }
      }
    }

    axios
      .get('/session/token')
      .then(({ data }) => {
        axios.defaults.headers.common['X-CSRF-Token'] = data;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios
          .post('/assessments/question', {
            questionId: aqid,
            value: formatterValue,
          })
          .then(({ data }) => {
            this.setState({ correctValue: data.correctAnswer });
            // MCQ has been answered, fire callback for Lesson page validation.
            onChange(true);
          })
          .catch(error => {
            console.log('Could not send quiz data: ' + error);
          })
          .finally(() => {
            this.setState({ isSubmitting: false });
          });
      });
  }

  handleCheckboxChange(value, event) {
    const { values } = this.state;
    const checked = event.target.checked;
    let newValues = [...values];

    // If checked value does not exist in the list, then add it.
    // Otherwise remove from the list.
    if (checked && !values.includes(value)) {
      newValues.push(value);
    }
    else if (!checked && values.includes(value)) {
      newValues.splice(newValues.indexOf(value), 1);
    }

    this.setState({ values: newValues });
  };

  handleRadioChange(event) {
    this.setState({ values: event.target.value });
  }

  render() {
    const { bundle, question, options } = this.props;
    const { values, isSubmitting, correctValue } = this.state;

    return (
      <QuizOptions
        multipleOptions={bundle !== 'question_single_choice'}
        question={question}
        options={options}
        value={values}
        correctValue={correctValue}
        isSubmitting={isSubmitting}
        onChange={bundle === 'question_single_choice' ? this.handleRadioChange : this.handleCheckboxChange}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default QuizOptionsStandaloneAdapter;
