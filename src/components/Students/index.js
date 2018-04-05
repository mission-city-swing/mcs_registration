// @flow
// src/components/Students/index.js

import React, { PureComponent } from "react";
import { Form, FormGroup, } from 'reactstrap';
import queryString from 'query-string';
import StudentInfoForm from "../NewStudentForm/form.js"
import { getProfiles } from "../../lib/api.js";

type State = {};

type Props = {};

class StudentPage extends PureComponent<Props, State> {

  state: State = {
  	selected: "",
    profileList: {}
  };

  componentDidMount() {
    console.log(this.props);
    if (this.props.location) {
      var parsedSearch = queryString.parse(this.props.location.search);
      if (this.props.location.search) {
        var studentEmail = parsedSearch["email"];
        console.log(studentEmail);
        this.setState({
          selected: studentEmail
        });
      }
    }

    getProfiles.on("value", (snapshot) => {
      var snapshotVal = snapshot.val();
      var profiles = {};
      Object.keys(snapshotVal).forEach(function(key) {
        profiles[snapshotVal[key].email] = {
          firstName: snapshotVal[key].firstName,
          lastName: snapshotVal[key].lastName,
          email: snapshotVal[key].email
        }
      });
      this.setState({profileList: profiles});
    });
  };

  onCheckinSelectChange = (event: any) => {
    var value = event.target.value;
    this.setState({
      selected: value
    });
    window.location.href = "/student?email=" + encodeURIComponent(value);
  };

  render() {

    return (
      <div className="App">
        <h1>Students</h1>
        <p>Update student Info!</p>
        <Form>
          <FormGroup>
            <select onChange={this.onCheckinSelectChange} value={this.state.selected}>
              <option value="">Please Select a Student</option>
              {Object.keys(this.state.profileList).map((uid) => {
                return(
                  <option key={uid} value={uid}>{this.state.profileList[uid].firstName} {this.state.profileList[uid].lastName}, {this.state.profileList[uid].email}</option>
                )
              })}
            </select>
          </FormGroup>
        </Form>
        <StudentInfoForm {...this.props} ></StudentInfoForm>
      </div>
    );
  }
}

export default StudentPage;

