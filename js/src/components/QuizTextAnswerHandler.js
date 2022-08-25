import React, { useEffect, useState } from 'react';
import QuizTextAnswer from '@anu/components/QuizTextAnswer';
import PropTypes from 'prop-types';
import * as questionsAPI from '@anu/api/questionsAPI';

const ERROR_MESSAGE = Drupal.t(
  'Could not submit the response. Please, refresh the page and try again or contact the administrator.',
  {},
  { context: 'ANU LMS' }
);

const showError = (status, responseText) => {
  alert(ERROR_MESSAGE);
  return console.error(status, responseText);
};

const QuizTextAnswerHandler = (props) => {
  const defaultValue = '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [correctValue, setCorrectValue] = useState(defaultValue);

  useEffect(() => {
    // During the initialization set the default value for the widget.
    props.onChange(defaultValue);
  }, []);

  const onChange = (event) => {
    const value = event.target.value;
    setValue(value);
    props.onChange(value);
  };

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

  return (
    <QuizTextAnswer
      question={props.question}
      value={props.submittedAnswer || value}
      correctValue={props.correctQuizValue || correctValue}
      isSubmitting={props.isSubmitting || isSubmitting}
      isSubmitted={props.isSubmitted || isSubmitted}
      multiline={props.bundle === 'question_long_answer'}
      onChange={onChange}
      onSubmit={!props.isQuiz ? onSubmit : null}
    />
  );
};

QuizTextAnswerHandler.propTypes = {
  aqid: PropTypes.number,
  question: PropTypes.string,
  scale: PropTypes.object,
  value: PropTypes.string,
  defaultValue: PropTypes.number,
  correctQuizValue: PropTypes.string,
  isSubmitting: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onQuestionComplete: PropTypes.func,
  isQuiz: PropTypes.bool,
  bundle: PropTypes.string,
  submittedAnswer: PropTypes.string,
};

QuizTextAnswerHandler.defaultProps = {
  onSubmit: () => {},
  onChange: () => {},
  onQuestionComplete: () => {},
  submittedAnswer: '',
};

export default QuizTextAnswerHandler;
