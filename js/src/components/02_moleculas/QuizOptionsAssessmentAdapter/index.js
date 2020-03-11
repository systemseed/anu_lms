import React from 'react';
import QuizOptions from '../../01_atoms/QuizOptions';

class QuizOptionsAssessmentAdapter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [], // Used only for multiple options widget.
    };

    const { onChange, bundle } = props;
    const value = bundle === 'question_single_choice' ? null : [];
    onChange(value);

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  handleCheckboxChange(value, event) {
    const { onChange } = this.props;
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
    onChange(newValues);
  };

  handleRadioChange(event) {
    const { onChange } = this.props;
    onChange(event.target.value);
  }

  render() {
    const { value, isSubmitting, bundle, question, options, correctValue } = this.props;
    return (
      <QuizOptions
        multipleOptions={bundle !== 'question_single_choice'}
        question={question}
        options={options}
        value={value}
        correctValue={correctValue}
        isSubmitting={isSubmitting}
        onChange={bundle === 'question_single_choice' ? this.handleRadioChange : this.handleCheckboxChange}
      />
    );
  }
}

export default QuizOptionsAssessmentAdapter;
