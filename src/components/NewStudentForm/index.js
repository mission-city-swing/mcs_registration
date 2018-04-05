// @flow
// src/components/NewStudentForm/index.js
import React, { PureComponent } from "react";
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import type { Profile } from "../../types.js";
// import { addNewProfile } from "../../lib/api.js";
import StudentInfoForm from "./form.js"
import ReturningStudentForm from "../ReturningStudentForm/form.js"

type State = Profile;

type Props = {};

class NewStudentPage extends PureComponent<Props, State> {

  render() {

    return (
      <div className="App">
        <h1>New Student</h1>
        <p>Add a new student!</p>
        <StudentInfoForm></StudentInfoForm>
        <br></br>
        <hr/>
        <br></br>
        <h2>Class Checkin</h2>
        <ReturningStudentForm></ReturningStudentForm>
      </div>
    );
  }
}

export default NewStudentPage;
