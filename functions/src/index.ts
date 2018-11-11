// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// Step 1: Receive Square callback
// Step 2: Make request to Square API for token
// Step 3: Receive Square callback with token?
// Step 4: Redirect to web app to request transaction with Square app
// Step 5: Request transaction with Square app

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();
const express = require('express');
const app = express();


// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch(e) {
    res.status(403).send('Unauthorized');
    return;
  }
};

// Helper function to categorize a sentiment score as positive, negative, or neutral
const categorizeScore = (score) => {
  if (score > 0.25) {
    return 'positive';
  } else if (score < -0.25) {
    return 'negative';
  }
  return 'neutral';
};

// app.use(authenticate);

// POST /api/messages
// Create a new message, get its sentiment using Google Cloud NLP,
// and categorize the sentiment before saving.
app.post('/messages', async (req, res) => {
  const message = req.body.message;
  try {
    const results = await client.analyzeSentiment({document: message});
    const category = categorizeScore(results[0].documentSentiment.score);
    const data = {message: message, sentiment: results, category: category};
    const snapshot = await admin.database().ref(`/users/${req.user.uid}/messages`).push(data);
    const val = snapshot.val();
    res.status(201).json({message: val.message, category: val.category});
  } catch(error) {
    console.log('Error detecting sentiment or saving message', error.message);
    res.sendStatus(500);
  }
});

// GET /api/messages?category={category}
// Get all messages, optionally specifying a category to filter on
app.get('/messages', async (req, res) => {
  const category = req.query.category;
  let query = admin.database().ref(`/users/${req.user.uid}/messages`);

  if (category && ['positive', 'negative', 'neutral'].indexOf(category) > -1) {
    // Update the query with the valid category
    query = query.orderByChild('category').equalTo(category);
  } else if (category) {
    res.status(404).json({errorCode: 404, errorMessage: `category '${category}' not found`});
    return;
  }
  try {
    const snapshot = await query.once('value');
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({key: childSnapshot.key, message: childSnapshot.val().message});
    });

    res.status(200).json(messages);
  } catch(error) {
    console.log('Error getting messages', error.message);
    res.sendStatus(500);
  }
});

// GET /api/message/{messageId}
// Get details about a message
app.get('/message/:messageId', async (req, res) => {
  const messageId = req.params.messageId;
  try {
    const snapshot = await admin.database().ref(`/users/${req.user.uid}/messages/${messageId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({errorCode: 404, errorMessage: `message '${messageId}' not found`});
    }
    return res.set('Cache-Control', 'private, max-age=300');
  } catch(error) {
    console.log('Error getting message details', messageId, error.message);
    return res.sendStatus(500);
  }
});

// Expose the API as a function
exports.api = functions.https.onRequest(app);
