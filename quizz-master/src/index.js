import React from 'react';
import ReactDOM from 'react-dom';

import thunkMiddleware from 'redux-thunk';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import './index.css';
import { applyMiddleware } from 'redux';
import { roundReducer } from './reducers/round-reducer';
import { quizReducer } from './reducers/quiz-reducer';
import { teamReducer } from './reducers/team-reducer';
import wsMiddleware from './reducers/ws-middleware';
import App from './components/App';

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

const mainReducer = Redux.combineReducers({
  round: roundReducer,
  quiz: quizReducer,
  team: teamReducer
});
const middleware = [thunkMiddleware, wsMiddleware];
const theStore = Redux.createStore(
  mainReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

const mainComponent = (
  <ReactRedux.Provider store={theStore}>
    <App />
  </ReactRedux.Provider>
);

ReactDOM.render(mainComponent, document.getElementById('react-root'));
