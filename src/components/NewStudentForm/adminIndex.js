// @flow
// src/components/NewStudentForm/index.js
import React, { PureComponent } from "react";
import type { Profile } from "../../types.js";
import AdminStudentInfoForm from "./adminForm.js"
import ErrorBoundary from "../Utilities/catch.js"

type State = Profile;

type Props = {};

class AdminNewStudentPage extends PureComponent<Props, State> {
  render() {
    return (
      <div className="App">
        <h1>Create Student (Admin)</h1>
        <p>For admin data entry only.</p>
        <ErrorBoundary>
          <AdminStudentInfoForm></AdminStudentInfoForm>
        </ErrorBoundary>
        <br></br>
      </div>
    );
  }
}

export default AdminNewStudentPage;
