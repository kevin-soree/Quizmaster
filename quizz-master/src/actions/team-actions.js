export const teamActions = {
  acceptAnswer: 'acceptAnswerAction',
  declineAnswer: 'declineAnswerAction'
};

export function acceptAnswer(answer) {
  return dispatch => {
    return dispatch({ type: teamActions.acceptAnswer, answer: answer });
  };
}

export function declineAnswer(answer) {
  return dispatch => {
    return dispatch({ type: teamActions.declineAnswer, answer: answer });
  };
}
