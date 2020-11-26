import React from 'react';
import * as ReactRedux from 'react-redux';

class JoinDeclinedUI extends React.Component {
  componentDidMount() {
    // Go back to join quiz
    setTimeout(() => this.props.history.push('/'), 2000);
  }
  render() {
    return (
      <h1>
        Team rejected!{' '}
        <span className="fa fa-times" style={{ color: 'red' }}></span>
      </h1>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export const JoinDeclined = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinDeclinedUI);
