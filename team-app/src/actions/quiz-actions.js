import { openWebSocket } from 'ws-client';

const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`;
const serverFetchBase = `${window.location.protocol}//${serverHostname}`;

export const quizActions = {
  joinQuiz: 'joinQuizAction'
};

export function joinQuizAction(quizCode, teamName, history) {
  return async dispatch => {
    const quiz = await joinQuizFetch(quizCode, teamName);
    quiz.ws = openWebSocket();
    history.push('/pending');
    return dispatch({ type: quizActions.joinQuiz, quiz });
  };
}
function joinQuizFetch(quizCode, teamName) {
  const msgBodyObj = {
    quizCode,
    teamName
  };
  const fetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify(msgBodyObj)
  };
  return fetch(serverFetchBase + '/teams/', fetchOptions).then(response =>
    checkFetchError(response)
  );
}

function checkFetchError(response) {
  return response.ok
    ? response.json()
    : Promise.reject(new Error('Unexpected response'));
}
