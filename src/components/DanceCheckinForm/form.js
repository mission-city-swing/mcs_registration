// @flow
// src/components/DanceCheckinForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { addNewDanceCheckin, getProfiles } from "../../lib/api.js";

// type State = Dance;

type Props = {};

class DanceCheckinForm extends PureComponent<Props, State> {
  state: State = {
    checkin: {
      date: new Date(),
      firstName: "",
      lastName: "",
      email: ""
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
      newStateCheckin.firstName = this.state.profileList[value].firstName;
      newStateCheckin.lastName = this.state.profileList[value].lastName;
      newStateCheckin.email = this.state.profileList[value].email;
    } else {
      newStateCheckin.firstName = "";
      newStateCheckin.lastName = "";
      newStateCheckin.email = "";
    }
    this.setState({checkin: newStateCheckin});
  };

  onCheckinDateChange = (value) => {
    var newStateCheckin = {...this.state.checkin};
    newStateCheckin.date = value.toDateString();
    this.setState({checkin: newStateCheckin});
  };

  clearForm() {
    this.setState({
      checkin: {
        date: new Date(),
        firstName: "",
        lastName: "",
        email: ""  
      }
    });
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    addNewDanceCheckin(this.state.checkin);
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
              <option value="">New Dancer</option>
              {Object.keys(this.state.profileList).map((uid) => {
                return(
                  <option key={uid} value={uid}>{this.state.profileList[uid].firstName} {this.state.profileList[uid].lastName}, {this.state.profileList[uid].email}</option>
                )
              })}
            </select>
          </FormGroup>
          <FormGroup>
            <Label for="firstName">First Name</Label><Input placeholder="First Name" value={this.state.checkin.firstName} onChange={this.onCheckinChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name</Label><Input placeholder="Last Name" value={this.state.checkin.lastName} onChange={this.onCheckinChange} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label><Input placeholder="Email" value={this.state.checkin.email} onChange={this.onCheckinChange} name="email" />
          </FormGroup>
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

export default DanceCheckinForm;
