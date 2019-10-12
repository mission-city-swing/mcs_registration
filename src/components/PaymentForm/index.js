// @flow
// src/components/PaymentForm/index.js
import React, { PureComponent } from "react"
import 'bootstrap'
import { APPLICATION_ID, LOCATION_ID, USE_SANDBOX, CLASS_TYPES, classPrice } from '../../lib/payment'
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
  errorMessages: string[],
  successMessage: string
};

class PaymentForm extends PureComponent<Props, State> {
  state: State = {
    classType: '',
    errorMessages: [],
    successMessage: ''
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

    processAndRecordPayment(nonce, buyerVerificationToken, {
      classPrice: classPrice(classType),
      classType
    }).then(response => {
      if (response.errors != null) {
        this.setState({
          errorMessages: response.errors.map(error => error.detail)
        });
      } else {
        const classInfo = response.data;
        this.setState({
          successMessage: `You are successfully registered for ${startCase(capitalize(classInfo.classType))}! See you on Wednesday!`
        });
      }
    })
  }

  render() {
    const { classType, errorMessages, successMessage } = this.state;
    const classOptions = Object.keys(CLASS_TYPES).map(classType => {
      return (<button key={classType}
          className="dropdown-item"
          onClick={this.handleSelect.bind(this, classType)}
        >
          {startCase(capitalize(classType))}
        </button>
      );
    });

    let ctaContent;
    if (successMessage.length > 0) {
      ctaContent = <div className="alert alert-success" role="alert">
        {successMessage}
      </div>
    } else {
      ctaContent = <div>
        <div className="mb-4 dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
            sandbox={USE_SANDBOX}
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
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-6 col-md-6 col-lg-5 d-none d-sm-block">
            <img className="card-img-top" src={mcsReg} alt="MCS Registration" />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-7">
            <div className="card">
              <img className="card-img-top d-sm-none" src={mcsReg} alt="MCS Registration" />
              <div className="card-body">
                <h2 className="card-title">Pay Ahead</h2>
                <p>Skip the Line</p>
                <p>
                  <a href="https://missioncityswing.com/lessons/" target="_blank">Learn more about the different Class offerings</a>
                </p>
                {ctaContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentForm;
