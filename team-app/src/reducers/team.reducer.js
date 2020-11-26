const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`;
const serverFetchBase = `${window.location.protocol}//${serverHostname}`;

export const teamActions = {
	setTeamName: "setTeamNameAction",
	setTeamApproval: "setTeamApprovalAction",
	resetTeam: "resetTeamAction"
};

export function getTeamApprovalAction(teamName) {
	return async dispatch => {
		const res = await fetch(serverFetchBase + "/teams/" + teamName, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include",
			mode: "cors"
		});
		const { approved } = await res.json();
		return dispatch({ type: teamActions.setTeamApproval, approved });
	};
}

export function setTeamNameAction(teamName) {
	return async dispatch => {
		return dispatch({ type: teamActions.setTeamName, teamName: teamName });
	};
}

const initialState = {
	teamName: null,
	approved: null
};

export function teamReducer(state = initialState, action) {
	switch (action.type) {
		case teamActions.setTeamName:
			const teamName = action.teamName;
			return { ...state, teamName };
		case teamActions.setTeamApproval:
			return { ...state, approved: action.approved };
		case teamActions.resetTeam:
			return { ...initialState };
		default:
			return state;
	}
}
