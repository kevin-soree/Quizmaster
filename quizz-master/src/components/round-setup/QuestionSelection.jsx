import React from "react";
import * as ReactRedux from "react-redux";
import { setSelectedFirstQuestionAction } from "../../actions/quiz-actions";
import { selectNextQuestionAction } from "../../actions/round-actions";

class QuestionSelectionUI extends React.Component {
	componentDidMount() {}

	render() {
		return (
			<div>
				<select
					className="custom-select"
					size="4"
					value={
						this.props.selectedQuestion
							? this.props.selectedQuestion._id
							: undefined
					}
					onChange={async event => {
						!this.props.roundInProgress
							? this.props.doSetSelectedFirstQuestion(event.target.value)
							: this.props.doSetSelectedNextQuestion(event.target.value);
					}}
				>
					{this.props.selectedQuestions
						.filter(question => question.isUsed === false)
						.map(question => (
							<option key={question._id} value={question._id}>
								{question.question}
							</option>
						))}
				</select>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		selectedQuestions: state.quiz.selectedQuestions,
		roundInProgress: state.round && state.round.currentQuestionId,
		quizStarted:
			state.quiz.currentRound && state.quiz.currentRound > 0 ? true : false,
		selectedQuestion: state.quiz.selectedQuestions.find(
			q => q._id === state.round.selectedNextQuestion
		)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		doSetSelectedFirstQuestion: question =>
			dispatch(setSelectedFirstQuestionAction(question)),
		doSetSelectedNextQuestion: question =>
			dispatch(selectNextQuestionAction(question))
	};
}

export const QuestionSelection = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionSelectionUI);
