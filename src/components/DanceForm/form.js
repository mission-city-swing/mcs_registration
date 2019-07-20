// @flow
// src/components/DanceForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { Dance } from "../../types.js";
import { addNewDance, getDance, deleteDance, getAppDate } from "../../lib/api.js";
import { getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";

type State = Dance;

class DanceForm extends PureComponent<Props, State> {
  state: State = {
    date: getAppDate(),
    title: '',
    fbLink: '',
    info: '',
    author: '',
    success: '',
    error: ''
  };

  getDanceFromQuery = () => {
    if (this.props.location.search) {
      var parsedSearch = queryString.parse(this.props.location.search);
      var danceId = parsedSearch["uid"];
      if (danceId) {
        this.getDanceFromUid(danceId);
      }
    }
  };

  getDanceFromUid = (danceId) => {
    getDance(danceId).on("value", (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          date: new Date(snapshot.val().date),
          title: snapshot.val().title,
          fbLink: snapshot.val().fbLink,
          info: snapshot.val().info
        });
      }
    });
  }

  componentDidMount() {
    this.getDanceFromQuery();
  };

  onDanceClick = (event: any) => {
    const value = event.target.value;
    this.getDanceFromUid(value);
  }

  onDanceClickDelete = (event: any)  => {
    const value = event.target.value;
    deleteDance(value);
  }

  onChange = (event: any) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value
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

  clearForm() {
    this.setState({
      date: new Date(),
      title: "",
      fbLink: "",
      info: ""
    });
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
    this.props.history.push({ pathname: '/admin/dance', query: {} })
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    var onSuccess = () => {
      var successText = "Updated dance for " + this.state.date.toDateString()
      this.setState({success: successText});
      this.clearForm();
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
    }
    try {
      addNewDance({
        date: this.state.date,
        title: this.state.title,
        fbLink: this.state.fbLink,
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
            <Label for="date">Dance Date</Label>
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
            <Label for="info">Dance Info</Label><Input type="textarea" placeholder="Whatever dance info you want, maybe a FB link" onChange={this.onChange} value={this.state.info} name="info" />
          </FormGroup>
          <Button color="primary" type="submit" value="Submit">Submit</Button>
          <span className="mr-1"></span>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
        </Form>
      </div>
    );
  }
}

export default DanceForm;