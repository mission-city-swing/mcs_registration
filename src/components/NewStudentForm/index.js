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
    this.props.history.push('/class-checkin?email=' + encodeURIComponent(options.email) + "&new-dancer=true");
    window.scrollTo(0, 0);
  }

  render() {

    return (
      <div className="App">
        <h1>New Student</h1>
        <p>Add a new student!</p>
        <ErrorBoundary>
          <StudentInfoForm addActionsOnSubmit={this.addActionsOnSubmit}></StudentInfoForm>
        </ErrorBoundary>
        <br></br>
      </div>
    );
  }
}

export default NewStudentPage;
