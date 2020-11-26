import React from "react";
import * as ReactRedux from "react-redux";
import { acceptTeam, declineTeam } from "../actions/quiz-actions";

class TeamLobbyUI extends React.Component {
	render() {
		const uiTeams = this.props.teams.map(team => (
			<TeamItem
				key={team.name}
				team={team}
				onAcceptTeam={this.props.onAcceptTeam}
				onDeclineTeam={this.props.onDeclineTeam}
			/>
		));
		return <div className="team-list">{uiTeams}</div>;
	}
}

function mapStateToProps(state) {
	return {
		teams: state.quiz.teams,
		ws: state.quiz.ws
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onAcceptTeam: teamName => dispatch(acceptTeam(teamName)),
		onDeclineTeam: teamName => dispatch(declineTeam(teamName))
	};
}

export const TeamLobby = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(TeamLobbyUI);

function TeamItem(props) {
	return (
		<div className="team-item">
			<span className="team-name">{props.team.name}</span>
			<div className="team-item-buttons">
				{!props.team.approved ? (
					<span>
						<span onClick={() => props.onDeclineTeam(props.team.name)}>
							<RejectedIcon />
						</span>{" "}
						<span onClick={() => props.onAcceptTeam(props.team.name)}>
							<ApprovedIcon />
						</span>
					</span>
				) : null}
			</div>
		</div>
	);
}

function ApprovedIcon() {
	return (
		<i
			style={{ cursor: "pointer" }}
			className="fas fa-check approved-icon fa-2x"
		></i>
	);
}

function RejectedIcon() {
	return (
		<span className="icon-span">
			<i
				style={{ cursor: "pointer" }}
				className="fas fa-times-circle rejected-icon fa-2x"
			></i>
		</span>
	);
}
