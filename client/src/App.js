// src/components/App/index.js
import React, { PropTypes, Component } from 'react';

import Routes from './routes';

class App extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { ...props } = this.props;
    return (
      <Routes />
    );
  }
}

export default App;

