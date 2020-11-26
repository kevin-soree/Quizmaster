import { openWebSocket } from "ws-client";
import { teamActions } from "./team.reducer";

const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`;
const serverFetchBase = `${window.location.protocol}//${serverHostname}`;

// Actions

export const quizActions = {
	joinQuiz: "joinQuizAction",
	submitAnswer: "submitAnswerAction",
	getCurrentRoundInfo: "getCurrentRoundAction",
	resetQuiz: "resetQuizAction",
	toggleQuizEnded: "toggleQuizEndedAction",
	removeError: "removeErrorAction",
	setErrorAction: "setErrorAction",
	roundEnded: "roundEndedAction"
};

export function resetQuizAction() {
	return async dispatch => {
		dispatch({ type: teamActions.resetTeam });
		return dispatch({ type: quizActions.resetQuiz });
	};
}

export function getCurrentRoundAction(roundNr) {
	return async dispatch => {
		const res = await fetch(serverFetchBase + "/rounds/" + roundNr, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include",
			mode: "cors"
		});
		const { currentRound, currentQuestion } = await res.json();
		return dispatch({
			type: quizActions.getCurrentRoundInfo,
			currentRound,
			currentQuestion
		});
	};
}

export function joinQuizAction(quizCode, teamName) {
	return async dispatch => {
		try {
			const response = await joinQuizFetch(quizCode, teamName);
			const okResponse = await checkFetchError(response);
			if (okResponse) {
				const quiz = await response.json();
				quiz.ws = openWebSocket();
				return dispatch({ type: quizActions.joinQuiz, quiz, teamName });
			} else {
				return dispatch(setErrorAction((await response.json()).error));
			}
		} catch (err) {
			console.log(err);
			return dispatch(setErrorAction("Unexpected response"));
		}
	};
}

function joinQuizFetch(quizCode, teamName) {
	const msgBodyObj = {
		quizCode,
		teamName
	};
	const fetchOptions = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		credentials: "include",
		mode: "cors",
		body: JSON.stringify(msgBodyObj)
	};
	return fetch(serverFetchBase + "/teams/", fetchOptions);
}

async function checkFetchError(response) {
	if (response.status === 400) {
		setErrorAction(response);
		return false;
	} else if (response.ok) {
		return true;
	} else {
		return Promise.reject(new Error("Unexpected response"));
	}
}

export function submitAnswerAction(answer, isFirstAnswer) {
	return async (dispatch, getState) => {
		try {
			const state = getState();
			const method = isFirstAnswer ? "POST" : "PATCH";
			const response = await fetch(
				serverFetchBase +
					"/rounds/" +
					state.quiz.currentRound +
					"/submittedAnswers",
				{
					method: method,
					body: JSON.stringify({
						answer: answer
					}),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					credentials: "include",
					mode: "cors"
				}
			);
			const okResponse = await checkFetchError(response);
			if (okResponse) {
				return dispatch({ type: quizActions.submitAnswer, answer });
			} else {
				return dispatch(setErrorAction((await response.json()).error));
			}
		} catch (err) {}
	};
}

export function removeErrorAction() {
	return { type: quizActions.removeError };
}

export function setErrorAction(error) {
	return { type: quizActions.setErrorAction, payload: { error } };
}

export function roundEndedAction() {
	return { type: quizActions.roundEnded };
}

// Reducer

const initialState = {
	_id: "",
	quizCode: "",
	currentQuestion: null,
	currentRound: null,
	roundActive: false,
	ws: null,
	error: null
};

export function quizReducer(state = initialState, action) {
	switch (action.type) {
		case quizActions.openQuiz:
			break;
		case quizActions.joinQuiz:
			const { ws, _id, quizCode, currentRound, currentQuestion } = action.quiz;
			return {
				...state,
				ws,
				_id,
				quizCode,
				currentRound,
				currentQuestion
			};
		case quizActions.getCurrentRoundInfo:
			return {
				...state,
				currentRound: action.currentRound,
				currentQuestion: action.currentQuestion,
				roundActive: true
			};
		case quizActions.roundEnded:
			return { ...state, roundActive: false };
		case quizActions.resetQuiz:
			return {
				...initialState
			};
		case quizActions.setErrorAction:
			return {
				...state,
				error: action.payload.error
			};
		case quizActions.removeError:
			return {
				...state,
				error: null
			};
		default:
			return state;
	}
}
