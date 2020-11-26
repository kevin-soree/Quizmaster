import React from 'react';
import * as ReactRedux from 'react-redux';
import { TeamLobby } from './TeamLobby';
import { closeTeamApplicationsAction } from '../actions/quiz-actions';

class QuizLobbyUI extends React.Component {
  render() {
    const continueQuizHandler = async () => {
      this.props.doCloseTeamApplications(this.props.quizCode);
      this.props.history.push('/round-setup');
    };
    const disableContinueButton = this.props.teams.length < 2;
    return (
      <div className="row">
        <div className="col"></div>
        <div className="col">
          <h2>Quiz code: {this.props.quizCode}</h2>
          <h3>Teams</h3>
          <div>
            <TeamLobby />
          </div>
          <br />
          <br />
          <button
            className="btn btn-primary"
            disabled={disableContinueButton}
            onClick={continueQuizHandler}
          >
            Question setup
          </button>
        </div>
        <div className="col"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    _id: state.quiz._id,
    quizCode: state.quiz.quizCode,
    ws: state.quiz.ws,
    teams: state.quiz.teams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doCloseTeamApplications: quizCode => {
      dispatch(closeTeamApplicationsAction(quizCode));
    }
  };
}

export const QuizLobby = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizLobbyUI);
