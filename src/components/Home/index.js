// src/components/DanceForm/index.js
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>Mission City Swing Registration</h1>
        <div className="">
          <Link className="option" to="/new">New Student</Link>
          <Link className="option" to="/returning">Returning Student</Link>
          <Link className="option" to="/dance">Dance</Link>
        </div>
      </div>
    );
  }
}

export default Home;