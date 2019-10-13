// @flow
// src/components/Users/index.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import type { User } from "../../types.js";
import { addNewUser } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js";
import { CodeOfConductModalLink } from "../Utilities/conductModal.js";
import { LiabilityWaiverModalLink } from "../Utilities/waiverModal.js";

type State = User;

type Props = {};

class NewUserForm extends PureComponent<Props, State> {
  state: State = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    success: "",
    error: "",
    waiverAgree: false,
    conductAgree: false
  };

  onChange = (event: any) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  clearForm() {
    this.setState({
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    });
  };

  afterWaiverConfirm(args) {
    this.setState({waiverAgree: args.agree});
  }

  afterConductConfirm(args) {
    this.setState({conductAgree: args.agree});
  }

  clearFormEvent = (event: any) => {
    event.preventDefault();
    this.clearForm();
  };

  toggleAlerts(event: any) {
    this.setState({
      success: "",
      error: ""
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    var onSuccess = () => {
      var successText = "Created new user for " + this.state.email;
      this.setState({success: successText});
      window.location.href = "/?success=" + encodeURIComponent(successText);
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
    }
    try {
      addNewUser({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        waiverAgree: this.state.waiverAgree,
        conductAgree: this.state.conductAgree
      }).then(function() {
        onSuccess()
      }).catch((error) => {
        onError(error.toString())
      })
    } catch(error) {
      onError(error.toString())
    }
  };

  render() {

    return (
      <div className="App">
        <h1>New User</h1>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="firstName">First Name</Label><Input placeholder="First Name" value={this.state.firstName} onChange={this.onChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name</Label><Input placeholder="Last Name" onChange={this.onChange} value={this.state.lastName} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onChange} value={this.state.email} type="email" id="email" name="email" />
          </FormGroup>
          <FormGroup>
            <Label form="password" type="password">Password</Label><Input onChange={this.onChange} value={this.state.password} type="password" id="password" name="password" />
          </FormGroup>
          <br></br>
          <h5>Legal Stuff</h5>
          <LiabilityWaiverModalLink checked={this.state.waiverAgree} afterConfirm={this.afterWaiverConfirm.bind(this)}  />
          <br></br>
          <CodeOfConductModalLink checked={this.state.conductAgree} afterConfirm={this.afterConductConfirm.bind(this)} />
          <br></br>
          <Button color="primary" type="submit" value="Submit">Submit</Button>
          <span className="mr-1"></span>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
        </Form>
      </div>
    );
  }
}

export default NewUserForm;
