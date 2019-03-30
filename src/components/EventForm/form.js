// @flow
// src/components/EventForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { Event } from "../../types.js";
import { addNewEvent, getEvent, deleteEvent, getAppDate } from "../../lib/api.js";
import { getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { ConfirmButtonPopover } from "../Utilities/confirmButton.js";

type State = Event;

type Props = {};

class EventForm extends PureComponent<Props, State> {

  defaultFields = {
    eventId: "",
    date: getAppDate(),
    title: "",
    fbLink: "",
    checkinItems: [],
    checkinItemsDisplay: "",
    info: ""
  };

  state: State = Object.assign({...this.defaultFields}, {
    success: "",
    error: ""
  });

  getEventFromQuery = () => {
    if (this.props.location.search) {
      var parsedSearch = queryString.parse(this.props.location.search);
      var eventId = parsedSearch["uid"];
      if (eventId) {
        this.getEventFromUid(eventId);
      }
    }
  };

  getEventFromUid = (eventId) => {
    getEvent(eventId).on("value", (snapshot) => {
      if (snapshot.val()) {
        console.log(snapshot.val())
        this.setState({
          eventId: eventId,
          date: new Date(snapshot.val().date),
          title: snapshot.val().title,
          fbLink: snapshot.val().fbLink,
          checkinItems: snapshot.val().checkinItems,
          checkinItemsDisplay: snapshot.val().checkinItems.join(', '),
          info: snapshot.val().info
        });
      }
    });
  }

  componentDidMount() {
    this.getEventFromQuery();
  };

  onEventClick = (event: any) => {
    const value = event.target.value;
    this.getEventFromUid(value);
  }

  onEventClickDelete = () => {
    deleteEvent(this.state.eventId);
    window.location.href = "/admin/event";
  }

  onChange = (event: any) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value
    });
  };

  onCheckinItemsChange = (event: any) => {
    const value = event.target.value;
    var items = value.split(',').map(function (item, i) {
      return item.replace(/(^\s*)|(\s*$)/g, '')
    }).filter( function (item, i) {
      return item
    });

    this.setState({
      checkinItems: items,
      checkinItemsDisplay: value
    });
  };

  onDateChange = (value) => {
    this.setState({
      date: value
    });
  };

  toggleAlerts(event: any) {
    this.setState({
      success: "",
      error: ""
    });
  };

  clearForm = () => {
    this.setState({...this.defaultFields});
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
    window.location.href = "/admin/event?";
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    var onSuccess = () => {
      var successText = "Updated event for " + this.state.date.toDateString()
      this.setState({success: successText});
      this.clearForm();
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
    }
    try {
      addNewEvent({
        date: this.state.date,
        title: this.state.title,
        fbLink: this.state.fbLink,
        checkinItems: this.state.checkinItems,
        info: this.state.info
      }).then((success) => {
        onSuccess()
      }).catch((error) => {
        onError(error.toString())
      })
    } catch(error) {
      onError(error.toString())
    }
  };

  render() {

    return (
      <div>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="date">Event Date</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={getDateFromStringSafe(this.state.date)}
              name="date"
              onChange={this.onDateChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="title">Title</Label><Input placeholder="Title or brief description" value={this.state.title} onChange={this.onChange} name="title" />
          </FormGroup>
          <FormGroup>
            <Label for="fbLink">FB Link</Label><Input placeholder="FB Link" value={this.state.fbLink} onChange={this.onChange} name="fbLink" />
          </FormGroup>
          <FormGroup>
            <Label for="checkinItems">Check-in Items <span className="required-text">*Will be displayed on event check-in form</span></Label><Input placeholder="Items, separated by commas, like this" value={this.state.checkinItemsDisplay} onChange={this.onCheckinItemsChange} name="checkinItems" />
          </FormGroup>
          <FormGroup>
            <Label for="info">Event Info</Label><Input type="textarea" placeholder="Whatever event info you want, maybe a FB link" onChange={this.onChange} value={this.state.info} name="info" />
          </FormGroup>

          <Button color="primary" type="submit" value="Submit">Submit</Button>
          <span className="mr-1"></span>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
          <span className="mr-1"></span>
          <ConfirmButtonPopover buttonOptions={{color: "danger"}} popoverOptions={{placement: "right"}} afterConfirm={this.onEventClickDelete} popoverHeader="Delete This Event" popoverBody="Are you sure you want to delete this event? This cannot be undone.">Delete</ConfirmButtonPopover>
        </Form>
      </div>
    );
  }
}

export default EventForm;
