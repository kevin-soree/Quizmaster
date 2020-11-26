import { quizActions } from "../actions/quiz-actions";

const initialState = {
	_id: null,
	quizCode: null,
	rounds: [],
	questions: [],
	selectedQuestions: [],
	selectedCategories: [],
	selectedFirstQuestion: null,
	teams: [],
	currentRound: null,
	teamsCanApply: null,
	ws: null
};

export function quizReducer(state = initialState, action) {
	switch (action.type) {
		case quizActions.openQuiz:
			break;
		case quizActions.stopQuiz:
			return { ...initialState };
		case quizActions.createQuiz:
			const quiz = action.quizData;
			const { quizCode, _id } = quiz;
			return { ...state, quizCode, _id };
		case quizActions.getTeams:
			const teams = action.teams;
			return { ...state, teams };
		case quizActions.closeTeamApplications:
			return { ...state, teamsCanApply: action.teamsCanApply };
		case quizActions.setQuestions:
			return { ...state, questions: action.questions };
		case quizActions.setSelectedCategories:
			return { ...state, selectedCategories: action.categories };
		case quizActions.setSelectedQuestions:
			return { ...state, selectedQuestions: action.questions };
		case quizActions.setSelectedFirstQuestion:
			return { ...state, selectedFirstQuestion: action.question };
		case quizActions.setCurrentRoundNr:
			return { ...state, currentRound: action.currentRound };
		default:
			return state;
	}
}
