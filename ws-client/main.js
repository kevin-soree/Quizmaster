import {quizActions} from "../quizz-master/src/actions/quiz-actions";

const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`;
const serverFetchBase = `${window.location.protocol}//${serverHostname}`;

export function openWebSocket() {
  let wsConnection;
  if (wsConnection) {
    wsConnection.onerror = null;
    wsConnection.onopen = null;
    wsConnection.onclose = null;
    wsConnection.close();
  }
  console.log('Opening socket for', `ws://${serverHostname}`);
  wsConnection = new WebSocket(`ws://${serverHostname}`);
  wsConnection.sendJSON = function(data) {
    this.send(JSON.stringify(data));
  };
  return wsConnection;
}

export function getWebSocket() {
  if (wsConnection) {
    return wsConnection;
  } else {
    throw new Error('The websocket has not been opened yet.');
  }
}
