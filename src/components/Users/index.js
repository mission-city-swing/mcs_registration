// @flow
// src/components/Users/index.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import type { User } from "../../types.js";
import { signInUser } from "../../lib/api.js";

type State = User;

type Props = {};

class SignInUserForm extends PureComponent<Props, State> {
  state: State = {
    email: "",
    password: ""
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

  onSubmit = (event: any) => {
    event.preventDefault();
    signInUser(this.state).then(function() {
      window.location.href = "/";
    });
    // Clear the form
    // this.clearForm();
  };

  render() {

    return (
      <div className="App">
        <h1>Sign In</h1>
        <p>Admins only</p>
        <p>Forgot your password? <a href="/reset-password">Reset it here.</a></p>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onChange} value={this.state.email} type="email" id="email" name="email" />
          </FormGroup>
          <FormGroup>
            <Label form="password" type="password">Password</Label><Input onChange={this.onChange} value={this.state.password} type="password" id="password" name="password" />
          </FormGroup>
          <br></br>
          <Button type="submit" value="Submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default SignInUserForm;
