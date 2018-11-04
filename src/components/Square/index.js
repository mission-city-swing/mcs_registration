// @flow
// src/components/Square/index.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

type Props = {};

type State = {};

class SquareCallback extends PureComponent<Props, State> {

  state: State = {
    success: "",
    error: "",
    transactionTotal: 0,
    tenderType: ""
  };

  onChange = (event: any) => {
    var name = event.target.name;
    var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  };

  createSquareRequest = () => {
    // The URL where the Point of Sale app will send the transaction results.
    var callbackUrl = "https://mcs-reg-test.firebaseio.com/square-data";

    // Your application ID
    var applicationId = "sq0idp-k-rFr2Kd0ba07kMX5jRnwg";

    // The total and currency code should come from your transaction flow.
    // For now, we are hardcoding them.
    // var transactionTotal = "{TRANSACTION TOTAL}";
    var currencyCode = "USD";

    // The version of the Point of Sale SDK that you are using.
    var sdkVersion = "v2.0";

    // Configure the allowable tender types
    var tenderTypes = "com.squareup.pos.TENDER_CARD,com.squareup.pos.TENDER_CARD_ON_FILE,com.squareup.pos.TENDER_CASH,com.squareup.pos.TENDER_OTHER";

    var posUrl =
      "intent:#Intent;" +
      "action=com.squareup.pos.action.CHARGE;" +
      "package=com.squareup;" +
      "S.com.squareup.pos.WEB_CALLBACK_URI=" + callbackUrl + ";" +
      "S.com.squareup.pos.CLIENT_ID=" + applicationId + ";" +
      "S.com.squareup.pos.API_VERSION=" + sdkVersion + ";" +
      "i.com.squareup.pos.TOTAL_AMOUNT=" + this.state.transactionTotal + ";" +
      "S.com.squareup.pos.CURRENCY_CODE=" + currencyCode + ";" +
      "S.com.squareup.pos.TENDER_TYPES=" + tenderTypes + ";" +
      "end";

    return(posUrl);
  };

  onSubmit = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    var posUrl = this.createSquareRequest();
    console.log(posUrl);
    window.open(posUrl);
  };

  render() {
    return (
      <div className="App">
        <h1>Test</h1>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="transactionTotal">Transaction Total</Label><Input placeholder="0" value={this.state.transactionTotal} onChange={this.onChange} name="transactionTotal" />
          </FormGroup>
          <Button value="submit" onClick={this.onSubmit}>Make Request</Button>
        </Form>
      </div>
    );
  }
}

export default SquareCallback;
