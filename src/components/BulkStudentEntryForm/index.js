// @flow
// src/components/BulkStudentEntryForm/index.js
import React, { PureComponent } from "react";
import BulkEntryForm from "./form.js"
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
        <h1>Admin Bulk Student Entry Form</h1>
        <p>Admins only!</p>
        <ErrorBoundary>
          <BulkEntryForm addActionsOnSubmit={this.addActionsOnSubmit}></BulkEntryForm>
        </ErrorBoundary>
        <br></br>
      </div>
    );
  }
}

export default BulkStudentEntryPage;
