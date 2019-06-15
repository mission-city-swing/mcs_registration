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
import SelfServe from './components/SelfServe';


const Routes = (props) => (
  <Switch {...props}>
    <Route exact path="/" component={Home} />
    <Route path="/new-student" component={NewStudentPage} />
    <Route path="/class-checkin" component={ReturningStudentPage} />
    <Route path="/dance-checkin" component={DanceCheckinPage} />
    <Route path="/event-checkin" component={EventCheckinPage} />
    <Route path="/admin/new-student" component={AdminNewStudentPage} />
    <Route path="/admin/dance" component={Dance} />
    <Route path="/admin/event" component={Event} />
    <Route path="/admin/signin" component={SignInUserForm} />
    <Route path="/admin/new-user" component={NewUserForm} />
    <Route path="/admin/reset-password" component={ResetPasswordForm} />
    <Route path="/admin/student" component={StudentPage} />
    <Route path="/admin/" component={AdminHome} />
    <Route path="/self-serve" component={SelfServe} />
    <Redirect to="/" />
  </Switch>
);

export default Routes;
