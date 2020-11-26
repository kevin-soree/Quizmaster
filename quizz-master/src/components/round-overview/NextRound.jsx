import React from "react";
import { connect } from "react-redux";
import {
	setupNewRoundAction,
	stopQuizAction
} from "../../actions/quiz-actions";

function NextRoundUI(props) {
	return (
		<div className="row">
			<div className="col">
				<div
					className="btn btn-primary"
					onClick={async () => {
						await props.setupNewRound();
						props.history.push("/round-setup");
					}}
				>
					New round
				</div>
			</div>
			<div className="col">
				<div
					className="btn btn-danger"
					onClick={async () => {
						await props.endQuiz();
						props.history.push("/");
					}}
				>
					End quiz
				</div>
			</div>
		</div>
	);
}

const mapDispatchToProps = dispatch => {
	return {
		setupNewRound: () => dispatch(setupNewRoundAction()),
		endQuiz: () => dispatch(stopQuizAction())
	};
};

const NextRound = connect(undefined, mapDispatchToProps)(NextRoundUI);

export default NextRound;
