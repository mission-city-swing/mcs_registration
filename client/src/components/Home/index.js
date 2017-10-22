// src/components/App/index.js
import React, { PropTypes, Component } from 'react';

import Routes from '../../routes';

type User = {
  id: number,
  name: string,
};

type State = {
  users: Array<User>,
}

class Home extends Component {
  state: State = {users: []};

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

export default Home;