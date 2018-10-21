// @flow
// src/components/Utilities/alert.js
import React from 'react';
import ReactTimeout from 'react-timeout';
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
      // Scroll up to the alert
      var alertRect = document.getElementById(this.state.elementId).getBoundingClientRect()
      window.scrollTo({
        top: window.scrollY + alertRect.top - 50,
        behavior: "smooth"
      });
    }
    if (this.state.visible && this.props.timeout) {
      this.props.setTimeout(this.state.onToggle, this.props.timeout * 1000);
    }
  };

  render() {
    return (
      <Alert id={this.state.elementId} color={this.props.color} isOpen={this.state.visible && this.props.text.length > 0} toggle={this.state.onToggle}>
        {this.props.text}
      </Alert>
    );
  }
}

export default ReactTimeout(McsAlert);
