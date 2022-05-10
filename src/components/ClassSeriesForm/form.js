// @flow
// src/components/ClassSeriesForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { ClassSeries } from "../../types.js";
import { addNewClassSeries, getOneClassSeries, deleteClassSeries, getAppDate } from "../../lib/api.js";
import { getDateFromStringSafe, addDaysToDate } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { ConfirmButtonPopover } from "../Utilities/confirmButton.js";

type State = ClassSeries;

type Props = {};

class ClassSeriesForm extends PureComponent<Props, State> {

  defaultFields = {
    seriesId: "",
    startDate: getAppDate(),
    endDate: addDaysToDate(getAppDate(), 7 * 5),
    title: "",
    level: "",
    teachers: "",
    documentationLink: "",
    info: ""
  };

  state: State = Object.assign({...this.defaultFields}, {
    success: "",
    error: ""
  });

  getClassSeriesFromQuery = () => {
    if (this.props.location.search) {
      var parsedSearch = queryString.parse(this.props.location.search);
      var seriesId = parsedSearch["uid"];
      if (seriesId) {
        this.getClassSeriesFromUid(seriesId);
      }
    }
  };

  getClassSeriesFromUid = (seriesId) => {
    getOneClassSeries(seriesId).on("value", (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          seriesId: "",
          startDate: new Date(snapshot.val().startDate),
          endDate: new Date(snapshot.val().endDate),
          title: snapshot.val().title,
          level: snapshot.val().level,
          teachers: snapshot.val().teachers,
          documentationLink: snapshot.val().documentationLink,
          info: snapshot.val().info
        });
      }
    });
  }

  componentDidMount() {
    this.getClassSeriesFromQuery();
  };

  onClassSeriesClick = (event: any) => {
    const value = event.target.value;
    this.getClassSeriesFromUid(value);
  }

  onSeriesClickDelete = () => {
    deleteClassSeries(this.state.seriesId);
    window.location.href = "/admin/class-series";
  }

  onChange = (event: any) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value
    });
  };

  onStartDateChange = (value) => {
    this.setState({
      startDate: value
    });
  };

  onEndDateChange = (value) => {
    this.setState({
      endDate: value
    });
  };

  onLevelChange = (event) => {
    const level = event.target.value;
    this.setState({level: level});
    // Set title if it is currently blank
    if(this.state.title === "") {
      this.setState({
        title: level + " starting " + this.state.startDate.toISOString().split('T')[0]
      })
    }
  }

  toggleAlerts(event: any) {
    this.setState({
      success: "",
      error: ""
    });
  };

  clearForm = () => {
    this.setState({...this.defaultFields});
  };

  clearFormSeries = (series: any) => {
    this.clearForm();
    window.location.href = "/admin/class-series?";
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    var onSuccess = () => {
      var successText = "Updated class series for " + this.state.startDate.toDateString() + " " + this.state.level
      this.setState({success: successText});
      this.clearForm();
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
    }
    try {
      addNewClassSeries({
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        title: this.state.title,
        level: this.state.level,
        teachers: this.state.teachers,
        documentationLink: this.state.documentationLink,
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
            <Label for="startDate">Start Date</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={getDateFromStringSafe(this.state.startDate)}
              name="date"
              onChange={this.onStartDateChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="endDate">End Date</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={getDateFromStringSafe(this.state.endDate)}
              name="date"
              onChange={this.onEndDateChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="title">Title</Label><Input placeholder="Title or brief description" value={this.state.title} onChange={this.onChange} name="title" />
          </FormGroup>

          <FormGroup>
            <Label for="level">Level</Label>
            <Input type="select" name="level" value={this.state.level} onChange={this.onLevelChange}>
              <option value="">-</option>
              <option value="Fundamentals">Fundamentals</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
            </Input>
          </FormGroup>
          
          <FormGroup>
            <Label for="teachers">Teachers</Label><Input placeholder="Maggie and Dave" value={this.state.teachers} onChange={this.onChange} name="teachers" />
          </FormGroup>
          <FormGroup>
            <Label for="documentationLink">Documentation Link</Label><Input placeholder="Link to class plans for the series" value={this.state.documentationLink} onChange={this.onChange} name="documentationLink" />
          </FormGroup>
          <FormGroup>
            <Label for="info">Series Info</Label><Input type="textarea" placeholder="Free-form text for additional info about the series" onChange={this.onChange} value={this.state.info} name="info" />
          </FormGroup>
          <Button color="primary" type="submit" value="Submit">Submit</Button>
          <span className="mr-1"></span>
          <Button outline value="clear" onClick={this.clearFormSeries}>Clear Form</Button>
          <span className="mr-1"></span>
          <ConfirmButtonPopover buttonOptions={this.state.seriesId ? {color: "danger"} : {disabled: true}} popoverOptions={{placement: "right"}} afterConfirm={this.onSeriesClickDelete} popoverHeader="Delete This Series" popoverBody="Are you sure you want to delete this series? This cannot be undone.">Delete</ConfirmButtonPopover>
        </Form>
      </div>
    );
  }
}

export default ClassSeriesForm;
