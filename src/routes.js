import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home';
import NewStudent from './components/NewStudentForm';

const Routes = (props) => (
  <Switch {...props}>
    <Route exact path="/" component={Home} />
    <Route path="/new" component={NewStudent} />
  </Switch>
);

export default Routes;
