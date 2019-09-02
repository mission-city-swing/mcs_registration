// @flow
// src/components/PaymentForm/index.js
import React, { PureComponent } from "react"
import 'bootstrap'
import { APPLICATION_ID, LOCATION_ID, CLASS_TYPES, classPrice } from '../../lib/payment'
import SquarePaymentForm, {
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton
} from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'
import { capitalize, startCase } from 'lodash';
import { processAndRecordPayment } from "../../lib/api.js";
import mcsReg from '../../images/mcsreg.jpg';

type Props = {};
type State = {
  classType: string,
  errorMessages: string[]
};

class PaymentForm extends PureComponent<Props, State> {
  state: State = {
    classType: '',
    errorMessages: []
  };

  handleSelect(classType: string) {
    console.log('selecting', classType);
    this.setState({
      classType
    });
  }

  cardNonceResponseReceived = (errors, nonce, cardData, buyerVerificationToken) => {
    if (errors) {
      this.setState({ errorMessages: errors.map(error => error.message) })
      return
    }

    this.setState({ errorMessages: [] })

    const {
      classType
    } = this.state

    processAndRecordPayment(nonce, {
      classPrice: classPrice(classType),
      classType
    })
  }

  render() {
    const { classType, errorMessages } = this.state;
    const classOptions = Object.keys(CLASS_TYPES).map(classType => {
      return (<button key={classType}
          className="dropdown-item"
          onClick={this.handleSelect.bind(this, classType)}
        >
          {startCase(capitalize(classType))}
        </button>
      );
    })
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card">
              <img className="card-img-top" src={mcsReg} alt="MCS Registration" />
              <div className="card-body">
                <h5 className="card-title">Pay ahead to skip the line</h5>
                <p>
                <a href="https://missioncityswing.com/lessons/" target="_blank">Learn more about the different Class offerings</a>
                </p>
                <div className="mb-4 dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {classType.length > 0 ? startCase(capitalize(classType)) : 'Select your Class'}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {classOptions}
                  </div>
                </div>
                {errorMessages.map((errorMessage, i) => {
                  return (
                    <div key={i} className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )
                })}
                {classType.length > 0 && (
                  <SquarePaymentForm
                    applicationId={APPLICATION_ID}
                    locationId={LOCATION_ID}
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
                        Pay ${classPrice(classType)}
                    </CreditCardSubmitButton>
                  </SquarePaymentForm>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentForm;
