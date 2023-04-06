// @flow
// src/components/BulkStudentEntryForm/index.js
import React, { PureComponent } from "react";
import { Alert } from 'reactstrap';
import BulkStudentEntryForm from "./form.js"
import BulkCheckinEntryForm from "./checkinForm.js"
import ErrorBoundary from "../Utilities/catch.js"

type State = {};

type Props = {};

class BulkStudentEntryPage extends PureComponent<Props, State> {
  // Show success / errors on the page
  addActionsOnSubmit = (options = null) => {
    var toUrl = "/";
    if (options.success || options.error) {
      toUrl = toUrl + "?";
      if (options.success) {
        toUrl = toUrl + "success=" + encodeURIComponent(options.success);
      }
      if (options.error) {
        toUrl = toUrl + "error=" + encodeURIComponent(options.error);
      }
    }
    this.props.history.push(toUrl);
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="App">
        <h1>Admin Bulk Entry Form</h1>
        <Alert color="warning">Admins only </Alert>
        <ErrorBoundary>
          <br></br>
          <h3>Bulk student profile entry</h3>
          <BulkStudentEntryForm addActionsOnSubmit={this.addActionsOnSubmit}></BulkStudentEntryForm>
          <br></br>
          <h3>Bulk class check-in entry</h3>
          <BulkCheckinEntryForm addActionsOnSubmit={this.addActionsOnSubmit}></BulkCheckinEntryForm>
        </ErrorBoundary>
        <br></br>
      </div>
    );
  }
}

export default BulkStudentEntryPage;
