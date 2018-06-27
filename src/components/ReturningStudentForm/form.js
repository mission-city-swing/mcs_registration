// @flow
// src/components/ReturningStudentForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { ClassCheckin } from "../../types.js";
import { addNewClassCheckin, getProfiles, getProfileByEmail, setLatestMonthlyPass } from "../../lib/api.js";
import { getSubstringIndex, currentMonthIndex, currentMonthString, currentYear, sortByNameAndEmail } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { AdminConfirmButtonModal } from "../Utilities/confirmCheckinModal.js";
import { CodeOfConductModalLink } from "../Utilities/conductModal.js";
import { LiabilityWaiverModalLink } from "../Utilities/waiverModal.js";


type State = ClassCheckin;

type Props = {};

class ReturningStudentForm extends PureComponent<Props, State> {

  defaultCheckin = {
    firstName: "",
    lastName: "",
    email: "",
    info: "",
    student: false,
    waiverAgree: false,
    conductAgree: false,
    completedFundamentals: false,
    alreadySigned: false,
    latestMonthlyPass: {},
    classes: []
  }

  state: State = {
    date: new Date(),
    checkin: {...this.defaultCheckin},
    profileList: [],
    profileMap: {},
    success: "",
    error: ""
  };

  componentDidMount() {
    // Get and set list of profiles for profile select
    this.getAndSetProfilesList()
    // Get student if redirected from new student form
    this.getStudentFromQuery();
    // Set function for additional actions on submit, like a redirect
    if (this.props.addActionsOnSubmit) {
      this.addActionsOnSubmit = this.props.addActionsOnSubmit;
    } else {
      this.addActionsOnSubmit = () => {};
    }
  };

  getAndSetProfilesList = () => {
    // Get list of profiles and set on the state
    getProfiles.on("value", (snapshot) => {
      // Need map and list-- map for easy access by email
      // and ordered list for select drop-down
      var profileMap = {};
      var profileList = [];
      var snapshotVal = snapshot.val();
      if (snapshotVal) {
        Object.keys(snapshotVal).forEach((key) => {
          profileMap[snapshotVal[key].email] = this.getCheckinStateForProfile(snapshotVal[key]);
        });
        profileList = Object.values(profileMap);
        profileList.sort(sortByNameAndEmail);
      }
      this.setState({
        profileMap: profileMap,
        profileList: profileList
      });
    });
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
              this.setState({checkin: this.getCheckinStateForProfile(student, parsedSearch["new-dancer"])});
            }
          });
        }
      }
    }
  };

  getCheckinStateForProfile = (profile, newDancer = false) => {
    // Helper method for getting the appropriate info from a profile
    // for the class checkin
    var newCheckinState = {...this.defaultCheckin};
    Object.keys(newCheckinState).forEach(function(key){
      newCheckinState[key] = profile[key] ? profile[key] : newCheckinState[key]
    });
    newCheckinState.completedFundamentals = (profile.adminInfo ? profile.adminInfo : {}).completedFundamentals ? true : false
    var info = []
    // Make sure to note if they're a new dancer
    if ((profile.adminInfo ? profile.adminInfo : {}).guest) { info.push("Guest") }
    // Make sure to note if profile is a guest of MCS
    if (newDancer) { info.push("New Dancer") }
    newCheckinState.info = info.join(", ")
    // Set latest monthly pass info, including classes
    if (newCheckinState.latestMonthlyPass.monthName === currentMonthString() && newCheckinState.latestMonthlyPass.year === currentYear()) {
      newCheckinState.classes = [...newCheckinState.latestMonthlyPass.classes]
    }
    newCheckinState.alreadySigned = profile.waiverAgree && profile.conductAgree;
    return newCheckinState
  }

  onCheckinChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    var newStateCheckin = {...this.state.checkin};
    if (name === "email") {
      // Fixes an issue where updating the email wouldn't properly update other fields
      if (this.state.profileMap[value]) {
        newStateCheckin = Object.assign(newStateCheckin, this.state.profileMap[value]);
      } else {
        // If the email isn't recognized, update the hidden fields to be the default
        newStateCheckin = Object.assign(newStateCheckin, {
          email: value,
          completedFundamentals: this.defaultCheckin.completedFundamentals,
          info: this.defaultCheckin.info
        });
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
      newStateCheckin = Object.assign(newStateCheckin, this.state.profileMap[value]);
    } else {
      newStateCheckin = {...this.defaultCheckin}
    }
    this.setState({checkin: newStateCheckin});
  };

  onCheckinDateChange = (value) => {
    this.setState({date: value});
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

  toggleAlerts(event: any) {
    console.log(event)
    this.setState({
      success: "",
      error: ""
    });
  };

  afterWaiverConfirm(args) {
    var newStateCheckin = {...this.state.checkin};
    newStateCheckin.waiverAgree = args.agree;
    this.setState({checkin: newStateCheckin});
  }

  afterConductConfirm(args) {
    var newStateCheckin = {...this.state.checkin};
    newStateCheckin.conductAgree = args.agree;
    this.setState({checkin: newStateCheckin});
  }

  updateMonthlyPass() {
    if (this.state.checkin.latestMonthlyPass.monthName === currentMonthString() && this.state.checkin.latestMonthlyPass.year === currentYear()) {
      return new Promise(function(resolve, reject) {
        resolve("Already have a monthly pass for this month");
      })
    } else {
      var monthClasses = [];
      if (this.state.date.getMonth() === currentMonthIndex()) {
        monthClasses = this.state.checkin.classes.filter((className) => {
          return className.toLowerCase().includes("month")
        })
      }
      if (monthClasses.length > 0) {
        return setLatestMonthlyPass({
          email: this.state.checkin.email,
          numClasses: monthClasses.length,
          classes: monthClasses,
          monthName: currentMonthString(),
          year: currentYear()
        })
      } else {
        return new Promise(function(resolve, reject) {
          resolve("No new monthly pass for this month");
        })
      }
    }
  }

  onSubmit = (options) => {
    // Error handling
    var onSuccess = () => {
      var successText = "Added class checkin for " + this.state.checkin.email
      this.setState({
        success: successText,
        error: ""
      });
      this.addActionsOnSubmit({success: successText});
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
      window.scrollTo(0, 0);
    }
    // DB request
    try {
      addNewClassCheckin(Object.assign({...this.state.checkin}, options)).then((success) => {
        // Additionally update the monthly pass status
        this.updateMonthlyPass().then((success) => {
          onSuccess();
        }).catch((error) => {
          onError(error.toString());
        });
      }).catch((error) => {
        onError(error.toString());
      });
    } catch(error) {
      onError(error.toString());
    }
  };

  render() {

    return (
      <div>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="date">Dance Date</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={this.state.date}
              name="date"
              onChange={this.onCheckinDateChange}
            />
          </FormGroup>
          <FormGroup>
            <select onChange={this.onCheckinSelectChange} value={this.state.checkin.email}>
              <option value="">Select A Student</option>
              {this.state.profileList.map((profile) => {
                return(
                  <option key={profile.email} value={profile.email}>{profile.firstName} {profile.lastName}</option>
                )
              })}
            </select>
          </FormGroup>
          {this.state.checkin.completedFundamentals && 
            <p><strong>{this.state.checkin.firstName} {this.state.checkin.lastName} has completed the MCS fundamentals course.</strong></p>
          }
          {this.state.checkin.latestMonthlyPass.monthName === currentMonthString() && this.state.checkin.latestMonthlyPass.year === currentYear() &&
            <p><strong>Student has a monthly pass for {this.state.checkin.latestMonthlyPass.numClasses} classes for {this.state.checkin.latestMonthlyPass.monthName} {this.state.checkin.latestMonthlyPass.year}</strong></p>
          }
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
          { !this.state.checkin.alreadySigned &&
            <div>
              <LiabilityWaiverModalLink checked={this.state.checkin.waiverAgree} afterConfirm={this.afterWaiverConfirm.bind(this)}  />
              <br></br>
              <CodeOfConductModalLink checked={this.state.checkin.conductAgree} afterConfirm={this.afterConductConfirm.bind(this)} />
              <br></br>
            </div>
          }
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
              <AdminConfirmButtonModal buttonOptions={{color: "primary"}} afterConfirm={this.onSubmit} modalHeader="Confirm" modalBody="Please hand the tablet to the desk attendant for confirmation and payment. Thank you!" modalData={Object.assign({date: this.state.date}, this.state.checkin)}>Submit</AdminConfirmButtonModal>
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
