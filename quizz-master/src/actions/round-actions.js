import { quizActions } from "./quiz-actions";

const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`;
const serverFetchBase = `${window.location.protocol}//${serverHostname}`;

export const roundActions = {
	receiveNewSubmittedAnswers: "receiveNewSubmittedAnswers",
	selectNextQuestion: "selectNextQuestionAction",
	goNextQuestion: "goNextQuestionAction",
	freezeQuestion: "freezeQuestionAction",
	closeQuestion: "closeQuestionAction",
	startRound: "startRoundAction",
	setNewRound: "setNewRoundAction",
	setQuestionClosed: "setQuestionClosedAction",
	evaluateSubmittedAnswer: "evaluateSubmittedAnswer",
	resetRound: 'resetRoundAction'
};

export function selectNextQuestionAction(question) {
	return { type: roundActions.selectNextQuestion, question };
}

export function goNextQuestionAction() {
	return { type: roundActions.goNextQuestion };
}

export function nextQuestionAction() {
	return async (dispatch, getState) => {
		try {
			const result = await fetch(
				serverFetchBase + "/rounds/" + getState().round.roundNr + "/questions",
				{
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					credentials: "include",
					mode: "cors",
					body: JSON.stringify({
						currentQuestionId: getState().round.selectedNextQuestion
					})
				}
			);
			let { questions } = getState().round;
			questions.find(
				q => q._id === getState().round.selectedNextQuestion
			).isUsed = true;
			dispatch({
				type: quizActions.setSelectedQuestions,
				questions
			});
			return dispatch({ type: roundActions.goNextQuestion });
		} catch (e) {
			console.log(e);
		}
	};
}

export function closeQuestionAction() {
	return async (dispatch, getState) => {
		await fetch(
			serverFetchBase + "/rounds/" + getState().round.roundNr + "/questions",
			{
				method: "PATCH",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include",
				mode: "cors",
				body: JSON.stringify({ closed: true })
			}
		);
		return dispatch({ type: roundActions.setQuestionClosed, closed: true });
	};
}

export function startRoundAction(selectedQuestions, selectedFirstQuestion) {
	return async dispatch => {
		let nextQuestion = selectedQuestions.find(
			sq => sq._id === selectedFirstQuestion
		);
		nextQuestion.isUsed = true;
		const body = {
			questions: selectedQuestions,
			currentQuestionId: selectedFirstQuestion
		};
		const res = await fetch(serverFetchBase + "/rounds", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include",
			mode: "cors",
			body: JSON.stringify(body)
		});
		const round = await res.json();
		round.selectedNextQuestion = round.questions.find(
			q => q.isUsed === false
		)._id;
		dispatch({
			type: quizActions.setCurrentRoundNr,
			currentRound: round.roundNr
		});
		dispatch({ type: roundActions.setNewRound, round: round });
		return dispatch({
			type: quizActions.setSelectedFirstQuestion,
			selectedFirstQuestion: null
		});
	};
}

export function fetchSubmittedAnswers(roundNr) {
	return async dispatch => {
		const res = await fetch(
			serverFetchBase + "/rounds/" + roundNr + "/submittedAnswers",
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include",
				mode: "cors"
			}
		);
		const submittedAnswers = await res.json();

		return dispatch({
			type: roundActions.receiveNewSubmittedAnswers,
			teamAnswers: submittedAnswers
		});
	};
}
export function evaluateSubmittedAnswer(roundNr, teamName, correctAnswer) {
	return async dispatch => {
		await fetch(serverFetchBase + "/rounds/" + roundNr + "/submittedAnswers", {
			method: "PATCH",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				teamName: teamName,
				correctAnswer: correctAnswer
			}),
			mode: "cors"
		});
		return dispatch(fetchSubmittedAnswers(roundNr));
	};
}
