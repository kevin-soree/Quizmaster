import React from "react";
import * as ReactRedux from "react-redux";

import { RoundInfo } from "./RoundInfo";
import { TeamScores } from "./TeamScores";
import { TeamAnswers } from "./TeamAnswers";
import { QuestionInfo } from "./QuestionInfo";

class ScoreboardUI extends React.Component {
	componentDidUpdate() {
		if (this.props.quiz.quizCode === null) {
			this.props.history.push("/connect");
		}
	}
	render() {
		if (
			this.props.quiz.quizCode !== null &&
			this.props.quiz.rounds.length > 0
		) {
			const questionClosed = this.props.quiz.rounds[
				this.props.quiz.currentRound - 1
			]
				? this.props.quiz.rounds[this.props.quiz.currentRound - 1].closed
				: false;
			return (
				<div>
					<div className="row">
						<div className="col-4">
							<RoundInfo
								//round={this.props.quiz.rounds[this.props.quiz.currentRound - 1]}
								quiz={this.props.quiz}
							/>
						</div>
						<div className="col-8">
							<QuestionInfo
								question={this.props.quiz.rounds[
									this.props.quiz.currentRound - 1
								].questions.find(
									x =>
										x._id ===
										this.props.quiz.rounds[this.props.quiz.currentRound - 1]
											.currentQuestionId
								)}
								questionClosed={questionClosed}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-4 text-center">
							<TeamScores teams={this.props.quiz.teams} />
						</div>
						<div className="col-8">
							<TeamAnswers
								teams={this.props.quiz.teams}
								round={this.props.quiz.rounds[this.props.quiz.currentRound - 1]}
								questionClosed={questionClosed}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div style={{ marginTop: "50px" }}>Waiting for quiz to start...</div>
			);
		}
	}
}

function mapStateToProps(state) {
	return {
		quiz: state.quiz
	};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export const Scoreboard = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(ScoreboardUI);
