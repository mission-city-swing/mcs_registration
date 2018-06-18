// @flow
// src/components/ReturningStudentForm/index.js
import React, { PureComponent } from "react";
import ReturningStudentForm from "./form.js"
import ErrorBoundary from "../Utilities/catch.js"

type Props = {};

class ReturningStudentPage extends PureComponent<Props, State> {

  addActionsOnSubmit = (options = null) => {
    this.props.history.push('/');
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="App">
        <h1>Returning Student</h1>
        <p>Welcome back! Please select today's date and enter your email to sign in!</p>
        <ErrorBoundary>
	        <ReturningStudentForm {...this.props} addActionsOnSubmit={this.addActionsOnSubmit}></ReturningStudentForm>
        </ErrorBoundary>

      </div>
    );
  }
}

export default ReturningStudentPage;
