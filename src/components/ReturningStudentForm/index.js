// @flow
// src/components/ReturningStudentForm/index.js
import React, { PureComponent } from "react";
import ReturningStudentForm from "./form.js";
import ErrorBoundary from "../Utilities/catch.js";

type Props = {};

class ReturningStudentPage extends PureComponent<Props, State> {

  addActionsOnSubmit = (options = null) => {
    var toUrl = "/";
    if (options.success || options.error) {
      toUrl = toUrl + "?";
      if (options.success) {
        toUrl = toUrl + "success=" + encodeURIComponent(options.success);
      }
      if (options.error) {
        toUrl = toUrl + "error=" + encodeURIComponent(options.error);
      }
    }
    this.props.history.push(toUrl);
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="App">
        <h1>Class Checkin</h1>
        <p>Fill out this form to check in for class. Please select today's date and your email address to sign in.</p>
        <ErrorBoundary>
	        <ReturningStudentForm {...this.props} addActionsOnSubmit={this.addActionsOnSubmit}></ReturningStudentForm>
        </ErrorBoundary>

      </div>
    );
  }
}

export default ReturningStudentPage;
