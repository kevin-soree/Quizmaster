import React from 'react';
import * as ReactRedux from 'react-redux';
import { createQuizAction } from '../actions/quiz-actions';
import { wsConnect } from '../actions/websocket';

class CreateQuizUI extends React.Component {
  render() {
    const createQuizHandler = async () => {
      await this.props.doCreateQuizAction();
      const port = 4000;
      const serverHostname = `${window.location.hostname}:${port}`;
      await this.props.doConnect(`ws://${serverHostname}`);
      this.props.history.push('/lobby');
    };
    return (
      <div>
        <button className="btn btn-primary btn-lg" onClick={createQuizHandler}>
          Start New Quiz
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quiz: state.quiz.quizCode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doCreateQuizAction: async history => dispatch(createQuizAction(history)),
    doConnect: host => dispatch(wsConnect(host))
  };
}

export const CreateQuiz = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateQuizUI);
