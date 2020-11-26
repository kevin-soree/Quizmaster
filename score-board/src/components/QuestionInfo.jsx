import React from 'react';

export class QuestionInfo extends React.Component {
  render() {
    if (this.props.question) {
      return (
        <div className="text-left">
          <h2>Question: {this.props.question.question}</h2>
          <h2>Category: {this.props.question.category}</h2>
          {this.props.questionClosed ? <h2>Answer: {this.props.question.answer}</h2> : null}
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
