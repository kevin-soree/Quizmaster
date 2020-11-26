import React from "react";

export class RoundInfo extends React.Component {
  render() {
    if (this.props.quiz.quizCode !== null) {
      return (
        <div className="text-left" style={{ marginLeft: 2 + 'em' }}>
          <h2>Quiz code: {this.props.quiz.quizCode}</h2>
          <h2>Round: {this.props.quiz.currentRound}</h2>
          <h2>
            Question:{' '}
            {this.getCurrentQuestionIndex(
              this.getCurrentRound(
                this.props.quiz.rounds,
                this.props.quiz.currentRound
              ).questions
            )}{' '}
            / {this.getCurrentRound(
              this.props.quiz.rounds,
              this.props.quiz.currentRound
          ).questions.length}
          </h2>
          <h2>Closed: {this.getCurrentRound(this.props.quiz.rounds, this.props.quiz.currentRound).closed ? <span className="text-success">Yes</span> : <span className="text-danger">No</span>}</h2>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

	getCurrentRound(rounds, currentRound) {
		return rounds[currentRound - 1];
	}

	getCurrentQuestionIndex(questions) {
		return questions.filter(question => question.isUsed === true).length;
	}
}
