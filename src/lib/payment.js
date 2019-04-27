export const PAYMENT_TYPES = Object.freeze({
  NEW_STUDENT: 'NEW_STUDENT',
  FUNDAMENTALS_DROPIN: 'FUNDAMENTALS_DROPIN',
  INTERMEDIATE_DROPIN: 'INTERMEDIATE_DROPIN',
  FUNDAMENTALS_MONTHLY: 'FUNDAMENTALS_MONTHLY',
  INTERMEDIATE_MONTHLY: 'INTERMEDIATE_MONTHLY',
  DANCE_DROPIN: 'DANCE_DROPIN'
});

// TODO: Replace with MCS' client id
const CLIENT_ID = 'sq0idp-VeHsehTMSbe2-OEmEQ2wqg';
// TODO: Register both of these URLs with MCS application
const CALLBACK_URL = process.env.NODE_ENV === 'production' ?
  'https://mcs-registration.firebaseapp.com/take-payment' :
  'http://localhost:3000/take-payment';

function calculateAmount(types) {
  if (typeof types === 'string') {
    types = [types];
  }

  const amount = types.reduce((acc, type) => {
    switch (type) {
      // TODO: Handle other payment types
      case PAYMENT_TYPES.DANCE_DROPIN:
        return acc + 8;
      default:
        return acc;
    }
  }, 0);
  return amount;
}

export function takeIosPayment(userId, types) {
  const amount = calculateAmount(types);

  const options = {
    amount_money: {
      amount: amount * 100,
      currency_code: 'USD'
    },
    callback_url: CALLBACK_URL,
    client_id: CLIENT_ID,
    options: {
      supported_tender_types: ["CREDIT_CARD","CASH","OTHER","SQUARE_GIFT_CARD","CARD_ON_FILE"]
    },
    version: '1.3',
    // State will be returned to us in the transaction response
    state: `{"userId":"${userId}"}`
  };

  window.location =
    "square-commerce-v1://payment/create?data=" +
    encodeURIComponent(JSON.stringify(options));
}

export function takeAndroidPayment(userId, types) {
  const transactionTotal = calculateAmount(types);
  const currencyCode = "USD";

  // The version of the Point of Sale SDK that you are using.
  const sdkVersion = "v2.0";

  // Configure the allowable tender types
  const tenderTypes =
   `com.squareup.pos.TENDER_CARD,
    com.squareup.pos.TENDER_CARD_ON_FILE,  
    com.squareup.pos.TENDER_CASH,  
    com.squareup.pos.TENDER_OTHER`;

  const posUrl =
    "intent:#Intent;" +
    "action=com.squareup.pos.action.CHARGE;" +
    "package=com.squareup;" +
    "S.com.squareup.pos.WEB_CALLBACK_URI=" + CALLBACK_URL + ";" +
    "S.com.squareup.pos.CLIENT_ID=" + CLIENT_ID + ";" +
    "S.com.squareup.pos.API_VERSION=" + sdkVersion + ";" +
    "i.com.squareup.pos.TOTAL_AMOUNT=" + transactionTotal + ";" +
    "S.com.squareup.pos.CURRENCY_CODE=" + currencyCode + ";" +
    "S.com.squareup.pos.TENDER_TYPES=" + tenderTypes + ";" +
    // REQUEST_METADATA will be returned to us in the transaction response
    "S.com.squareup.pos.REQUEST_METADATA=" + `{"userId":"${userId}"}` + ";" +
    "end";

  window.open(posUrl);
}

export function processIosPayment() {
  //If successful, Square Point of Sale returns the following parameters.
  const clientTransactionId = "client_transaction_id";
  const transactionId = "transaction_id";

  //If there's an error, Square Point of Sale returns the following parameters.
  const errorField = "error_code";

  const data = decodeURI(URL.searchParams.get("data"));

  console.log("data: " + data);
  const transactionInfo = JSON.parse(data);
  // TODO: https://docs.connect.squareup.com/payments/pos/setup-web#step-4-c-do-something-with-the-transaction-details
  return transactionInfo;
}

export function processAndroidPayment() {
  //If successful, Square Point of Sale returns the following parameters.
  const clientTransactionId = "com.squareup.pos.CLIENT_TRANSACTION_ID";
  const transactionId = "com.squareup.pos.SERVER_TRANSACTION_ID";

  //If there's an error, Square Point of Sale returns the following parameters.
  const errorField = "com.squareup.pos.ERROR_CODE";

  const vars = {};
  const parts = URL.replace(/[?&]+([^=&]+)=([^&]*)/gi,
  function(m,key,value) {
    vars[key] = value;

  });
  // TODO: https://docs.connect.squareup.com/payments/pos/setup-web#step-4-c-do-something-with-the-transaction-details
  return vars;
}
