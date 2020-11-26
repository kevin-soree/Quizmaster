import React from "react";
import * as ReactRedux from "react-redux";
import { evaluateSubmittedAnswer } from "../../actions/round-actions";

export class AnswerListUI extends React.Component {
	render() {
		return (
			<table className="table">
				{this.props.answers !== undefined && this.props.answers.length > 0 ? (
					<tbody>
						{this.createTableRows(
							this.props.answers,
							this.props.roundNr,
							this.props.onEvaluateSubmittedAnswer
						)}
					</tbody>
				) : (
					<tbody>
						<tr>
							<td>No answers yet...</td>
						</tr>
					</tbody>
				)}
			</table>
		);
	}

	createTableRows(answers, roundNr, onEvaluateSubmittedAnswer) {
		return answers.map(answer => {
			let tableRow = null;
			if (answer.correctAnswer === true || answer.correctAnswer === false) {
				tableRow = (
					<tr key={answer.teamName}>
						<td>{answer.answer}</td>
					</tr>
				);
			} else {
				tableRow = (
					<tr key={answer.teamName + answer.answer}>
						<td>{answer.answer}</td>
						<td>
							<span
								className="fas fa-times fa-2x"
								style={{ color: "red", cursor: "pointer" }}
								onClick={() =>
									onEvaluateSubmittedAnswer(roundNr, answer.teamName, false)
								}
							></span>
						</td>
						<td>
							<span
								className="fas fa-check fa-2x"
								style={{ color: "green", cursor: "pointer" }}
								onClick={() =>
									onEvaluateSubmittedAnswer(roundNr, answer.teamName, true)
								}
							></span>
						</td>
					</tr>
				);
			}
			return tableRow;
		});
	}
}

function mapStateToProps(state) {
	return {
		answers: state.round.teamAnswers.filter(
			answer => answer.questionId === state.round.currentQuestionId
		),
		roundNr: state.round.roundNr
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onEvaluateSubmittedAnswer: (roundNr, teamName, correctAnswer) =>
			dispatch(evaluateSubmittedAnswer(roundNr, teamName, correctAnswer))
	};
}

export const AnswerList = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(AnswerListUI);
