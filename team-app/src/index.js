import React from 'react';
import ReactDOM from 'react-dom';

import thunkMiddleware from 'redux-thunk';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import './index.css';
import { applyMiddleware } from 'redux';
import { quizReducer } from './reducers/quiz.reducer';
import App from './components/App';
import { teamReducer } from './reducers/team.reducer';
import socketMiddleware from './middleware/ws-middleware';

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

const mainReducer = Redux.combineReducers({
  quiz: quizReducer,
  team: teamReducer
});

const theStore = Redux.createStore(
  mainReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware, socketMiddleware))
);

const mainComponent = (
  <ReactRedux.Provider store={theStore}>
    <App />
  </ReactRedux.Provider>
);

ReactDOM.render(mainComponent, document.getElementById('react-root'));
