// @flow
// src/components/BulkStudentEntryForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { createProfileBulk, getAppDate } from "../../lib/api.js";
import { getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";


type State = {};

type Props = {};

class BulkEntryForm extends PureComponent<Props, State> {
  state: State = {
    date: getAppDate(),
    rawStudentData: "",
    profileMap: {},
    profileList: [],
    success: "",
    error: ""
  };

  componentDidMount() {
    // Set function for additional actions on submit, like a redirect
    if (this.props.addActionsOnSubmit) {
      this.addActionsOnSubmit = this.props.addActionsOnSubmit
    } else {
      this.addActionsOnSubmit = () => {}
    }
  };

  transformBulkData = (newStudentDataString) => {
    var newStudentArray = [];
    // Expecting a CSV string: firstName, lastName, email, memberDate
    // Requires a header
    var inputRows = newStudentDataString.split('\n');
    // Let us send whatever headers
    const inputHeaders = inputRows.shift().split(',');

    // Turn rows into objects
    inputRows.forEach(profileRow => {
      const profileAttrs = profileRow.split(',');
      var profileObj = {};
      for (var i = 0; i < inputHeaders.length; i ++) {
        profileObj[inputHeaders[i]] = profileAttrs[i];
      }
      console.log(profileObj);
      profileObj.memberDate = getDateFromStringSafe(profileObj.memberDate);
      newStudentArray.push(profileObj);
    });
    return newStudentArray;
  }

  onBulkDataChange = (event: any) => {
    var newStudentData = event.target.value;
    // Do we want to transform or validate anything here instead of in the API call?
    this.setState({rawStudentData: newStudentData});
  };

  clearForm() {
    this.setState({rawStudentData: ""});
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

  onSubmit = (options={}) => {
    var onSuccess = (bulkEntryResponse) => {
      this.setState({success: bulkEntryResponse});
      this.addActionsOnSubmit({success: bulkEntryResponse});
    }
    var onError = (bulkEntryError) => {
      this.setState({error: bulkEntryError});
      window.scrollTo(0, 0);
    }
    const bulkDataToCommit = this.transformBulkData(this.state.rawStudentData)
    // DB request
    try {
      createProfileBulk(bulkDataToCommit).then(function(bulkEntryResponse){
        onSuccess(bulkEntryResponse);
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
        <p>These are the headers that will translate directly to our new student form: firstName (required), lastName (required), email (required), memberDate (required), phoneNumber, discoveryMethod, discoveryMethodFriend, discoveryMethodOther</p>

        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="csv">New Student Data CSV (Header Required) <span className="required-text">*</span></Label><Input type="textarea" placeholder="CSV with header and minimum header values" value={this.state.rawStudentData} onChange={this.onBulkDataChange} name="csv" />
          </FormGroup>      
          {this.state.rawStudentData.length > 0 &&
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

export default BulkEntryForm;
