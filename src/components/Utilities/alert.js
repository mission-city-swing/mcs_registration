// @flow
// src/components/Utilities/alert.js
import React from 'react';
import { Alert } from 'reactstrap';

class McsAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true, 
      elementId: "alert-" + this.props.color + "-" + this.props.text.length,
      onToggle: this.props.onToggle ? this.props.onToggle : () => { this.setState({visible: !this.state.visible}) }
    };
  }

  componentDidUpdate() {
    if (this.state.visible && this.props.text.length > 0) {
      var alertRect = document.getElementById(this.state.elementId).getBoundingClientRect()
      window.scrollTo({
        top: Math.abs(alertRect.top),
        behavior: "smooth"
      });
    }
  }

  render() {
    return (
      <Alert id={this.state.elementId} color={this.props.color} isOpen={this.state.visible && this.props.text.length > 0} toggle={this.state.onToggle}>
        {this.props.text}
      </Alert>
    );
  }
}

export default McsAlert;
