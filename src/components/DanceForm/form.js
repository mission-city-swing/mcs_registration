// @flow
// src/components/DanceForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { Dance } from "../../types.js";
import { addNewDance, getDance, deleteDance } from "../../lib/api.js";

type State = Dance;

type Props = {};

class DanceForm extends PureComponent<Props, State> {
  state: State = {
    date: new Date(),
    title: "",
    fbLink: "",
    info: ""
  };

  getDanceFromQuery = () => {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var danceId = parsedSearch["uid"];
      if (danceId) {
        this.getDanceFromUid(danceId);
      }
    }
  };

  getDanceFromUid = (danceId) => {
    getDance(danceId).on("value", (snapshot) => {
      this.setState({
        date: new Date(snapshot.val().date),
        title: snapshot.val().title,
        fbLink: snapshot.val().fbLink,
        info: snapshot.val().info
      });
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
    console.log("would have deleted " + value);
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
    this.props.history.push({ pathname: '/dance', query: {} })
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    console.log(this.state);
    addNewDance({
      date: this.state.date,
      title: this.state.title,
      fbLink: this.state.fbLink,
      info: this.state.info
    });
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
              value={this.state.date}
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
          <Button outline color="success" type="submit" value="Submit">Submit</Button>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
        </Form>
      </div>
    );
  }
}

export default DanceForm;
