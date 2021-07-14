import React, { useEffect, useState } from 'react';
import QuizScale from '@anu/components/QuizScale';
import PropTypes from 'prop-types';
import * as questionsAPI from '@anu/api/questionsAPI';

const ERROR_MESSAGE =
  'Could not submit the response. Please, refresh the page and try again or contact the administrator.';

const showError = (status, responseText) => {
  alert(ERROR_MESSAGE);
  return console.error(status, responseText);
};

const QuizScaleAdapter = (props) => {
  const defaultValue = Math.round((props.scale.from + props.scale.to) / 2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [correctValue, setCorrectValue] = useState(null);

  useEffect(() => {
    // During the initialization set the default value for the widget.
    props.onChange(defaultValue);
  }, []);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const response = await questionsAPI.postQuestion(props.aqid, value);
    setIsSubmitting(false);

    if (!response.ok) {
      return showError(response.status, await response.text());
    }

    const payload = await response.json();
    setCorrectValue(payload.correctAnswer);
    setIsSubmitted(true);
    props.onQuestionComplete();
  };

  const onChange = (event, value) => {
    props.onChange(value);
    setValue(value);
  };

  return (
    <QuizScale
      question={props.question}
      scale={props.scale}
      value={props.submittedAnswer || value}
      correctValue={props.correctQuizValue || correctValue}
      isSubmitting={props.isSubmitting || isSubmitting}
      isSubmitted={props.isSubmitted || isSubmitted}
      onChange={onChange}
      onSubmit={props.isQuiz ? null : onSubmit}
    />
  );
};

QuizScaleAdapter.propTypes = {
  aqid: PropTypes.number,
  question: PropTypes.string,
  scale: PropTypes.object,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  correctQuizValue: PropTypes.number,
  isSubmitting: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onQuestionComplete: PropTypes.func,
  isQuiz: PropTypes.bool,
  submittedAnswer: PropTypes.number,
};

QuizScaleAdapter.defaultProps = {
  onSubmit: () => {},
  onChange: () => {},
  onQuestionComplete: () => {},
  submittedAnswer: null,
};

export default QuizScaleAdapter;
