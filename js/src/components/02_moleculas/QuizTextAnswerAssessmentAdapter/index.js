import React from 'react';
import QuizTextAnswer from '../../01_atoms/QuizTextAnswer';

class QuizTextAnswerAssessmentAdapter extends React.Component {

  constructor(props) {
    super(props);

    // During the initialization set the default value for the widget.
    const { onChange } = props;
    onChange('');

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const { onChange } = this.props;
    onChange(event.target.value);
  }

  render() {
    const { question, bundle, value, correctValue, isSubmitting } = this.props;

    return (
      <QuizTextAnswer
        question={question}
        value={value === null ? '' : value}
        correctValue={correctValue}
        isSubmitting={isSubmitting}
        multiline={bundle === 'question_long_answer'}
        onChange={this.onChange}
      />
    );
  }
}

export default QuizTextAnswerAssessmentAdapter;
