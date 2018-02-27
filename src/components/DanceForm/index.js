// @flow
// src/components/DanceForm/index.js
import React, { PropTypes, PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import type { Dance } from "../../types.js";
// import { addNewDance } from "../../lib/api.js";

Moment.locale('en');
momentLocalizer();

type State = Dance;

type Props = {};

class DanceForm extends PureComponent<Props, State> {
  state: State = {
    date: new Date(),
    info: ""
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
      info: ""
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    console.log(this.state);
    // addNewDance(this.state);
    // Clear the form
    this.clearForm();
  };

  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>Dance</h1>
        <p>Create a new dance object!</p>
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
            <Label for="info">Dance Info</Label><Input type="textarea" placeholder="Whatever dance info you want, maybe a FB link" onChange={this.onChange} value={this.state.info} name="info" />
          </FormGroup>
          <Button type="submit" value="Submit">Submit</Button>
        </Form>

        <br></br>
        <div>
        <code>{JSON.stringify(this.state)}</code>
        </div>
        <br></br>

        <div>
        <h2>List Dances</h2>
        <ul>
          <li>Dance 1, fake links</li>
          <li>Dance 2, fake links</li>
          <li>Dance 3, fake links</li>
        </ul>
        </div>
      </div>
    );
  }
}

export default DanceForm;
