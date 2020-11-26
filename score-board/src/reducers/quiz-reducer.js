import { openWebSocket } from "ws-client";

export const quizActions = {
	setupWebsocketAction: "setupWebsocketAction",
	receiveQuizAction: "receiveQuizAction",
	quizEndedAction: "quizEndedAction"
};

export function connectToQuizAction(quizCode) {
	return async function(dispatch) {
		const res = await fetch(
			`http://localhost:4000/quizzes/` + quizCode + "/connect",
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include",
				mode: "cors"
			}
		);
		if (res.ok) {
			const quiz = await res.json();
			const ws = openWebSocket();
			ws.onmessage = eventInfo => {
				const data = JSON.parse(eventInfo.data);
				if (data.type && data.type === "tick") {
					dispatch(getQuizAction(quizCode));
				} else if(data.type && data.type === 'QuizEnded') {
					dispatch(quizEndedAction())
				}
			};
			dispatch(setupWebsocketAction(ws));
			return dispatch(receiveQuizAction(quiz));
		} else {
			throw new Error("Quiz does not exist!");
		}
	};
}

// Gets the quiz object for the given quizCode
export function getQuizAction(quizCode) {
	return async function(dispatch) {
		try {
			const res = await fetch(`http://localhost:4000/quizzes/` + quizCode);
			const quiz = await res.json();
			return dispatch(receiveQuizAction(quiz));
		} catch (e) {
			console.log(e);
		}
	};
}

export function reloadQuizAction() {
	return async (dispatch, getState) => {
		return dispatch(getQuizAction(getState.quiz.quizCode));
	};
}

export function receiveQuizAction(quiz) {
	return { type: quizActions.receiveQuizAction, quiz };
}

export function setupWebsocketAction(websocket) {
	return { type: quizActions.setupWebsocketAction, websocket };
}

export function quizEndedAction() {
	return { type: quizActions.quizEndedAction };
}

const initialState = {
	quizCode: null,
	rounds: [],
	questions: [],
	teams: [],
	currentRound: null
};

export function quizReducer(state = initialState, action) {
	switch (action.type) {
		case quizActions.receiveQuizAction:
			return { ...state, ...action.quiz };
		case quizActions.setupWebsocketAction:
			return { ...state, websocket: action.websocket };
		case quizActions.quizEndedAction:
			return { ...initialState };
		default:
			return state;
	}
}
