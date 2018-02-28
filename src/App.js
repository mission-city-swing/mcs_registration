// src/components/App/index.js
import React, { Component } from 'react';

import Routes from './routes';
import MyNavbar from './navbar';

class App extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {

    return (
      <div>
        <MyNavbar />
        <Routes />
      </div>
    );
  }
}

export default App;
