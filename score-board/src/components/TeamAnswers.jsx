import React from "react";

export class TeamAnswers extends React.Component {
	render() {
		if (this.props.teams && this.props.round) {
			return (
				<table className="table">
					<thead>
						<tr>
							<th scope="col">Team</th>
							<th scope="col">Question answered</th>
							<th scope="col">Correct answers</th>
							{this.props.round.closed ? <th scope="col">Answer</th> : null}
							{this.props.round.closed ? <th scope="col">Correct?</th> : null}
						</tr>
					</thead>
					<tbody>
						{this.createTableRows(
							this.props.teams,
							this.props.round.teamAnswers,
							this.props.round.currentQuestionId,
							this.props.round.closed
						)}
					</tbody>
				</table>
			);
		} else {
			return <div></div>;
		}
	}

  createTableRows(teams, teamAnswers, currentQuestionId, closed) {
    return teams.map(team => {
        const teamAnswer = teamAnswers.find(ta => ta.teamName === team.name && ta.questionId === currentQuestionId);
      return (
        <tr key={team.name}>
          <td>{team.name}</td>
          <td>
            {teamAnswer !== undefined
              ? 'Yes'
              : 'No'}
          </td>
            <td>
                {teamAnswers.filter(ta => ta.teamName === team.name && ta.correctAnswer === true).length}
            </td>
            {closed ? <td>
                {teamAnswer ? teamAnswer.answer : '<empty>'}
            </td> : null}
            {closed ? <td>
                {teamAnswer && (teamAnswer.correctAnswer === undefined || teamAnswer.correctAnswer === null) ? <span className="text-info">Evaluating..</span> : null}
                {teamAnswer && (teamAnswer.correctAnswer === true) ? <span className="text-success">Yes</span> : null}
                {teamAnswer && (teamAnswer.correctAnswer === false) ? <span className="text-danger">No</span> : null}
            </td> : null}
        </tr>
      );
    });
  }
}
