// @flow
// src/components/Utilities/appDate.js

import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input, DropdownItem } from 'reactstrap';
import { getCurrentUser, signInUser } from "../../lib/api.js";


type State = {};

type Props = {};

class CurrentUserNavForm extends PureComponent<Props, State> {
  state: State = {
    currentUser: getCurrentUser(),
    email: "",
    password: "",
    success: "",
    error: ""
  };

  onChange = (event: any) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
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
      var successText = "Signed in admin user " + this.state.email;
      this.setState({
        success: successText,
        currentUser: getCurrentUser(),
      });
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
      window.location.href = "/admin/signin?error=" + encodeURIComponent(errorText) + "&email=" + this.state.email;
    }
    try {
      signInUser({
        email: this.state.email,
        password: this.state.password
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
      <div>
      {!this.state.currentUser && 
        <div className="signin-nav-form">
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onChange} value={this.state.email} type="email" id="admin-email" name="email" />
            </FormGroup>
            <FormGroup>
              <Label form="password" type="password">Password</Label><Input onChange={this.onChange} value={this.state.password} type="password" id="admin-password" name="password" />
            </FormGroup>
            <Button color="primary" type="submit" value="Submit">Submit</Button>
          </Form>
          <div className="signin-form-info">
            <p>Forgot your password? <a href="/admin/reset-password">Reset it here.</a></p>
            <p>Create an admin account <a href="/admin/new-user">here.</a></p>
          </div>
        </div>
      }
      {this.state.currentUser &&
        <DropdownItem header>{this.state.success}</DropdownItem>
      }
      </div>
    );
  }
}

export default CurrentUserNavForm;
