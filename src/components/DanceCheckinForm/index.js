// @flow
// src/components/DanceCheckinForm/index.js
import React, { PureComponent } from "react";
import DanceCheckinForm from "./form.js";
import ErrorBoundary from "../Utilities/catch.js";
import queryString from 'query-string';

type Props = {};

class DanceCheckinPage extends PureComponent<Props, State> {

  addActionsOnSubmit = (options = null) => {
    let toUrl = "/take-payment";
    const toUrlQuery = queryString.stringify({
      success: options.success,
      error: options.error,
      payment_user_id: options.paymentUserId,
      payment_types: options.paymentTypes
    }, { arrayFormat: 'bracket' });

    if (toUrlQuery != null) {
      toUrl += `?${toUrlQuery}`;
    }

    this.props.history.push(toUrl);
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="App">
        <h1>Dance Check-in</h1>
        <p>Fill out this form to check in for the dance. Please select today's date and your email address to sign in.</p>
        <ErrorBoundary>
	        <DanceCheckinForm addActionsOnSubmit={this.addActionsOnSubmit}></DanceCheckinForm>
        </ErrorBoundary>
      </div>
    );
  }
}

export default DanceCheckinPage;
