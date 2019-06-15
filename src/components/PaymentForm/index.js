import React, { PureComponent } from "react";
import SquarePaymentForm, {
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton
} from 'react-square-payment-form';
import 'react-square-payment-form/lib/default.css';

const SANDBOX_APPLICATION_ID = 'sandbox-sq0idp-W_VxJII5AmZuhnN_Sdf5ag';
const SANDBOX_LOCATION_ID = 'CBASEG7tJJATw3E_nQsiJ9v_z8kgAQ';

type State = {};
type Props = {
  handleNonce: (nonce: string) => void
};

export default class PaymentForm extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      errorMessages: [],
    }
  }

  cardNonceResponseReceived = (errors, nonce, cardData) => {
    if (errors) {
      this.setState({ errorMessages: errors.map(error => error.message) })
      return
    }

    this.setState({ errorMessages: [] })
    alert("nonce created: " + nonce)
    this.props.handleNonce(nonce)
  }

  render() {
    return (
      <div>
        <h1>Payment Page</h1>

        <SquarePaymentForm
          applicationId={SANDBOX_APPLICATION_ID}
          locationId={SANDBOX_LOCATION_ID}
          cardNonceResponseReceived={this.cardNonceResponseReceived}
        >
          <fieldset className="sq-fieldset">
            <CreditCardNumberInput />
            <div className="sq-form-third">
              <CreditCardExpirationDateInput />
            </div>

            <div className="sq-form-third">
              <CreditCardPostalCodeInput />
            </div>

            <div className="sq-form-third">
              <CreditCardCVVInput />
            </div>
          </fieldset>

          <CreditCardSubmitButton>
              Pay $1.00
          </CreditCardSubmitButton>
        </SquarePaymentForm>

        <div className="sq-error-message">
          {this.state.errorMessages.map(errorMessage =>
            <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
          )}
        </div>

      </div>
    )
  }
}