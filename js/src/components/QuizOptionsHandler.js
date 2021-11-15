import React from 'react';
import QuizOptions from '@anu/components/QuizOptions';
import * as questionsAPI from '@anu/api/questionsAPI';
import PropTypes from 'prop-types';

// TODO - should be a pure function component with hooks.
class QuizOptionsHandler extends React.Component {
  constructor(props) {
    super(props);
    const { onChange, bundle } = props;
    const value = bundle === 'question_single_choice' ? null : [];

    this.state = {
      values: bundle === 'question_single_choice' ? null : [],
      correctValue: null,
      isSubmitting: false,
      isSubmitted: false,
    };

    if (props.isQuiz) {
      onChange(value);
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  async onSubmit() {
    const { aqid, bundle, onQuestionComplete } = this.props;
    const { values } = this.state;

    this.setState({
      isSubmitting: true,
      correctValue: null,
    });

    let formatterValue;

    if (bundle === 'question_single_choice') {
      formatterValue = Number.parseInt(values, 10);
    } else {
      formatterValue = values.map((value) => Number.parseInt(value, 10));
    }

    const response = await questionsAPI.postQuestion(aqid, formatterValue);

    if (response.ok) {
      const payload = await response.json();

      this.setState({
        correctValue: payload.correctAnswer,
        isSubmitted: true,
      });
      // MCQ has been answered, fire callback for page validation.
      onQuestionComplete(true);
    } else {
      alert(Drupal.t('Question submission failed. Please try again.', {}, { context: 'ANU LMS' }));
      console.error(response.status, await response.text());
    }

    this.setState({ isSubmitting: false });
  }

  handleCheckboxChange(value, event) {
    const { isQuiz, onChange } = this.props;
    const { values } = this.state;
    const checked = event.target.checked;
    let newValues = [...values];

    // If checked value does not exist in the list, then add it.
    // Otherwise remove from the list.
    if (checked && !values.includes(value)) {
      newValues.push(value);
    } else if (!checked && values.includes(value)) {
      newValues.splice(newValues.indexOf(value), 1);
    }

    this.setState({ values: newValues });
    if (isQuiz && onChange) {
      onChange(newValues);
    }
  }

  handleRadioChange(event) {
    const { isQuiz, onChange } = this.props;

    this.setState({ values: event.target.value });
    if (isQuiz && onChange) {
      onChange(event.target.value);
    }
  }

  render() {
    const {
      bundle,
      question,
      options,
      isQuiz,
      submittedAnswer,
      correctQuizValue = null,
    } = this.props;
    const { values, isSubmitting, isSubmitted, correctValue } = this.state;

    return (
      <QuizOptions
        multipleOptions={bundle !== 'question_single_choice'}
        question={question}
        options={options}
        value={submittedAnswer || values}
        correctValue={correctValue || correctQuizValue}
        isSubmitting={this.props.isSubmitting || isSubmitting}
        isSubmitted={this.props.isSubmitted || isSubmitted}
        onChange={
          bundle === 'question_single_choice' ? this.handleRadioChange : this.handleCheckboxChange
        }
        onSubmit={!isQuiz && this.onSubmit}
      />
    );
  }
}

QuizOptionsHandler.propTypes = {
  onChange: PropTypes.func,
  bundle: PropTypes.string,
  isQuiz: PropTypes.bool,
  aqid: PropTypes.number,
  onQuestionComplete: PropTypes.func,
  question: PropTypes.string,
  options: PropTypes.array,
  submittedAnswer: PropTypes.string,
  correctQuizValue: PropTypes.string,
  isSubmitting: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};

export default QuizOptionsHandler;
