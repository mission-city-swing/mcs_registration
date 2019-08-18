// @flow
// src/components/DanceCheckinForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { Typeahead } from 'react-bootstrap-typeahead';
import queryString from 'query-string';

import { addNewDanceCheckin, getProfiles, getAppDate, updateDanceCheckinWithPayment } from "../../lib/api.js";
import { sortByNameAndEmail, getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { CodeOfConductModalLink } from "../Utilities/conductModal.js";
import { LiabilityWaiverModalLink } from "../Utilities/waiverModal.js";
import PaymentForm from "../PaymentForm/index.js";

type State = {
  showPaymentForm: boolean,
  showPaymentConfirmation: boolean
};

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
    date: getAppDate(),
    checkin: {...this.defaultCheckin},
    profileMap: {},
    profileList: [],
    success: "",
    error: "",
    showPaymentForm: false,
    showPaymentConfirmation: false
  };

  componentDidMount() {
    this.includePaymentForm = !!queryString.parse(window.location.search).self_serve;
    // Get list of profiles
    getProfiles.on("value", (snapshot) => {
      // Need map and list-- map for easy access by email
      // and ordered list for select drop-down
      var [profileMap, profileList, snapshotVal] = [{}, [], snapshot.val()];
      if (snapshotVal) {
        Object.keys(snapshotVal).forEach((key) => {
          profileMap[snapshotVal[key].profile.email] = this.getCheckinStateForProfile(snapshotVal[key].profile);
        });
        profileList = Object.values(profileMap)
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

  getCheckinStateForProfile = (profile) => {
    // Helper method for getting the appropriate info from a profile
    // for the class check-in
    var newCheckinState = {...this.defaultCheckin};
    Object.keys(newCheckinState).forEach((key) => {
      newCheckinState[key] = profile[key] ? profile[key] : newCheckinState[key]
    });
    var guest = profile.adminInfo ? profile.adminInfo.guest : false;
    newCheckinState.info = guest ? "Guest" : "";
    newCheckinState.alreadySigned = profile.waiverAgree && profile.conductAgree;
    return newCheckinState
  }

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

  onCheckinTypeaheadChange = (value) => {
    var newStateCheckin = {...this.defaultCheckin};
    if (value && value.length) {
      newStateCheckin = Object.assign(newStateCheckin, this.state.profileMap[value[0].id]);
      // Scroll down to the bottom of the form so the submit button is visible.
      var form_element = document.getElementById("root")
      form_element.scrollIntoView({ block: 'end',  behavior: 'smooth' })
    } else {
      newStateCheckin = {...this.defaultCheckin};
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

  onSubmit = (options = {}) => {
    const onSuccess = () => {
      if (this.includePaymentForm) {
        this.setState({ showPaymentForm: true });
      } else {
        const successText = "Added dance check-in for " + this.state.checkin.email
        this.setState({success: successText});
        this.addActionsOnSubmit({success: successText});
      }
    }
    const onError = (errorText) => {
      this.setState({error: errorText});
      window.scrollTo(0, 0);
    }
    const thisDanceCheckin = Object.assign({...this.state.checkin}, {date: this.state.date});
    // delete convenience attrs
    delete thisDanceCheckin.alreadySigned;
    delete thisDanceCheckin.guest;
    // DB request
    try {
      addNewDanceCheckin(thisDanceCheckin).then(function(){
        onSuccess();
      }).catch(function(error){
        onError(error.toString());
      });
    } catch(error) {
      onError(error.toString());
    }
  };

  handleNonce(nonce, amount) {
    updateDanceCheckinWithPayment({
      ...this.state.checkin,
      date: this.state.date
     },
     nonce,
     amount
    ).then((checkinId) => {
      this.setState({
        showPaymentConfirmation: true
      });
    })
  }

  render() {
    const { showPaymentForm, showPaymentConfirmation } = this.state;
    if (showPaymentConfirmation) {
      return <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">You are now checked in for the dance!</h4>
        <p>Show this screen to the volunteer at the front desk to get your stamp.</p>
      </div>;
    }
    if (this.includePaymentForm && showPaymentForm) {
      return <PaymentForm amount={8} handleNonce={this.handleNonce.bind(this)} />;
    }
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
              value={getDateFromStringSafe(this.state.date)}
              name="date"
              onChange={this.onCheckinDateChange}
            />
          </FormGroup>
          <Label>Returning Dancer</Label>
          <Typeahead
            placeholder="Returning dancers find your name here"
            onChange={this.onCheckinTypeaheadChange}
            options={this.state.profileList.map((profile) => { return {"id": profile.email, "label": profile.firstName + " " + profile.lastName} })}
          />
          <br></br>
          <hr></hr>
          <br></br>
          <FormGroup>
            <Label for="firstName">First Name <span className="required-text">*</span></Label><Input placeholder="First Name" value={this.state.checkin.firstName} onChange={this.onCheckinChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name <span className="required-text">*</span></Label><Input placeholder="Last Name" value={this.state.checkin.lastName} onChange={this.onCheckinChange} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email <span className="required-text">*</span></Label><Input placeholder="Email" value={this.state.checkin.email} onChange={this.onCheckinChange} name="email" />
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
              <Button color="primary" onClick={this.onSubmit}>Submit</Button>
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
