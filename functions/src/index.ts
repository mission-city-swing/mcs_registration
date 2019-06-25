// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const https = require('https');
const uuidv1 = require('uuid/v1');

exports.createCharge = functions.https.onCall((data, context) => {
  // TODO (@missmaggiemo): Replace with MCS access token
  const SANDBOX_ACCESS_TOKEN = 'EAAAEPhzZ1_bxxI-zoFHW5RY_ESLZdimRPa0jy9DGxqbBw1NSUMcYY3OFLp-3N5P';
  // TODO (@missmaggiemo): Replace with MCS location id
  const SANDBOX_LOCATION_ID = 'CBASEG7tJJATw3E_nQsiJ9v_z8kgAQ';
  const url = `https://connect.squareup.com/v2/locations/${SANDBOX_LOCATION_ID}/transactions`;

  const payload = JSON.stringify({
    "card_nonce": data.nonce,
    "amount_money": {
        "amount": data.amount * 100,
        "currency": "USD"
    },
    "idempotency_key": uuidv1()
  });
  const headers = {
    'Authorization': `Bearer ${SANDBOX_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }
  const options = {
    method: 'POST',
    headers
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });
    
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });
    
    // Write data to request body
    req.write(payload);
    req.end();
  });
});
