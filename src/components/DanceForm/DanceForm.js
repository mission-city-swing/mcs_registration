// src/components/App/index.js
import React, { PropTypes, Component } from 'react';

class DanceForm extends Component {
  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>Dance Form</h1>
        <p>HELLO TEST TEST</p>
      </div>
    );
  }
}

export default Home;