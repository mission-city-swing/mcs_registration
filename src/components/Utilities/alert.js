// @flow
// src/components/Utilities/alert.js
import React from 'react';
import { Alert } from 'reactstrap';

class McsAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      visible: true
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <Alert color={this.props.color} isOpen={this.state.visible && this.props.text.length > 0} toggle={this.onDismiss}>
        {this.props.text}
      </Alert>
    );
  }
}

export default McsAlert;
