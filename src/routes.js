import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home';
import NewStudent from './components/NewStudentForm';
import ReturningStudent from './components/ReturningStudentForm';
import Dance from './components/DanceForm';

const Routes = (props) => (
  <Switch {...props}>
    <Route exact path="/" component={Home} />
    <Route path="/new" component={NewStudent} />
    <Route path="/returning" component={ReturningStudent} />
    <Route path="/dance" component={Dance} />
  </Switch>
);

export default Routes;
