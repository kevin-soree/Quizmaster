import React from 'react';

export class TeamScores extends React.Component {
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Team</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>{this.createTableRows(this.props.teams)}</tbody>
      </table>
    );
  }

  createTableRows(teams) {
    return teams.map((team, i) => {
      return (
        <tr key={i}>
          <td>{team.name}</td>
          <td>{team.score}</td>
        </tr>
      );
    });
  }
}
