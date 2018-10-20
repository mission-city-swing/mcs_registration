import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import registerServiceWorker from "./registerServiceWorker";
import App from "./App";
// import firebase from "firebase";
// import { injectDatabaseForApi } from "./lib/api.js";

import "./index.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'react-table/react-table.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';


// localize for date dropdown
Moment.locale('en');
momentLocalizer();

// injectDatabaseForApi(firebaseApp);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
