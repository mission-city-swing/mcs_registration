// @flow
// src/components/Utilities/appDate.js

// This will be a form with one input
// When you select that input, it submits and calls setAppDate
// You can clear the date and that calls removeAppDate
// Once this is done, we should be able to call getAppDate across the app
import React, { PureComponent } from "react";
import { Form, FormGroup, Button } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { getAppDate, setAppDate } from "../../lib/api.js";
import { getDateFromStringSafe } from "../../lib/utils.js";


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

  reset = () => {
    this.onDateChange(new Date())
  }

  render() {
    return (
      <div className="app-date-form">
        <Form inline >
          <FormGroup className="nav-sm">
            <DateTimePicker
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={getDateFromStringSafe(this.state.date)}
              name="date"
              onChange={this.onDateChange}
            />
          </FormGroup>
          <Button outline onClick={this.reset}>Today</Button>
        </Form>
      </div>
    );
  }
}

export default AppDateForm;
