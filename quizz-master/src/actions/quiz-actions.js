import { roundActions } from "./round-actions";

const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`;
const serverFetchBase = `${window.location.protocol}//${serverHostname}`;
const fetchOptions = {
	method: "POST",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json"
	},
	credentials: "include",
	mode: "cors"
};

export const quizActions = {
	openQuiz: "openQuizAction",
	stopQuiz: "stopQuizAction",
	createQuiz: "createQuizAction",
	getTeams: "getTeamsAction",
	NewTeamsAdded: "NewTeamsAddedAction",
	closeTeamApplications: "closeTeamApplications",
	acceptTeam: "acceptTeamAction",
	declineTeam: "declineTeamAction",
	setQuestions: "setQuestionsAction",
	setSelectedCategories: "setSelectedCategoriesAction",
	setSelectedQuestions: "setSelectedQuestionsAction",
	setSelectedFirstQuestion: "setSelectedFirstQuestionAction",
	setCurrentRoundNr: "setCurrentRoundAction"
};

export function fetchQuestionsAction() {
	return async dispatch => {
		const res = await fetch(serverFetchBase + "/questions", {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include",
			mode: "cors"
		});
		const questions = await res.json();
		return dispatch({
			type: quizActions.setQuestions,
			questions: shuffle(questions)
		});
	};
}

// https://stackoverflow.com/a/2450976/10391156
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

export function setSelectedCategoriesAction(categories) {
	return dispatch =>
		dispatch({ type: quizActions.setSelectedCategories, categories });
}

export function setSelectedQuestionsAction(questions) {
	return dispatch =>
		dispatch({ type: quizActions.setSelectedQuestions, questions });
}

export function setSelectedFirstQuestionAction(question) {
	return dispatch =>
		dispatch({ type: quizActions.setSelectedFirstQuestion, question });
}

export function openQuiz() {
	return dispatch => {
		return dispatch({ type: quizActions.openQuiz });
	};
}

export function calculateScoresAction() {
	return async (dispatch, getState) => {
		try {
			const { currentRound } = getState().quiz;
			await fetch(
				serverFetchBase + "/rounds/" + currentRound + "/calculateScores",
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
			return;
		} catch (e) {
			console.log(e);
		}
	};
}

export function setupNewRoundAction() {
	return async (dispatch, getState) => {
		try {
			// Remove the first 12 from the list, because those were used last round
			let newQuestions = getState().quiz.questions;
			newQuestions.splice(0, 12);

			dispatch({
				type: quizActions.setQuestions,
				questions: shuffle(newQuestions)
			});
			dispatch(setSelectedCategoriesAction([]));
			dispatch(setSelectedQuestionsAction([]));
			return dispatch({ type: roundActions.setNewRound, round: {} });
		} catch (e) {
			console.log(e);
		}
	};
}

export function stopQuizAction() {
	return async (dispatch, getState) => {
		try {
			await fetch(serverFetchBase + "/quizzes/" + getState().quiz.quizCode, {
				method: "PATCH",
				body: JSON.stringify({ quizEnded: true }),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include",
				mode: "cors"
			});
			dispatch({ type: roundActions.resetRound });
			return dispatch({ type: quizActions.stopQuiz });
		} catch (e) {
			console.log(e);
		}
	};
}

export function createQuizAction() {
	return async dispatch => {
		try {
			const quizData = await createQuiz();
			return dispatch({ type: quizActions.createQuiz, quizData });
		} catch (e) {
			console.log(e);
		}
	};
}

export function closeTeamApplicationsAction(quizCode) {
	return async dispatch => {
		try {
			await fetch(serverFetchBase + "/quizzes/" + quizCode, {
				method: "PATCH",
				body: JSON.stringify({ teamsCanApply: false }),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include",
				mode: "cors"
			});
			return dispatch({
				type: quizActions.closeTeamApplications,
				teamsCanApply: false
			});
		} catch (e) {
			console.log(e);
		}
	};
}

function createQuiz() {
	return fetch(
		serverFetchBase + "/quizzes/create",
		fetchOptions
	).then(response => checkFetchError(response));
}

function checkFetchError(response) {
	console.log(response);
	return response.ok
		? response.json()
		: Promise.reject(new Error("Unexpected response"));
}

export function getTeamsAction() {
	return async dispatch => {
		try {
			const teams = await getTeams();
			return dispatch({ type: quizActions.getTeams, teams });
		} catch (e) {
			console.log(e);
		}
	};
}

function getTeams() {
	const fetchOptions = {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		credentials: "include",
		mode: "cors"
	};
	return fetch(serverFetchBase + "/teams/", fetchOptions).then(response =>
		checkFetchError(response)
	);
}

export function acceptTeam(teamName) {
	return async dispatch => {
		await changeTeamStatus(teamName, true);
		const teams = await getTeams();
		return dispatch({ type: quizActions.getTeams, teams });
	};
}

export function declineTeam(teamName) {
	return async dispatch => {
		await changeTeamStatus(teamName, false);
		const teams = await getTeams();
		return dispatch({ type: quizActions.getTeams, teams });
	};
}

export function changeTeamStatus(teamName, status) {
	const fetchOptions = {
		method: "PATCH",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		credentials: "include",
		mode: "cors",
		body: JSON.stringify({ status })
	};
	return fetch(serverFetchBase + "/teams/" + teamName, fetchOptions);
}
