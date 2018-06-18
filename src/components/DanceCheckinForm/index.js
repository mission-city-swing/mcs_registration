// @flow
// src/components/DanceCheckinForm/index.js
import React, { PureComponent } from "react";
import DanceCheckinForm from "./form.js";
import ErrorBoundary from "../Utilities/catch.js";

type Props = {};

class DanceCheckinPage extends PureComponent<Props, State> {

  addActionsOnSubmit = (options = null) => {
    var toUrl = "/";
    if (options.success || options.error) {
      toUrl = toUrl + "?"
      if (options.success) {
        toUrl = toUrl + "success=" + options.success
      }
      if (options.error) {
        toUrl = toUrl + "error=" + options.error
      }
    }
    this.props.history.push(toUrl);
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="App">
        <h1>Dance</h1>
        <p>Create a new dance checkin object!</p>
        <ErrorBoundary>
	        <DanceCheckinForm addActionsOnSubmit={this.addActionsOnSubmit}></DanceCheckinForm>
        </ErrorBoundary>
      </div>
    );
  }
}

export default DanceCheckinPage;
