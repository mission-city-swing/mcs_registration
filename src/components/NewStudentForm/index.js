// @flow
// src/components/NewStudentForm/index.js
import React, { PureComponent } from "react";
import type { Profile } from "../../types.js";
import StudentInfoForm from "./form.js"
import ErrorBoundary from "../Utilities/catch.js"

type State = Profile;

type Props = {};

class NewStudentPage extends PureComponent<Props, State> {

  addActionsOnSubmit = (options = null) => {
    var newDancer = options.newDancer ? "&new-dancer=true" : "";
    var toUrl = "/class-checkin?email=" + encodeURIComponent(options.email) + newDancer;
    this.props.history.push(toUrl);
    window.scrollTo(0, 0);
  }

  render() {

    return (
      <div className="App">
        <h1>New Student</h1>
        <p>Welcome to Mission City Swing! Please fill out this form before you check in for class.</p>
        <ErrorBoundary>
          <StudentInfoForm addActionsOnSubmit={this.addActionsOnSubmit}></StudentInfoForm>
        </ErrorBoundary>
        <br></br>
      </div>
    );
  }
}

export default NewStudentPage;
