// @flow
// src/components/DanceForm/index.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import type { Checkin } from "../../types.js";
// import { addNewDance } from "../../lib/api.js";

type State = Checkin;

type Props = {};

class ReturningStudentForm extends PureComponent<Props, State> {
  state: State = {
    date: new Date(),
    email: "",
    info: "",
    checkinType: []
  };

  onChange = (event: any) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value
    });
  };

  onDateChange = (value) => {
    this.setState({
      date: value
    });
  };

  // For use with multi-change with response types, e.g., Fundamentals vs Intermediate
  getTypeIndex = (list, typeStr) => {
    for (var i = 0; i < list.length; i++) {
        if (list[i].indexOf(typeStr) !== -1 ) {
          return(i);
        }
    }
    return(-1);
  };

  onMultiTypeChange = (event: any) => {
    const name = event.target.name;
    const checked = event.target.checked;
    const value = event.target.value;
    const valueType = value.split(', ')[0];

    var newArray = this.state[name].slice()
    var typeIndex = this.getTypeIndex(newArray, valueType);
    var valueIndex = newArray.indexOf(value);
    if (checked) {
      if (typeIndex === -1) {
        newArray.push(value);
      } else {
        newArray.splice(typeIndex, 1);
        newArray.push(value);
      }
    } else {
      newArray.splice(valueIndex, 1);
    }

    this.setState({
      [name]: newArray
    });
  };

  clearForm() {
    this.setState({
      date: new Date(),
      email: "",
      info: "",
      checkinType: []
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

    return (
      <div className="App">
        <h1>Returning Student</h1>
        <p>Welcome back! Please select today's date and enter your email to sign in!</p>
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
          <br></br>
          <FormGroup tag="fieldset">
            <legend>Checking in for... (Select all that apply.)</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="checkinType" checked={this.state.checkinType.indexOf('WCS Fundamentals, Drop-in') !== -1} value="WCS Fundamentals, Drop-in" /> {' '} WCS Fundamentals, Drop-in
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="checkinType" checked={this.state.checkinType.indexOf('WCS Fundamentals, Monthly Series') !== -1} value="WCS Fundamentals, Monthly Series" /> {' '} WCS Fundamentals, Monthly Series
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="checkinType" checked={this.state.checkinType.indexOf('Intermediate WCS, Drop-in') !== -1} value="Intermediate WCS, Drop-in" /> {' '} Intermediate WCS, Drop-in
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="checkinType" checked={this.state.checkinType.indexOf('Intermediate WCS, Monthly Series') !== -1} value="Intermediate WCS, Monthly Series" /> {' '} Intermediate WCS, Monthly Series
              </Label>
            </FormGroup>
          </FormGroup>
          <br></br>
          <FormGroup>
            <Label for="info">Additional Info</Label><Input type="textarea" placeholder="Not necessary, but if you need to make a note about this check-in event, you can!" onChange={this.onChange} value={this.state.info} name="info" />
          </FormGroup>
          <br></br>
          <Button type="submit" value="Submit">Submit</Button>
        </Form>

        <br></br>
        <div>
        <code>{JSON.stringify(this.state)}</code>
        </div>
        <br></br>

      </div>
    );
  }
}

export default ReturningStudentForm;
