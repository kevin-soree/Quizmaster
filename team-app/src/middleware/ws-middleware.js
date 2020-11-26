import { getTeamApprovalAction } from "../reducers/team.reducer";
import {
	getCurrentRoundAction,
	resetQuizAction,
	roundEndedAction
} from "../reducers/quiz.reducer";

export const wsConnect = host => ({ type: "WS_CONNECT", host });
export const wsConnecting = host => ({ type: "WS_CONNECTING", host });
export const wsConnected = host => ({ type: "WS_CONNECTED", host });
export const wsDisconnect = host => ({ type: "WS_DISCONNECT", host });
export const wsDisconnected = host => ({ type: "WS_DISCONNECTED", host });

const socketMiddleware = () => {
	let socket = null;

	const onOpen = store => event => {
		store.dispatch(wsConnected(event.target.url));
	};

	const onClose = store => () => {
		store.dispatch(wsDisconnected());
	};

	const onMessage = store => event => {
		const payload = JSON.parse(event.data);
		switch (payload.type) {
			case "TeamApprovalUpdated":
				store.dispatch(getTeamApprovalAction(store.getState().team.teamName));
				break;
			case "RoundStarted":
				store.dispatch(
					getCurrentRoundAction(store.getState().quiz.currentRound + 1)
				);
				break;
			case "NextQuestion":
				store.dispatch(
					getCurrentRoundAction(store.getState().quiz.currentRound)
				);
				break;
			case "RoundEnded":
				store.dispatch(roundEndedAction());
				break;
			case "QuizEnded":
				store.dispatch(resetQuizAction());
				break;
			default:
				break;
		}
	};

	// the middleware part of this function
	return store => next => action => {
		switch (action.type) {
			case "WS_CONNECT":
				if (socket !== null) {
					socket.close();
				}

				// connect to the remote host
				socket = new WebSocket(action.host);

				// websocket handlers
				socket.onmessage = onMessage(store);
				socket.onclose = onClose(store);
				socket.onopen = onOpen(store);
				console.log("websocket opened");

				break;
			case "WS_DISCONNECT":
				if (socket !== null) {
					socket.close();
				}
				socket = null;
				console.log("websocket closed");
				break;
			case "NEW_MESSAGE":
				socket.send(
					JSON.stringify({ command: "NEW_MESSAGE", message: action.msg })
				);
				break;
			default:
				return next(action);
		}
	};
};

export default socketMiddleware();
