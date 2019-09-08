// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const https = require('https');
const uuidv1 = require('uuid/v1');

exports.createCharge = functions.https.onCall(data => {
  // Set environment configuration
  // firebase functions:config:set paymentservice.hostname="https://connect.squareup.com/v2/payments" paymentservice.accesstoken="THE ACCESS TOKEN" paymentservice.locationid="THE LOCATION ID"
  // For local emulator
  // firebase functions:config:get > .runtimeconfig.json
  const HOST_NAME = functions.config().paymentservice.hostname;
  const ACCESS_TOKEN = functions.config().paymentservice.accesstoken;
  const LOCATION_ID = functions.config().paymentservice.locationid;

  const payload = JSON.stringify({
    "source_id": data.nonce,
    "verification_token": data.buyerVerificationToken,
    "location_id": LOCATION_ID,
    "amount_money": {
      "amount": data.amount * 100,
      "currency": "USD"
    },
    "idempotency_key": uuidv1()
  });
  const headers = {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }
  const options = {
    hostname: HOST_NAME,
    path: `/v2/payments`,
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
