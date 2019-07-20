// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const https = require('https');
const uuidv1 = require('uuid/v1');

exports.createCharge = functions.https.onCall(data => {
  const SANDBOX_ACCESS_TOKEN = functions.config().paymentservice.accesstoken;
  const SANDBOX_LOCATION_ID = functions.config().paymentservice.locationid;

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
    hostname: 'connect.squareup.com',
    path: `/v2/locations/${SANDBOX_LOCATION_ID}/transactions`,
    method: 'POST',
    headers
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
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
