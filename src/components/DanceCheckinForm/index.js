// @flow
// src/components/DanceCheckinForm/index.js
import React, { PureComponent } from "react";
import DanceCheckinForm from "./form.js"

type Props = {};

class DanceCheckinPage extends PureComponent<Props, State> {

  render() {
    return (
      <div className="App">
        <h1>Dance</h1>
        <p>Create a new dance checkin object!</p>
        <DanceCheckinForm></DanceCheckinForm>
      </div>
    );
  }
}

export default DanceCheckinPage;
