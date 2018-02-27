// @flow
// src/components/NewStudentForm/index.js
import React, { PropTypes, PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import type { User } from "../../types.js";
import { addNewUser } from "../../lib/api.js";

type State = User;

type Props = {};

class NewStudentForm extends PureComponent<Props, State> {
  state: State = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    discoveryMethod: "",
    student: false
  };

  onChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  };

  clearForm() {
    this.setState({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      discoveryMethod: "",
      student: false
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    console.log(this.state);
    addNewUser(this.state);
    // Clear the form
    this.clearForm();
  };

  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>New Student</h1>
        <p>Some text about the new student stuff</p>
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
            <Label>Phone Number</Label><Input placeholder="123-456-7890" onChange={this.onChange} value={this.state.phoneNumber} type="tel" id="phoneNumber" name="phoneNumber" />
          </FormGroup>
          <br></br>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onChange} name="student" type="checkbox" checked={this.state.student} />
              Student (with valid student ID)
            </Label>
          </FormGroup>
          <br></br>
          <FormGroup tag="fieldset">
            <legend>How did you hear about us?</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'friend'} value="friend" /> {' '} Friend
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'work'} value="work" /> {' '} Work
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'flyer'} value="flyer" /> {' '} Flyer
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'facebook'} value="facebook" /> {' '} Facebook Ad
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'yelp'} value="yelp" /> {' '} Yelp
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'sosh'} value="sosh" /> {' '} Sosh
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'meetup'} value="meetup" /> {' '} Meetup
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'other'} value="other" /> {' '} Other
              </Label>
            </FormGroup>
          </FormGroup>
          <Button type="submit" value="Submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default NewStudentForm;
