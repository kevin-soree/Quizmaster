import React from 'react';
import * as ReactRedux from 'react-redux';
import {joinQuizAction, removeErrorAction} from '../reducers/quiz.reducer';
import { setTeamNameAction } from '../reducers/team.reducer';
import { wsConnect } from '../middleware/ws-middleware';

class JoinQuizUI extends React.Component {
  constructor() {
    super();
    this.state = {
      quizCodeInput: '',
      teamNameInput: ''
    };
  }
  render() {
    return (
      <div className="row">
        <div className="col"></div>
        <div className="col">
          <br />
          <div className="input-group">
            <label htmlFor="inputQuizCode">Quiz code</label>
            <input
              type="text"
              id="inputQuizCode"
              className="form-control"
              value={this.state.quizCodeInput}
              onChange={evt =>
                this.setState({ quizCodeInput: evt.target.value })
              }
            />
          </div>
          <br />
          <div className="input-group">
            <label htmlFor="inputName">Team name</label>
            <input
              type="text"
              id="inputName"
              className="form-control"
              value={this.state.teamNameInput}
              onChange={evt =>
                this.setState({ teamNameInput: evt.target.value })
              }
            />
          </div>
          <br />

          <button
            className="btn btn-primary"
            onClick={async () => {
              this.props.doSetTeamNameAction(this.state.teamNameInput);
              await this.props.doJoinQuizAction(
                this.state.quizCodeInput,
                this.state.teamNameInput
              );
              if (!this.props.error) {
                this.props.doConnectWebsocket('ws://localhost:4000');
                this.props.history.push('/pending');
              } else {
                setTimeout(() => {
                  this.props.doRemoveErrorClick();
                }, 2000)
              }
            }}
          >
            Continue
          </button>
        </div>
        <div className="col">
          {this.props.error ? (
              <div className="alert alert-danger">
                    <span key={this.props.error}>{this.props.error}</span>
                <div className={'error-message-close-icon float-right'} onClick={this.props.doRemoveErrorClick.bind(this)}>
                  <span>&#10006;</span>
                </div>
              </div>
          ) : (
              <></>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quizCode: state.quiz.quizCode,
    teamName: state.team.teamName,
    error: state.quiz.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doSetTeamNameAction: teamName => dispatch(setTeamNameAction(teamName)),
    doJoinQuizAction: (quizCode, teamName) =>
      dispatch(joinQuizAction(quizCode, teamName)),
    doConnectWebsocket: host => dispatch(wsConnect(host)),
    doRemoveErrorClick: () => dispatch(removeErrorAction())
  };
}

export const JoinQuiz = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  JoinQuizUI
);
