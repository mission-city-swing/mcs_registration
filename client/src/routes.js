import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home';

const Routes = (props) => (
  <Switch {...props}>
    <Route path="/" component={Home} />
  </Switch>
);

export default Routes;
