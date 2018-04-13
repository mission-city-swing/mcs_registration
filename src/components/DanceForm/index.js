// @flow
// src/components/DanceForm/index.js
import React, { PureComponent } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { Dance } from "../../types.js";
import { addNewDance, getDances, getDance, deleteDance } from "../../lib/api.js";

type State = Dance;

type Props = {};

class DanceForm extends PureComponent<Props, State> {
  state: State = {
    date: new Date(),
    fbLink: "",
    info: "",
    danceList: {}
  };

  getDanceFromQuery = () => {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var danceId = parsedSearch["uid"];
      this.getDanceFromUid(danceId);
    }
  };

  getDanceFromUid = (danceId) => {
    getDance(danceId).on("value", (snapshot) => {
      this.setState({
        date: new Date(snapshot.val().date),
        fbLink: snapshot.val().fbLink,
        info: snapshot.val().info,
      })
    });
  }

  componentDidMount() {
    this.getDanceFromQuery();

    getDances.on("value", (snapshot) => {
      this.setState({danceList: snapshot.val()});
    });
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
      fbLink: this.state.fbLink,
      info: this.state.info
    });
    // Clear the form
    this.clearForm();
  };

  render() {

    return (
      <div className="App">
        <h1>Dance</h1>
        <p>Create and edit dance objects!</p>
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
            <Label for="fbLink">FB Link</Label><Input placeholder="FB Link" value={this.state.fbLink} onChange={this.onChange} name="fbLink" />
          </FormGroup>
          <FormGroup>
            <Label for="info">Dance Info</Label><Input type="textarea" placeholder="Whatever dance info you want, maybe a FB link" onChange={this.onChange} value={this.state.info} name="info" />
          </FormGroup>
          <Button outline color="success" type="submit" value="Submit">Submit</Button>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
        </Form>
        <br></br>
        <div>
          <h2>Previous Dances</h2>
            {Object.keys(this.state.danceList).map((uid) => {
              return(
                <div key={uid} value={uid}>{this.state.danceList[uid].date}, <a href={this.state.danceList[uid].fbLink} target="_blank">{this.state.danceList[uid].fbLink}</a> <Link to={"/dance?uid=" + uid}><Button value={uid} onClick={this.onDanceClick} size="sm" outline>Edit</Button></Link> <Button value={uid} onClick={this.onDanceClickDelete} color="danger" size="sm" outline>Delete</Button></div>
              )
            })}
        </div>

{/*        <br></br>
        <div>
        <code>{JSON.stringify(this.state)}</code>
        </div>
        <br></br>
*/}
      </div>
    );
  }
}

export default DanceForm;
