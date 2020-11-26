import React from 'react';
import './App.css';

import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { Scoreboard } from './Scoreboard';
import { Connect } from './Connect';

function App() {
  return (
    <MemoryRouter initialEntries={['/connect', '/scoreboard']} initialIndex={0}>
      <div className="App">
        <Switch>
          <Route exact path="/connect" component={Connect} />
          <Route exact path="/scoreboard" component={Scoreboard} />
        </Switch>
      </div>
    </MemoryRouter>
  );
}

export default App;
