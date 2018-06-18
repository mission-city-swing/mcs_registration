import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/Home';
import SignInUserForm from './components/Users';
import NewUserForm from './components/Users/new.js';
import ResetPasswordForm from './components/Users/passwordReset.js';
import NewStudentPage from './components/NewStudentForm';
import ReturningStudentPage from './components/ReturningStudentForm';
import Dance from './components/DanceForm';
import DanceCheckinPage from './components/DanceCheckinForm';
import StudentPage from './components/Students';

const Routes = (props) => (
  <Switch {...props}>
    <Route exact path="/" component={Home} />
    <Route path="/new-user" component={NewUserForm} />
    <Route path="/signin" component={SignInUserForm} />
    <Route path="/reset-password" component={ResetPasswordForm} />
    <Route path="/new-student" component={NewStudentPage} />
    <Route path="/class-checkin" component={ReturningStudentPage} />
    <Route path="/dance" component={Dance} />
    <Route path="/dance-checkin" component={DanceCheckinPage} />
    <Route path="/student" component={StudentPage} />
    <Redirect to="/" />
  </Switch>
);

export default Routes;
