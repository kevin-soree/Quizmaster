import React from "react";
import * as ReactRedux from "react-redux";
import { CategorySelection } from "./CategorySelection";
import { QuestionSelection } from "./QuestionSelection";
import { fetchQuestionsAction } from "../../actions/quiz-actions";
import { startRoundAction } from "../../actions/round-actions";

class RoundSetupUI extends React.Component {
	componentDidMount() {
		if (!this.props.gameInProgress) {
			this.props.doGetQuestions();
		}
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col">
						<h2>
							Categories{" "}
							<span style={{ fontSize: "10px" }}>
								Use 'CTRL + LMB' to select three categories
							</span>
						</h2>{" "}
						<CategorySelection />
					</div>
					<div className="col">
						<h2>First question</h2>
						<QuestionSelection />
					</div>
				</div>
				<div className="row">
					<div className="col"></div>
					<div className="col align-middle">
						<br />
						<br />
						<button
							disabled={
								this.props.selectedFirstQuestion === null &&
								this.props.selectedCategories.length < 3
							}
							className="btn btn-primary btn-lg"
							onClick={async () => {
								try {
									await this.props.doStartQuiz(
										this.props.selectedQuestions,
										this.props.selectedFirstQuestion
									);
									this.props.history.push("/roundOverview");
								} catch (e) {
									// todo: show error
									console.log(e);
								}
							}}
						>
							Start ronde
						</button>
					</div>
					<div className="col"></div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		gameInProgress: state.quiz.currentRound !== null,
		selectedCategories: state.quiz.selectedCategories,
		selectedQuestions: state.quiz.selectedQuestions,
		selectedFirstQuestion: state.quiz.selectedFirstQuestion
	};
}

function mapDispatchToProps(dispatch) {
	return {
		doGetQuestions: () => dispatch(fetchQuestionsAction()),
		doStartQuiz: (selectedQuestions, selectedFirstQuestion) =>
			dispatch(startRoundAction(selectedQuestions, selectedFirstQuestion))
	};
}

export const RoundSetup = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(RoundSetupUI);
