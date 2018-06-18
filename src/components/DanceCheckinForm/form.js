// @flow
// src/components/DanceCheckinForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { addNewDanceCheckin, getProfiles } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js";
import { AdminConfirmButtonModal } from "../Utilities/confirmCheckinModal.js";


type State = {};

type Props = {};

class DanceCheckinForm extends PureComponent<Props, State> {
  defaultCheckin = {
    date: new Date(),
    firstName: "",
    lastName: "",
    email: "",
    info: "New Dancer",
    student: false,
    waiverAgree: false
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
        Object.keys(defaultCheckin).forEach(function(key2){
          profiles[thisProfile.email][key2] = thisProfile[key2] ? thisProfile[key2] : profiles[thisProfile.email][key2]
        });
        profiles[thisProfile.email].info = "";
      });
      this.setState({profileList: profiles});
    });
    // Set function for additional actions on submit, like a redirect
    if (this.props.addActionsOnSubmit) {
      this.addActionsOnSubmit = this.props.addActionsOnSubmit
    } else {
      this.addActionsOnSubmit = () => {}
    }
  };

  onCheckinChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    var newStateCheckin = {...this.state.checkin};
    if (name === "email") {
      // fixes an issue where updating the email wouldn't properly update other fields
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
    var newStateCheckin = {...this.defaultCheckin};
    if (value) {
      newStateCheckin = Object.assign(newStateCheckin, this.state.profileList[value])
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

  clearForm() {
    this.setState({
      checkin: {...this.defaultCheckin}
    });
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
  };

  onSubmit = (options) => {
    var onSuccess = () => {
      var successText = "Added dance checkin for " + this.state.checkin.email
      console.log("Success! " + successText);
      this.setState({success: successText});
      this.addActionsOnSubmit({success: successText});
    }
    var onError = (errorText) => {
      console.log("Error! " + errorText);
      this.setState({error: errorText});
      window.scrollTo(0, 0);
    }

    try {
      addNewDanceCheckin({...this.state.checkin}).then(function(){
        onSuccess();
      }).catch(function(error){
        onError(error.toString());
      });
    } catch(error) {
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
          <br></br>
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

export default DanceCheckinForm;
