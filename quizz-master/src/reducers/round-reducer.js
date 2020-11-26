import { roundActions } from "../actions/round-actions";

const initialState = {
	roundNr: null,
	questions: [],
	teamAnswers: [],
	currentQuestionId: null,
	closed: null,
	selectedNextQuestion: null
};

export function roundReducer(state = initialState, action) {
	switch (action.type) {
		case roundActions.receiveNewSubmittedAnswers:
			return { ...state, teamAnswers: action.teamAnswers };
		case roundActions.resetRound:
			return { ...initialState };
		case roundActions.setNewRound:
			return {
				...action.round
			};
		case roundActions.setQuestionClosed: {
			return { ...state, closed: action.closed };
		}
		case roundActions.selectNextQuestion:
			return {
				...state,
				selectedNextQuestion: action.question
			};
		case roundActions.goNextQuestion:
			// check if its the last question, if so, set selectedNextQuestion to null
			const selectedNextQuestion = state.questions.find(
				q => q._id !== state.selectedNextQuestion && q.isUsed === false
			);

			let selectedNextQuestionId = selectedNextQuestion
				? selectedNextQuestion._id
				: null;

			return {
				...state,
				closed: false,
				currentQuestionId: state.selectedNextQuestion,
				selectedNextQuestion: selectedNextQuestionId
			};
		default:
			return state;
	}
}
