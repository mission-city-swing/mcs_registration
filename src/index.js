import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import App from "./App";
import firebase from "firebase";
import { injectDatabaseForApi } from "./lib/api.js";

import Routes from "./routes";

import "./index.css";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBijDLEM0Kt9ZOdDqri7G-MLloMZwLnMFo",
  authDomain: "mcs-registration.firebaseapp.com",
  databaseURL: "https://mcs-registration.firebaseio.com",
  projectId: "mcs-registration",
  storageBucket: "mcs-registration.appspot.com",
  messagingSenderId: "319728031692"
};
const firebaseApp = firebase.initializeApp(config);
injectDatabaseForApi(firebaseApp);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
