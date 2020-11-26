import React from 'react';
import '../App.css';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { JoinQuiz } from './JoinQuiz';
import { JoinPending } from './JoinPending';
import { JoinApproved } from './JoinApproved';
import { JoinDeclined } from './JoinDeclined';
import { AnswerQuestion } from './AnswerQuestion';
function App() {
  return (
    <MemoryRouter>
      <div>
        <Switch>
          <Route exact path="/" component={JoinQuiz} />
          <Route path="/pending" component={JoinPending} />
          <Route path="/approved" component={JoinApproved} />
          <Route path="/declined" component={JoinDeclined} />
          <Route path="/answerQuestion" component={AnswerQuestion} />
        </Switch>
      </div>
    </MemoryRouter>
  );
}

export default App;
