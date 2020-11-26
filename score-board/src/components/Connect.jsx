import React from "react";
import * as ReactRedux from "react-redux";

import { connectToQuizAction } from "../reducers/quiz-reducer";

export class ConnectUI extends React.Component {
	constructor() {
		super();
		this.state = { quizCode: "", errorMessage: "" };
	}

	componentWillUnmount() {}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col"></div>
					<div className="col align-middle">
						<div style={{ marginTop: "50px" }} className="input-group">
							<input
								type="text"
								className="form-control"
								placeholder="Quizcode..."
								onChange={e => this.setState({ quizCode: e.target.value })}
							></input>
							<button
								type="button"
								className="form-control btn btn-primary"
								onClick={async e => {
									try {
										await this.props.doConnectToQuiz(this.state.quizCode);
										this.props.history.push("/scoreboard");
									} catch (e) {
										this.setState({ errorMessage: e.message });
									}
								}}
							>
								Connect
							</button>
						</div>
						{this.state.errorMessage !== "" ? (
							<div className="alert-danger">{this.state.errorMessage}</div>
						) : (
							<div></div>
						)}
					</div>
					<div className="col"></div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {
		doConnectToQuiz: quizCode => dispatch(connectToQuizAction(quizCode))
	};
}

export const Connect = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(ConnectUI);
