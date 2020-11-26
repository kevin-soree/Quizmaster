import React from 'react';
import * as ReactRedux from 'react-redux';

class JoinPendingUI extends React.Component {
  render() {
    return <h1>Pending... </h1>;
  }

  // Component updates if approval changes
  componentDidUpdate(prevProps, prevState) {
    if (this.props.approved) {
      this.props.history.push('/approved');
    } else {
      this.props.history.push('/declined');
    }
  }
}

function mapStateToProps(state) {
  return {
    approved: state.team.approved
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export const JoinPending = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinPendingUI);
