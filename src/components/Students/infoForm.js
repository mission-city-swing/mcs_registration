// @flow
// src/components/Students/infoForm.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import queryString from 'query-string';
import type { ProfileAdminInfo } from "../../types.js";
import { createOrUpdateProfileAdminInfo, getProfileByEmail } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js"


type State = ProfileAdminInfo;

type Props = {};

class ProfileAdminInfoForm extends PureComponent<Props, State> {

  defaultFields = {
    completedFundamentals: false,
    guest: false,
    info: ""
  }

  state: State = {
    email: "",
    adminInfo: {...this.defaultFields},
    success: "",
    error: ""
  }

  componentDidMount() {
    this.getStudentFromQuery();
  };

  getStudentFromQuery = () => {
    if (this.props.location) {
      var parsedSearch = queryString.parse(this.props.location.search);
      if (this.props.location.search) {
        var studentEmail = parsedSearch["email"];
        this.getStudentFromEmail(studentEmail);
      }
    }
  };

  getStudentFromEmail = (studentEmail) => {
    getProfileByEmail(studentEmail).on("value", (snapshot) => {
      if (snapshot.val()) {
        var adminInfo = snapshot.val()["adminInfo"] ? snapshot.val()["adminInfo"] : {};
        var newAdminInfo = Object.assign({...this.state.adminInfo}, adminInfo)
        this.setState({email: studentEmail, adminInfo: newAdminInfo});
      }
    });
  }

  onAdminInfoChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    var newAdminInfo = {...this.state.adminInfo}
    newAdminInfo[name] = value;
    this.setState({adminInfo: newAdminInfo});
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
  };

  clearForm() {
    this.setState({adminInfo: {...this.defaultFields}});
  };

  toggleAlerts(event: any) {
    this.setState({
      success: "",
      error: ""
    });
  };

  onSubmit = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    // Validate form
    var onSuccess = () => {
      var successText = "Updated admin info for " + this.state.email
      this.setState({success: successText});
      // this.addActionsOnSubmit({email: this.state.email});
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
      window.scrollTo(0, 0);
    }
    try {
      var fullInfo = Object.assign({...this.state.adminInfo}, {email: this.state.email});
      createOrUpdateProfileAdminInfo(fullInfo).then(function(success) {
        onSuccess();
      }).catch(function(error) {
        onError(error.toString());
      })
    } catch(error) {
      onError(error.toString());
    }
  };

  render() {

    return (
      <div>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onAdminInfoChange} name="completedFundamentals" type="checkbox" checked={this.state.adminInfo.completedFundamentals} />
              <strong>Student has completed the fundamentals program</strong>
            </Label>
          </FormGroup>
          <br></br>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onAdminInfoChange} name="guest" type="checkbox" checked={this.state.adminInfo.guest} />
              <strong>Patron is a guest of MCS</strong>
            </Label>
          </FormGroup>
          <br></br>
          <FormGroup>
            <Label for="info">Other Info</Label><Input type="textarea" placeholder="Misc info" onChange={this.onAdminInfoChange} value={this.state.adminInfo.info} name="info" />
          </FormGroup>
          <br></br>
          <Button color="primary" value="submit" name="submit" onClick={this.onSubmit}>Update</Button>
          <span className="mr-1"></span>
          <Button value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
        </Form>
      </div>
    );
  }
}

export default ProfileAdminInfoForm;
