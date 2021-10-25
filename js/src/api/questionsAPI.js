import { getPathPrefix } from '@anu/utilities/settings';

const pathPrefix = getPathPrefix();
const TOKEN_URL = `/${pathPrefix}session/token`;
const QUESTION_SUBMISSION_URL = `/${pathPrefix}assessments/question`;

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
