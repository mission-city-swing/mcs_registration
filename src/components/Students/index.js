// @flow
// src/components/Students/index.js

import React, { PureComponent } from "react";
import { Form, FormGroup, } from 'reactstrap';
import queryString from 'query-string';
import StudentInfoForm from "../NewStudentForm/form.js";
import StudentCheckinList from "./checkins.js";
import ProfileAdminInfoForm from "./infoForm.js";
import { getProfiles } from "../../lib/api.js";
import { sortByNameAndEmail } from "../../lib/utils.js";

type State = {};

type Props = {};

class StudentPage extends PureComponent<Props, State> {

  state: State = {
  	selected: "",
    profileList: []
  };

  componentDidMount() {
    if (this.props.location) {
      if (this.props.location.search) {
        var parsedSearch = queryString.parse(this.props.location.search);
        this.setState({
          selected: parsedSearch["email"]
        });
      }
    }

    getProfiles.on("value", (snapshot) => {
      var profiles = [];
      var snapshotVal = snapshot.val();
      if (snapshotVal) {
        profiles = Object.values(snapshotVal).map((profile) => {
          return {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email
          };
        });
      }
      profiles.sort(sortByNameAndEmail)
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
        <div>
          <p>Select a student to view or update.</p>
          <Form>
            <FormGroup>
              <select onChange={this.onCheckinSelectChange} value={this.state.selected}>
                <option value="">Please Select a Student</option>
                {this.state.profileList.map((profile) => {
                  return(
                    <option key={profile.email} value={profile.email}>{profile.firstName} {profile.lastName}</option>
                  )
                })}
              </select>
            </FormGroup>
          </Form>
        </div>
        <br></br>
        <div>
          <ProfileAdminInfoForm {...this.props} ></ProfileAdminInfoForm>
        </div>
        <br></br>
        <hr/>
        <div>
          <StudentCheckinList {...this.props} ></StudentCheckinList>
        </div>
        <br></br>
        <hr/>
        <div>
          <h4>Update Student Info</h4>
          <StudentInfoForm {...this.props} ></StudentInfoForm>
        </div>
      </div>
    );
  }
}

export default StudentPage;

