// @flow
// src/components/Users/index.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import type { User } from "../../types.js";
import { signInUser } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js";

type State = User;

type Props = {};

class SignInUserForm extends PureComponent<Props, State> {
  state: State = {
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

  clearForm() {
    this.setState({
      email: "",
      password: ""
    });
  };

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
      var successText = "Signed in admin user for " + this.state.email;
      this.setState({success: successText});
      window.location.href = "/?success=" + encodeURIComponent(successText);
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
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
      <div className="App">
        <h1>Sign In</h1>
        <p>Admins only</p>
        <p>Forgot your password? <a href="/reset-password">Reset it here.</a></p>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onChange} value={this.state.email} type="email" id="email" name="email" />
          </FormGroup>
          <FormGroup>
            <Label form="password" type="password">Password</Label><Input onChange={this.onChange} value={this.state.password} type="password" id="password" name="password" />
          </FormGroup>
          <br></br>
          <Button color="primary" type="submit" value="Submit">Submit</Button>
          <span className="mr-1"></span>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
        </Form>
      </div>
    );
  }
}

export default SignInUserForm;
