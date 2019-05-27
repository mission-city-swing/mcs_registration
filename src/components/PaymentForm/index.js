// @flow
import React, { PureComponent } from "react";
import McsAlert from "../Utilities/alert.js";
import queryString from 'query-string';
import { takeIosPayment } from '../../lib/payment.js';

type State = {
  success: string,
  error: string,
  options: object
};
type Props = {};

class PaymentForm extends PureComponent<Props, State> {
  state: State = {
    success: '',
    error: '',
    paymentOptions: {}
  };

  componentDidMount() {
    this.processQuery();
  }

  processQuery = () => {
    if (this.props.location) {
      const parsedSearch = queryString.parse(this.props.location.search, {arrayFormat: 'bracket'});
      if (parsedSearch["success"]) {
        this.setState({success: parsedSearch["success"]})
      }
      if (parsedSearch["error"]) {
        this.setState({error: parsedSearch["error"]})
      }
      if (parsedSearch['payment_types'] != null && parsedSearch['checkin_id'] != null) {
        this.setState({
          paymentParams: {
            types: parsedSearch['payment_types'],
            checkinId: parsedSearch['checkin_id']
          }
        })
      }
    }
  }

  onToggleSuccess = () => {
    this.setState({success: ""});
    window.history.replaceState("", "", "/");
  }

  onToggleError = () => {
    this.setState({error: ""});
    window.history.replaceState("", "", "/");
  }

  handleTakePayment() {
    takeIosPayment(this.state.paymentParams.checkinId, this.state.paymentParams.types);
  }

  render() {
    return (
      <div className="App">
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.onToggleSuccess.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.onToggleError.bind(this)}></McsAlert>
        <h1>Payment Form</h1>
        <p>Please hand the device back to the front desk.</p>
        <button onClick={this.handleTakePayment.bind(this)}>Take Payment</button>
      </div>
    );
  }
}

export default PaymentForm;
