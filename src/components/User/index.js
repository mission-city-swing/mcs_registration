// @flow
// src/components/NewStudentForm/index.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import type { User } from "../../types.js";
import { addNewUser, signInUser } from "../../lib/api.js";

type State = User;

type Props = {};

class NewUserForm extends PureComponent<Props, State> {
  state: State = {
    firstName: "",
    lastName: "",
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
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    addNewUser(this.state);
    // Clear the form
    this.clearForm();
  };

  render() {

    return (
      <div className="App">
        <h1>New User</h1>
        <p>Just admin stuff</p>
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
          <Button type="submit" value="Submit">Submit</Button>
        </Form>

        <br></br>
        <div>
        {/*<code>{JSON.stringify(this.state)}</code>*/}
        </div>
        <br></br>

      </div>
    );
  }
}

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
    // Validate form
    signInUser(this.state);
    // Clear the form
    this.clearForm();
  };

  render() {

    return (
      <div className="App">
        <h1>Sign In</h1>
        <p>Admins only</p>
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

        <br></br>
        <div>
        {/*<code>{JSON.stringify(this.state)}</code>*/}
        </div>
        <br></br>

      </div>
    );
  }
}

export { NewUserForm, SignInUserForm };
