// @flow
// src/components/ReturningStudentForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { ClassCheckin } from "../../types.js";
import { addNewClassCheckin, getProfiles, getProfileByEmail } from "../../lib/api.js";
import { getSubstringIndex } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { AdminConfirmButtonModal } from "../Utilities/confirmCheckinModal.js";

type State = ClassCheckin;

type Props = {};

class ReturningStudentForm extends PureComponent<Props, State> {

  defaultCheckin = {
    date: new Date(),
    firstName: "",
    lastName: "",
    email: "",
    info: "New Dancer",
    student: false,
    waiverAgree: false,
    classes: []
  }

  state: State = {
    checkin: {...this.defaultCheckin},
    profileList: {},
    success: "",
    error: ""
  };

  componentDidMount() {
    // Get list of profiles
    getProfiles.on("value", (snapshot) => {
      var snapshotVal = snapshot.val();
      var profiles = {};
      var defaultCheckin = this.defaultCheckin;
      Object.keys(snapshotVal).forEach(function(key1) {
        var thisProfile = snapshotVal[key1];
        profiles[thisProfile.email] = {...defaultCheckin};
        // For all fields in checkin, set those values, if they exist
        Object.keys(defaultCheckin).forEach(function(key2){
          profiles[thisProfile.email][key2] = thisProfile[key2] ? thisProfile[key2] : profiles[thisProfile.email][key2]
        });
        profiles[thisProfile.email].info = "";
      });
      this.setState({profileList: profiles});
    });
    // Get student if redirected from new student form
    this.getStudentFromQuery();
    // Set function for additional actions on submit, like a redirect
    if (this.props.addActionsOnSubmit) {
      this.addActionsOnSubmit = this.props.addActionsOnSubmit
    } else {
      this.addActionsOnSubmit = () => {}
    }
  };

  getStudentFromQuery = () => {
    if (this.props.location) {
      if (this.props.location.search) {
        var parsedSearch = queryString.parse(this.props.location.search);
        if (parsedSearch["email"]) {
          // Get student info from their email
          getProfileByEmail(parsedSearch["email"]).on("value", (snapshot) => {
            var student = snapshot.val();
            if (student) {
              var newStateCheckin = {...this.state.checkin};
              Object.keys(newStateCheckin).forEach(function(key){
                newStateCheckin[key] = student[key] ? student[key] : newStateCheckin[key]
              });
              // Make sure to note if they're a new dancer
              newStateCheckin.info = parsedSearch["new-dancer"] ? "New Dancer" : "";
              this.setState({checkin: newStateCheckin});
            }
          });
        }
      }
    }
  };

  onCheckinChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    var newStateCheckin = {...this.state.checkin};
    if (name === "email") {
      // Fixes an issue where updating the email wouldn't properly update other fields
      if (this.state.profileList[value]) {
        newStateCheckin = Object.assign(newStateCheckin, this.state.profileList[value]);
      } else {
        newStateCheckin = Object.assign({...this.defaultCheckin}, {email: value});
      }
    } else {
      newStateCheckin[name] = value;
    }
    this.setState({checkin: newStateCheckin});
  };

  onCheckinSelectChange = (event: any) => {
    var value = event.target.value;
    var newStateCheckin = {...this.state.checkin};
    if (value) {
      newStateCheckin = Object.assign(newStateCheckin, this.state.profileList[value]);
    } else {
      newStateCheckin = {...this.defaultCheckin}
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
      checkin: {...this.defaultCheckin}
    });
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
  };

  onSubmit = (options) => {
    // If additional info added by admin
    if (options.info) {
      var newCheckin = {...this.state.checkin}
      newCheckin.info = options.info
      this.setState({
        checkin: newCheckin
      })
    }
    // Error handling
    var onSuccess = () => {
      var successText = "Added class checkin for " + this.state.checkin.email
      console.log("Success! " + successText);
      this.setState({
        success: successText,
        error: ""
      });
      this.addActionsOnSubmit({success: successText});
    }
    var onError = (errorText) => {
      console.log("Error! " + errorText);
      this.setState({error: errorText});
      window.scrollTo(0, 0);
    }
    // DB request
    try {
      addNewClassCheckin({...this.state.checkin}).then(function(success) {
        onSuccess();
      }).catch(function(error) {
        console.log(error);
        onError(error.toString());
      });
    } catch(error) {
      console.log(error);
      onError(error.toString());
    }
  };

  render() {

    return (
      <div>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0}></McsAlert>
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
            <Label for="firstName">First Name</Label><Input placeholder="First Name" value={this.state.checkin.firstName} onChange={this.onCheckinChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name</Label><Input placeholder="Last Name" onChange={this.onCheckinChange} value={this.state.checkin.lastName} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onCheckinChange} value={this.state.checkin.email} type="email" id="email" name="email" />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onCheckinChange} name="student" type="checkbox" checked={this.state.checkin.student} />
              Full time student, must show valid student ID
            </Label>
          </FormGroup>
          <br></br>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onCheckinChange} name="waiverAgree" type="checkbox" checked={this.state.checkin.waiverAgree} />
              Waiver: I realize that partner dancing is a full-contact sport, and I promise not to sue Mission City Swing if I happen to get hurt. <a href="#">Read full text here (but not yet)</a>
            </Label>
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
          {this.state.checkin.email.length > 0 &&
            <div>
            <AdminConfirmButtonModal buttonOptions={{color: "primary"}} afterConfirm={this.onSubmit} modalHeader="Confirm" modalBody="Please hand the tablet to the desk attendant for confirmation and payment. Thank you!" modalData={this.state.checkin}>Submit</AdminConfirmButtonModal>
            <span className="mr-1"></span>
            <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
            </div>
          }
        </Form>
      </div>
    );
  }
}

export default ReturningStudentForm;
