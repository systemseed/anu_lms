import React from 'react';
import axios from 'axios';
import QuizScale from '../../01_atoms/QuizScale';

class QuizScaleAssessmentAdapter extends React.Component {

  constructor(props) {
    super(props);

    // During the initialization set the default value for the widget.
    const { scale, onChange } = props;
    const defaultValue = Math.round((scale.from + scale.to) / 2);
    onChange(defaultValue);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event, value) {
    const { onChange } = this.props;
    onChange(value);
  }

  render() {
    const { question, scale, value, correctValue, isSubmitting } = this.props;

    return (
      <QuizScale
        question={question}
        scale={scale}
        value={value}
        correctValue={correctValue}
        isSubmitting={isSubmitting}
        onChange={this.onChange}
      />
    );
  }
}

export default QuizScaleAssessmentAdapter;
