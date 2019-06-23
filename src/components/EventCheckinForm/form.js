// @flow
// src/components/EventCheckinForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import { addNewEventCheckin, getProfiles, getEvents, getEvent, setAppEventId, getAppEventId, getAppDate, setAppDate } from "../../lib/api.js";
import { sortByNameAndEmail, sortByDate, getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { CodeOfConductModalLink } from "../Utilities/conductModal.js";
import { LiabilityWaiverModalLink } from "../Utilities/waiverModal.js";



type State = {};

type Props = {};

class EventCheckinForm extends PureComponent<Props, State> {
  defaultCheckin = {
    firstName: "",
    lastName: "",
    email: "",
    info: "",
    guest: false,
    student: false,
    checkinItems: [],
    waiverAgree: false,
    conductAgree: false,
    alreadySigned: false,
  }

  state: State = {
    eventList: [],
    eventId: getAppEventId(),
    eventDate: getAppDate(),
    checkin: {...this.defaultCheckin},
    profileMap: {},
    profileList: [],
    eventItemsToDisplay: [],
    success: "",
    error: ""
  };

  componentDidMount() {
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

    getEvents.on("value", (snapshot) => {
      var eventList = [];
      var eventsSnap = snapshot.val();
      if (eventsSnap) {
        Object.keys(eventsSnap).forEach((uid => {
          eventList.push(Object.assign({uid: uid}, eventsSnap[uid]))
        }))
        eventList.sort(sortByDate)
      }
      this.setState({eventList: eventList});
    });

    // Get event
    this.getAndSetEventItems(this.state.eventId);

    // Set function for additional actions on submit, like a redirect
    if (this.props.addActionsOnSubmit) {
      this.addActionsOnSubmit = this.props.addActionsOnSubmit
    } else {
      this.addActionsOnSubmit = () => {}
    }
  };

  getAndSetEventItems = (eventId) => {
    getEvent(eventId).on("value", (snapshot) => {
      if (snapshot.val()) {
        var eventDate = getDateFromStringSafe(snapshot.val().date);
        setAppDate(eventDate);
        this.setState({
          eventDate: eventDate,
          eventItemsToDisplay: snapshot.val().checkinItems || []
        });
      }
    });
  };

  onEventSelectChange = (event: any) => {
    var value = event.target.value;
    this.setState({
      eventId: value
    });
    setAppEventId(value);
    this.getAndSetEventItems(value);
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
    this.getAndSetEventItems(value);
    this.setState({date: value});
  };

  onCheckinEventItemChange = (event: any) => {
    var [name, checked, value] = [event.target.name, event.target.checked, event.target.value];
    var newArray = this.state.checkin[name].slice()
    if (checked) {
      newArray.push(value);
    } else {
      var index = newArray.indexOf(value);
      newArray.splice(index, 1);
    }
    var newCheckin = {...this.state.checkin};
    newCheckin[name] = newArray;
    this.setState({
      checkin: newCheckin
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

  onSubmit = (options={}) => {
    var onSuccess = () => {
      var successText = "Added event check-in for " + this.state.checkin.email
      this.setState({success: successText});
      this.addActionsOnSubmit({success: successText});
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
      window.scrollTo(0, 0);
    }
    var thisEventCheckin = Object.assign({...this.state.checkin}, {
      eventId: this.state.eventId,
      date: this.state.eventDate,
    });
    // delete convenience attrs
    delete thisEventCheckin.alreadySigned;
    delete thisEventCheckin.guest;
    // DB request
    try {
      addNewEventCheckin(thisEventCheckin).then(function(){
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
        <div>
          <Form>
            <FormGroup>
              <select onChange={this.onEventSelectChange} value={this.state.eventId}>
                <option value="">Select an Event</option>
                {this.state.eventList.map((event) => {
                  return(
                    <option key={event.uid} value={event.uid}>{event.date}, {event.title}</option>
                  )
                })}
              </select>
            </FormGroup>
          </Form>
        </div>

        <Form onSubmit={this.onSubmit}>
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

          <h5>Event Items</h5>
          { this.state.eventItemsToDisplay && this.state.eventItemsToDisplay.map((item, i) =>
              <FormGroup check key={item}>
                <Label check>
                  <Input onChange={this.onCheckinEventItemChange} type="checkbox" name="checkinItems" checked={this.state.checkin.checkinItems.indexOf(item) !== -1} value={ item } /> { item }
                </Label>
              </FormGroup>
            )
          }
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

export default EventCheckinForm;
