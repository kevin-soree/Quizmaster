import React from "react";
import * as ReactRedux from "react-redux";
import {
	removeErrorAction,
	submitAnswerAction
} from "../reducers/quiz.reducer";
class AnswerQuestionUI extends React.Component {
	constructor() {
		super();
		this.state = { answer: "", isFirstAnswer: true };
	}

	componentDidUpdate(prevProps) {
		if (prevProps.questionText !== this.props.questionText) {
			this.setState({ isFirstAnswer: true, answer: "" });
		}
		if (this.props.quizEnded === true) {
			this.props.history.push("/");
		}
	}

	render() {
		return (
			<div>
				<h2 className="text-left" style={{ marginLeft: "10px" }}>
					Team: {this.props.teamName}
				</h2>
				<div className="row align-items-center" style={{ height: "500px" }}>
					<div className="col"></div>
					{this.props.roundActive ? (
						<div className="col-8">
							<span style={{ fontSize: "30px" }}>
								{this.props.questionText}
							</span>
							<div className="input-group">
								<input
									id="answerInput"
									type="text"
									value={this.state.answer}
									className="form-control"
									placeholder="Your answer..."
									onChange={e => this.setState({ answer: e.target.value })}
								/>
								<br />
								<button
									type="button"
									className="form-control btn btn-primary"
									onClick={async () => {
										await this.props.doSubmitAnswer(
											this.state.answer,
											this.state.isFirstAnswer
										);
										if (this.state.isFirstAnswer) {
											this.setState({ isFirstAnswer: false });
										}
									}}
								>
									Submit answer
								</button>
							</div>
						</div>
					) : (
						<div>Waiting for the Quiz Master to start new round...</div>
					)}
					<div className="col">
						{this.props.error ? (
							<div className="alert alert-danger">
								<span key={this.props.error}>{this.props.error}</span>
								<div
									className={"error-message-close-icon float-right"}
									onClick={this.props.doRemoveErrorClick.bind(this)}
								>
									<span>&#10006;</span>
								</div>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		questionText: state.quiz.currentQuestion
			? state.quiz.currentQuestion.question
			: "",
		teamName: state.team.teamName,
		quizEnded: state.quiz._id === "" && state.quiz.quizCode === "",
		error: state.quiz.error,
		roundActive: state.quiz.roundActive
	};
}

function mapDispatchToProps(dispatch) {
	return {
		doSubmitAnswer: (answer, isFirstAnswer) =>
			dispatch(submitAnswerAction(answer, isFirstAnswer)),
		doRemoveErrorClick: () => dispatch(removeErrorAction())
	};
}

export const AnswerQuestion = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(AnswerQuestionUI);
