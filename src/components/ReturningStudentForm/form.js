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
import { AdminConfirmButtonModal } from "../Utilities/confirmButton.js";

type State = ClassCheckin;

type Props = {};

class ReturningStudentForm extends PureComponent<Props, State> {
  state: State = {
    checkin: {
      date: new Date(),
      firstName: "",
      lastName: "",
      email: "",
      info: "",
      student: false,
      classes: []
    },
    profileList: {},
    success: "",
    error: ""
  };

  componentDidMount() {
    // Get list of profiles
    getProfiles.on("value", (snapshot) => {
      var snapshotVal = snapshot.val();
      var profiles = {};
      Object.keys(snapshotVal).forEach(function(key) {
        profiles[snapshotVal[key].email] = {
          firstName: snapshotVal[key].firstName,
          lastName: snapshotVal[key].lastName,
          email: snapshotVal[key].email,
          student: snapshotVal[key].student
        }
      });
      this.setState({profileList: profiles});
    });

    // Get student if redirected from new student form
    this.getStudentFromQuery();

    // Addition actions after submit, like a redirect
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
        if (parsedSearch["new-dancer"]) {
          var newStateCheckin = {...this.state.checkin};
          newStateCheckin["info"] = "New dancer";
          this.setState({checkin: newStateCheckin});
        }
        if (parsedSearch["email"]) {
          getProfileByEmail(parsedSearch["email"]).on("value", (snapshot) => {
            var student = snapshot.val();
            if (student) {
              var newStateCheckin = {...this.state.checkin};
              newStateCheckin["firstName"] = student.firstName;
              newStateCheckin["lastName"] = student.lastName;
              newStateCheckin["email"] = student.email;
              newStateCheckin["student"] = student.student;
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
    newStateCheckin[name] = value;
    this.setState({checkin: newStateCheckin});
  };

  onCheckinSelectChange = (event: any) => {
    var value = event.target.value;
    var newStateCheckin = {...this.state.checkin};
    if (value) {
      newStateCheckin.email = this.state.profileList[value].email;
      newStateCheckin.firstName = this.state.profileList[value].firstName;
      newStateCheckin.lastName = this.state.profileList[value].lastName;
      newStateCheckin.student = this.state.profileList[value].student;
      newStateCheckin.info = "";
    } else {
      newStateCheckin.email = "";
      newStateCheckin.firstName = "";
      newStateCheckin.lastName = "";
      newStateCheckin.student = false;
      newStateCheckin.info = "";
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
        firstName: "",
        lastName: "",
        email: "",
        info: "",
        student: false,
        classes: [],
      }
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
      this.addActionsOnSubmit();
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
