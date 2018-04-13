// @flow
// src/components/DanceForm/index.js
import React, { PureComponent } from "react";
import { Form, FormGroup } from 'reactstrap';
import queryString from 'query-string';
import { getDances } from "../../lib/api.js";
import DanceForm from "./form.js"
import DanceCheckinList from "./checkins.js"

type State = {};

type Props = {};

class DancePage extends PureComponent<Props, State> {
  state: State = {
    selected: "",
    danceList: {},
    checkinsSection: <div></div>
  };

  componentDidMount() {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var danceId = parsedSearch["uid"];
      if (danceId) {
        this.setState({
          selected: danceId,
          checkinsSection: <div><h4>Checkins</h4><DanceCheckinList {...this.props}></DanceCheckinList></div>
        });
      }
    }

    getDances.on("value", (snapshot) => {
      this.setState({danceList: snapshot.val()});
    });
  };

  onDanceSelectChange = (event: any) => {
    var value = event.target.value;
    this.setState({
      selected: value
    });
    window.location.href = "/dance?uid=" + encodeURIComponent(value);
  };

  render() {

    return (
      <div className="App">
        <h1>Dance</h1>
        <div>
          <p>Select a dance to view or create a new dance </p>
          <Form>
            <FormGroup>
              <select onChange={this.onDanceSelectChange} value={this.state.selected}>
                <option value="">Create a New Dance</option>
                {Object.keys(this.state.danceList).map((uid) => {
                  return(
                    <option key={uid} value={uid}>{this.state.danceList[uid].date}, {this.state.danceList[uid].title}</option>
                  )
                })}
              </select>
            </FormGroup>
          </Form>
        </div>
        <br></br>
        <div>
          <h4>Dance Form</h4>
          <DanceForm {...this.props} ></DanceForm>
        </div>
        <br></br>
        {this.state.checkinsSection}
      </div>
    );
  }
}

export default DancePage;
