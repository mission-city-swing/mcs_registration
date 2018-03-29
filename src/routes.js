import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home';
import { NewUserForm, SignInUserForm } from './components/User';
import NewStudent from './components/NewStudentForm';
import ReturningStudent from './components/ReturningStudentForm';
import Dance from './components/DanceForm';
import DanceCheckinForm from './components/DanceCheckinForm';

const Routes = (props) => (
  <Switch {...props}>
    <Route exact path="/" component={Home} />
    <Route path="/new-user" component={NewUserForm} />
    <Route path="/signin" component={SignInUserForm} />
    <Route path="/new-student" component={NewStudent} />
    <Route path="/returning" component={ReturningStudent} />
    <Route path="/dance" component={Dance} />
    <Route path="/dance-checkin" component={DanceCheckinForm} />
  </Switch>
);

export default Routes;
