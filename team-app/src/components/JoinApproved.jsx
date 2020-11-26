import React from 'react';
import * as ReactRedux from 'react-redux';

class JoinApprovedUI extends React.Component {
  componentDidUpdate() {
    if (this.props.started === true) {
      this.props.history.push('/answerQuestion');
    }
  }
  render() {
    return (
      <div>
        <h1>
          Team approved!
          <span className="fa fa-check" style={{ color: 'green' }}></span>
        </h1>
        <h2>Waiting for quiz to start...</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    started: state.quiz.currentRound > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export const JoinApproved = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinApprovedUI);
