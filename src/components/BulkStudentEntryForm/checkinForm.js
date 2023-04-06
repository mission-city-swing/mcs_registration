// @flow
// src/components/BulkCheckinEntryForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { createClassCheckinBulk, getAppDate } from "../../lib/api.js";
import { getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";


type State = {};

type Props = {};

class BulkCheckinEntryForm extends PureComponent<Props, State> {
  state: State = {
    date: getAppDate(),
    rawCheckinData: "",
    classCheckinMap: {},
    classCheckinList: [],
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

  transformBulkData = (newCheckinDataString) => {
    var newCheckinArray = [];
    // Expecting a CSV string: firstName, lastName, email, date, classes (semicolon ";" separated)
    // Requires a header
    var inputRows = newCheckinDataString.split('\n');
    // Let us send whatever headers
    var inputHeaders = inputRows.shift().split(',');
    delete inputHeaders['classes'];

    // Turn rows into objects
    inputRows.forEach(classCheckinRow => {
      const [rawClassCheckinAttrs, classes, _] = classCheckinRow.split("\"");
      const classCheckinAttrs = rawClassCheckinAttrs.split(',');
      var classCheckinObj = {};
      for (var i = 0; i < inputHeaders.length; i ++) {
        classCheckinObj[inputHeaders[i]] = classCheckinAttrs[i];
        classCheckinObj['classes'] = classes;
      }
      classCheckinObj.date = getDateFromStringSafe(classCheckinObj.date);
      classCheckinObj.classes = classCheckinObj.classes.split(';');
      console.log(classCheckinObj);
      newCheckinArray.push(classCheckinObj);
    });
    return newCheckinArray;
  }

  onBulkDataChange = (event: any) => {
    var newCheckinData = event.target.value;
    // Do we want to transform or validate anything here instead of in the API call?
    this.setState({rawCheckinData: newCheckinData});
  };

  clearForm() {
    this.setState({rawCheckinData: ""});
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
    const bulkDataToCommit = this.transformBulkData(this.state.rawCheckinData)
    // DB request
    try {
      createClassCheckinBulk(bulkDataToCommit).then(function(bulkEntryResponse){
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
        <p>These are the required headers: firstName, lastName, email, date (the library prefers the format like 12/5/2023), classes (in quotes, semicolon ";" separated)</p>

        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="csv">New Checkin Data CSV (Header Required) <span className="required-text">*</span></Label><Input type="textarea" placeholder="CSV with header and minimum header values" value={this.state.rawCheckinData} onChange={this.onBulkDataChange} name="csv" />
          </FormGroup>      
          {this.state.rawCheckinData.length > 0 &&
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

export default BulkCheckinEntryForm;
