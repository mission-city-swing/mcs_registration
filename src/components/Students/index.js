// @flow
// src/components/Students/index.js

import React, { PureComponent } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import queryString from 'query-string';

import StudentInfoForm from "../NewStudentForm/form.js";
import StudentCheckinList from "./checkins.js";
import ProfileAdminInfoForm from "./infoForm.js";
import { getProfiles, getProfileByEmail } from "../../lib/api.js";
import { sortByNameAndEmail } from "../../lib/utils.js";

type State = {};

type Props = {};

class StudentPage extends PureComponent<Props, State> {

  state: State = {
  	selected: "",
    profileList: [],
    selectedProfile: null
  };

  componentDidMount() {
    if (this.props.location) {
      if (this.props.location.search) {
        var parsedSearch = queryString.parse(this.props.location.search);
        this.setState({
          selected: parsedSearch["email"]
        });
        this.getStudentFromEmail(parsedSearch["email"]);
      }
    }

    getProfiles.on("value", (snapshot) => {
      var profiles = [];
      var snapshotVal = snapshot.val();
      if (snapshotVal) {
        profiles = Object.values(snapshotVal).map((profile) => {
          return {
            firstName: profile.profile.firstName,
            lastName: profile.profile.lastName,
            email: profile.profile.email
          };
        });
      }
      profiles.sort(sortByNameAndEmail)
      this.setState({profileList: profiles});
    });
  };

  getStudentFromEmail = (studentEmail) => {
    getProfileByEmail(studentEmail).on("value", (snapshot) => {
      if (snapshot.val()) {
        var selected = snapshot.val()
        selected["label"] = selected.profile.firstName + " " + selected.profile.lastName;
        this.setState({selectedProfile: selected})
      }
    });
  };

  onStudentTypeaheadChange = (value) => {
    if (value && value.length) {
      this.setState({
        selected: value[0].id
      });
      window.location.href = "/admin/student?email=" + encodeURIComponent(value[0].id);
    }
  };

  render() {

    return (
      <div className="App">
        <h1>Students</h1>
        <div>
          <p>Select a student to view or update.</p>
          <Typeahead
            placeholder="Please select a student"
            onChange={this.onStudentTypeaheadChange}
            options={this.state.profileList.map((profile) => { return {"id": profile.email, "label": profile.firstName + " " + profile.lastName} })}
            selected={this.state.selectedProfile ? [this.state.selectedProfile] : null}
          />
          <br></br>
          <hr></hr>
          <br></br>
        </div>
        {this.state.selected && 
        <div>
          <h4>Student Info Summary</h4>
          <pre>{JSON.stringify(this.state.selectedProfile, null, '\t')}</pre>
        </div>
        }
        <br></br>
        <div>
          <StudentCheckinList {...this.props} ></StudentCheckinList>
        </div>
        <br></br>
        <div>
          <ProfileAdminInfoForm {...this.props} ></ProfileAdminInfoForm>
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

