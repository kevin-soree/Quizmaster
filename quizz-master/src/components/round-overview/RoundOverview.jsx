import React from "react";
import * as ReactRedux from "react-redux";
import { QuestionSelection } from "../round-setup/QuestionSelection";
import { AnswerList } from "./AnswerList";
import {
	closeQuestionAction,
	nextQuestionAction
} from "../../actions/round-actions";
import { calculateScoresAction } from "../../actions/quiz-actions";
class RoundOverviewUI extends React.Component {
	render() {
		return (
			<div>
				<div className="row">
					<div className="col"></div>
					<div className="col">
						<AnswerList />
						<br />
						<br />
						<h2>Answer:</h2>
						<h4>{this.props.answer}</h4>
					</div>
					<div className="col">
						<QuestionSelection />
					</div>
					<div className="col"></div>
				</div>
				<div className="row">
					<div className="col"></div>
					<div className="col">
						<br />
						<br />
						<button
							className="btn btn-primary pull-right"
							disabled={this.props.questionClosed === true}
							onClick={async e => {
								this.props.doCloseQuestion();
							}}
						>
							Close Question
						</button>
					</div>
					<div className="col">
						<br />
						<br />
						{this.props.isLastRound ? (
							<button
								className="btn btn-success"
								disabled={
									!this.nextQuestionAllowed(
										this.props.answers,
										this.props.questionClosed
									)
								}
								onClick={async () => {
									await this.props.calculateScores();
									this.props.history.push("/nextRound");
								}}
							>
								End round
							</button>
						) : (
							<button
								className="btn btn-primary"
								disabled={
									!this.nextQuestionAllowed(
										this.props.answers,
										this.props.questionClosed
									)
								}
								onClick={async e => this.props.doNextQuestion()}
							>
								Next Question
							</button>
						)}
					</div>
					<div className="col"></div>
				</div>
			</div>
		);
	}

	nextQuestionAllowed(answers, questionClosed) {
		return (
			questionClosed &&
			answers.every(
				answer =>
					answer.correctAnswer !== undefined && answer.correctAnswer !== null
			)
		);
	}
}

function mapStateToProps(state) {
	return {
		answers: state.round.teamAnswers.filter(
			answer => answer.questionId === state.round.currentQuestionId
		),
		answer: state.round.questions.find(
			q => q._id === state.round.currentQuestionId
		).answer,
		questionClosed: state.round.closed,
		isLastRound: state.round.questions.every(
			question => question.isUsed === true
		)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		doCloseQuestion: () => dispatch(closeQuestionAction()),
		doNextQuestion: () => dispatch(nextQuestionAction()),
		calculateScores: () => dispatch(calculateScoresAction())
	};
}

export const RoundOverview = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(RoundOverviewUI);
