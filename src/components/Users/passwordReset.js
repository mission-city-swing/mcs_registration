// @flow
// src/components/Users/index.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import type { User } from "../../types.js";
import { sendResetEmail } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js"

type State = User;

type Props = {};

class SignInUserForm extends PureComponent<Props, State> {
  state: State = {
    email: "",
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
      email: ""
    });
  };

  setSuccess() {
    this.setState({success: "An email has been sent to " + this.state.email});
  }

  onSubmit = (event: any) => {
    event.preventDefault();
    try {
      sendResetEmail({email: this.state.email})
      this.setSuccess()
    } catch(error) {
      this.setState({error: error.toString()})
    }
    // Clear the form
    this.clearForm();
  };

  render() {

    return (
      <div className="App">
        <h1>Sign In</h1>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onChange} value={this.state.email} type="email" id="email" name="email" />
          </FormGroup>
          <br></br>
          <Button type="submit" value="Submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default SignInUserForm;
