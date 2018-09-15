// @flow
// src/components/Utilities/appDate.js

// This will be a form with one input
// When you select that input, it submits and calls setAppDate
// You can clear the date and that calls removeAppDate
// Once this is done, we should be able to call getAppDate across the app
import React, { PureComponent } from "react";
import { Form, FormGroup } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { getAppDate, setAppDate } from "../../lib/api.js";


type State = {};

type Props = {};

class AppDateForm extends PureComponent<Props, State> {
  state: State = {
    date: getAppDate()
  };

  onDateChange = (value) => {
    this.setState({date: value});
    setAppDate(value);
  };

  render() {
    return (
      <div>
        <Form inline >
          <FormGroup className="nav-sm">
            <DateTimePicker
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={this.state.date}
              name="date"
              onChange={this.onDateChange}
            />
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default AppDateForm;
