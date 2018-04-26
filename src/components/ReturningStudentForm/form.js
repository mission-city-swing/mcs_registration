// @flow
// src/components/ReturningStudentForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import type { Checkin } from "../../types.js";
import { addNewClassCheckin, getProfiles } from "../../lib/api.js";
import { getSubstringIndex } from "../../lib/utils.js";

type State = Checkin;

type Props = {};

class ReturningStudentForm extends PureComponent<Props, State> {
  state: State = {
    checkin: {
      date: new Date(),
      email: "",
      info: "",
      classes: []
    },
    profileList: {}
  };

  componentDidMount() {
    getProfiles.on("value", (snapshot) => {
      var snapshotVal = snapshot.val();
      var profiles = {};
      Object.keys(snapshotVal).forEach(function(key) {
        profiles[snapshotVal[key].email] = {
          firstName: snapshotVal[key].firstName,
          lastName: snapshotVal[key].lastName,
          email: snapshotVal[key].email
        }
      });
      this.setState({profileList: profiles});
    });
  };

  onCheckinChange = (event: any) => {
    const { target: { name, value } } = event;
    var newStateCheckin = {...this.state.checkin};
    newStateCheckin[name] = value;
    this.setState({checkin: newStateCheckin});
  };

  onCheckinSelectChange = (event: any) => {
    var value = event.target.value;
    var newStateCheckin = {...this.state.checkin};
    if (value) {
      newStateCheckin.email = this.state.profileList[value].email;
    } else {
      newStateCheckin.email = "";
    }
    this.setState({checkin: newStateCheckin});
  };

  onCheckinDateChange = (value) => {
    var newStateCheckin = {...this.state.checkin};
    newStateCheckin.date = value;
    this.setState({checkin: newStateCheckin});
  };

  onMultiTypeCheckinChange = (event: any) => {
    const name = event.target.name;
    const checked = event.target.checked;
    const value = event.target.value;
    const valueType = value.split(', ')[0];

    var newArray = this.state.checkin[name].slice()
    var typeIndex = getSubstringIndex(newArray, valueType);
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

    var newStateCheckin = {...this.state.checkin};
    newStateCheckin.classes = newArray
    this.setState({
      checkin: newStateCheckin
    });
  };

  clearForm() {
    this.setState({
      checkin: {
        date: new Date(),
        email: "",
        info: "",
        classes: [],
      }
    });
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    console.log(this.state);
    addNewClassCheckin(this.state.checkin);
    // Clear the form
    this.clearForm();
  };

  render() {

    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="date">Dance Date</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={this.state.checkin.date}
              name="date"
              onChange={this.onCheckinDateChange}
            />
          </FormGroup>
          <FormGroup>
            <select onChange={this.onCheckinSelectChange} value={this.state.checkin.email}>
              <option value="">Select A Student</option>
              {Object.keys(this.state.profileList).map((uid) => {
                return(
                  <option key={uid} value={uid}>{this.state.profileList[uid].firstName} {this.state.profileList[uid].lastName}, {this.state.profileList[uid].email}</option>
                )
              })}
            </select>
          </FormGroup>
          <FormGroup>
            <Label for="email">Student Email</Label><Input type="email" placeholder="me@example.com" onChange={this.onCheckinChange} value={this.state.checkin.email} name="email" />
          </FormGroup>
          <br></br>
          <FormGroup tag="fieldset">
            <legend>Checking in for... (Select all that apply.)</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeCheckinChange} type="checkbox" name="classes" checked={this.state.checkin.classes.indexOf('WCS Fundamentals, Drop-in') !== -1} value="WCS Fundamentals, Drop-in" /> {' '} WCS Fundamentals, Drop-in
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeCheckinChange} type="checkbox" name="classes" checked={this.state.checkin.classes.indexOf('WCS Fundamentals, Monthly Series') !== -1} value="WCS Fundamentals, Monthly Series" /> {' '} WCS Fundamentals, Monthly Series
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeCheckinChange} type="checkbox" name="classes" checked={this.state.checkin.classes.indexOf('Intermediate WCS, Drop-in') !== -1} value="Intermediate WCS, Drop-in" /> {' '} Intermediate WCS, Drop-in
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeCheckinChange} type="checkbox" name="classes" checked={this.state.checkin.classes.indexOf('Intermediate WCS, Monthly Series') !== -1} value="Intermediate WCS, Monthly Series" /> {' '} Intermediate WCS, Monthly Series
              </Label>
            </FormGroup>
          </FormGroup>
          <br></br>
          <FormGroup>
            <Label for="info">Additional Info</Label><Input type="textarea" placeholder="Not necessary, but if you need to make a note about this check-in event, you can!" onChange={this.onCheckinChange} value={this.state.checkin.info} name="info" />
          </FormGroup>
          <br></br>
          <Button outline color="success" type="submit" value="Submit">Submit</Button>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>

        </Form>

{/*        <br></br>
        <div>
        <code>{JSON.stringify(this.state)}</code>
        </div>
        <br></br>
*/}
      </div>
    );
  }
}

export default ReturningStudentForm;
