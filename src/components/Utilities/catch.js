// @flow
// src/components/Home/catch.js
import React from "react";
import McsAlert from "./alert.js"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorText: ""
    };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    console.log(this.state);
    this.setState({ hasError: true });
    console.log(error);
    console.log(info);
  }

  render() {
    if (this.state.errorInfo) {
      return <McsAlert color="danger" text={this.state.errorText}></McsAlert>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
