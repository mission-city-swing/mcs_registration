// src/components/App/index.js
import React, { PropTypes, Component } from 'react';

import Routes from './routes';
import MyNavbar from './navbar';

class App extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { ...props } = this.props;
    return (
      <div>
        <MyNavbar />
        <Routes />
      </div>
    );
  }
}

export default App;
