// @flow
// src/components/DanceCheckinForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { addNewDanceCheckin, getProfiles } from "../../lib/api.js";
import { sortByNameAndEmail } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { AdminConfirmButtonModal } from "../Utilities/confirmCheckinModal.js";
import { CodeOfConductModalLink } from "../Utilities/conductModal.js";
import { LiabilityWaiverModalLink } from "../Utilities/waiverModal.js";



type State = {};

type Props = {};

class DanceCheckinForm extends PureComponent<Props, State> {
  defaultCheckin = {
    firstName: "",
    lastName: "",
    email: "",
    info: "",
    guest: false,
    student: false,
    waiverAgree: false,
    conductAgree: false,
    alreadySigned: false
  }

  state: State = {
    date: new Date(),
    checkin: {...this.defaultCheckin},
    profileMap: {},
    profileList: [],
    success: "",
    error: ""
  };

  componentDidMount() {
    // Get list of profiles
    getProfiles.on("value", (snapshot) => {
      // Need map and list-- map for easy access by email
      // and ordered list for select drop-down
      var profileMap = {};
      var profileList = [];
      var snapshotVal = snapshot.val();
      if (snapshotVal) {
        var defaultCheckin = this.defaultCheckin;
        Object.keys(snapshotVal).forEach(function(key1) {
          var thisProfile = snapshotVal[key1];
          profileMap[thisProfile.email] = {...defaultCheckin};
          Object.keys(defaultCheckin).forEach(function(key2){
            profileMap[thisProfile.email][key2] = thisProfile[key2] ? thisProfile[key2] : profileMap[thisProfile.email][key2]
          });
          var guest = thisProfile.adminInfo ? thisProfile.adminInfo.guest : false
          profileMap[thisProfile.email].info = guest ? "Guest" : "";
          profileMap[thisProfile.email].alreadySigned = thisProfile.waiverAgree && thisProfile.conductAgree;
        });
        profileList = Object.values(this.state.profileMap)
        profileList.sort(sortByNameAndEmail)
      }
      this.setState({
        profileMap: profileMap,
        profileList: profileList
      });
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
      if (this.state.profileMap[value]) {
        newStateCheckin = Object.assign(newStateCheckin, this.state.profileMap[value]);
      } else {
        // if the email isn't recognized, update the hidden "info" field to be the default
        newStateCheckin = Object.assign(newStateCheckin, {
          email: value,
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
    var newStateCheckin = {...this.defaultCheckin};
    if (value) {
      newStateCheckin = Object.assign(newStateCheckin, this.state.profileMap[value])
    } else {
      newStateCheckin = {...this.defaultCheckin}
    }
    this.setState({checkin: newStateCheckin});
  };

  onCheckinDateChange = (value) => {
    this.setState({date: value});
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

  onSubmit = (options) => {
    var onSuccess = () => {
      var successText = "Added dance checkin for " + this.state.checkin.email
      this.setState({success: successText});
      this.addActionsOnSubmit({success: successText});
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
      window.scrollTo(0, 0);
    }

    try {
      addNewDanceCheckin(Object.assign({...this.state.checkin}, options)).then(function(){
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
              <option value="">New Dancer</option>
              {this.state.profileList.map((profile) => {
                return(
                  <option key={profile.email} value={profile.email}>{profile.firstName} {profile.lastName}</option>
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
              <strong>Full time student, must show valid student ID</strong>
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

export default DanceCheckinForm;
