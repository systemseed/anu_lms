const TOKEN_URL = `${window.location.origin}/session/token`;
const QUESTION_SUBMISSION_URL = `${window.location.origin}/assessments/question`;

const postQuestion = async (questionId, value) => {
  const tokenResponse = await fetch(TOKEN_URL);
  const token = await tokenResponse.text();
  return fetch(QUESTION_SUBMISSION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
    },
    body: JSON.stringify({
      questionId: questionId,
      value: value,
    }),
  });
};

export { postQuestion };
