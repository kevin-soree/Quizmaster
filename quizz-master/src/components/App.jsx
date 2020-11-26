import React from 'react';
import '../App.css';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { CreateQuiz } from './CreateQuiz';
import { QuizLobby } from './QuizLobby';
import { RoundSetup } from './round-setup/RoundSetup';
import { RoundOverview } from './round-overview/RoundOverview';
import NextRound from './round-overview/NextRound';

function App() {
  return (
    <MemoryRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={CreateQuiz} />
          <Route path="/lobby" component={QuizLobby} />
          <Route path="/round-setup" component={RoundSetup} />
          <Route path="/roundOverview" component={RoundOverview} />
          <Route path="/nextRound" component={NextRound} />
        </Switch>
      </div>
    </MemoryRouter>
  );
}

export default App;
