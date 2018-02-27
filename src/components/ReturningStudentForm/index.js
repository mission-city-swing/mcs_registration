// @flow
// src/components/DanceForm/index.js
import React, { PropTypes, PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import type { Checkin } from "../../types.js";
// import { addNewDance } from "../../lib/api.js";

type State = Checkin;

type Props = {};

class ReturningStudentForm extends PureComponent<Props, State> {
  state: State = {
    date: new Date(),
    email: ""
  };

  onChange = (event: any) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value
    });
  };

  onDateChange = (value) => {
    this.setState({
      ['date']: value
    });
  };

  clearForm() {
    this.setState({
      date: new Date(),
      email: ""
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    console.log(this.state);
    // addNewCheckin(this.state);
    // Clear the form
    this.clearForm();
  };

  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>New Student</h1>
        <p>Some text about returning  students</p>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="date">Dance Date</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={this.state.date}
              name="date"
              onChange={this.onDateChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Student Email</Label><Input type="email" placeholder="me@example.com" onChange={this.onChange} value={this.state.email} name="email" />
          </FormGroup>
          <Button type="submit" value="Submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default ReturningStudentForm;
