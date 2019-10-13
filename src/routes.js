import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/Home/index.js';
import AdminHome from './components/Home/adminIndex.js';
import SignInUserForm from './components/Users';
import NewUserForm from './components/Users/new.js';
import ResetPasswordForm from './components/Users/passwordReset.js';
import NewStudentPage from './components/NewStudentForm/index.js';
import AdminNewStudentPage from './components/NewStudentForm/adminIndex.js';
import ReturningStudentPage from './components/ReturningStudentForm';
import Dance from './components/DanceForm';
import Event from './components/EventForm';
import DanceCheckinPage from './components/DanceCheckinForm';
import EventCheckinPage from './components/EventCheckinForm';
import StudentPage from './components/Students';
import PrivateRoute from './lib/privateRoute';

const Routes = (props) => (
  <Switch {...props}>
    <Route exact path="/" component={Home} />
    <Route path="/signin" component={SignInUserForm} />
    <Route path="/new-user" component={NewUserForm} />
    <PrivateRoute path="/new-student" component={NewStudentPage} />
    <PrivateRoute adminRoute="true" path="/class-checkin" component={ReturningStudentPage} />
    <PrivateRoute adminRoute="true" path="/dance-checkin" component={DanceCheckinPage} />
    <PrivateRoute adminRoute="true" path="/event-checkin" component={EventCheckinPage} />
    <PrivateRoute adminRoute="true" path="/admin/new-student" component={AdminNewStudentPage} />
    <PrivateRoute adminRoute="true" path="/admin/dance" component={Dance} />
    <PrivateRoute adminRoute="true" path="/admin/event" component={Event} />
    <PrivateRoute adminRoute="true" path="/admin/reset-password" component={ResetPasswordForm} />
    <PrivateRoute adminRoute="true" path="/admin/student" component={StudentPage} />
    <PrivateRoute adminRoute="true" path="/admin/" component={AdminHome} />
    <Redirect to="/" />
  </Switch>
);

export default Routes;
