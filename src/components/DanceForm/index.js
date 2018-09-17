// @flow
// src/components/DanceForm/index.js
import React, { PureComponent } from "react";
import { Form, FormGroup } from 'reactstrap';
import queryString from 'query-string';
import { getDances } from "../../lib/api.js";
import DanceForm from "./form.js"
import DanceCheckinList from "./checkins.js"
import { sortByDate } from '../../lib/utils.js'

type State = {};

type Props = {};

class DancePage extends PureComponent<Props, State> {
  state: State = {
    selected: "",
    danceList: []
  };

  componentDidMount() {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var danceId = parsedSearch["uid"];
      if (danceId) {
        this.setState({selected: danceId});
      }
    }

    getDances.on("value", (snapshot) => {
      var danceList = [];
      var dancesSnap = snapshot.val();
      if (dancesSnap) {
        Object.keys(dancesSnap).forEach((uid => {
          danceList.push(Object.assign({uid: uid}, dancesSnap[uid]))
        }))
        danceList.sort(sortByDate)
      }
      this.setState({danceList: danceList});
    });
  };

  onDanceSelectChange = (event: any) => {
    var value = event.target.value;
    this.setState({
      selected: value
    });
    window.location.href = "/admin/dance?uid=" + encodeURIComponent(value);
  };

  render() {

    return (
      <div className="App">
        <h1>Dance</h1>
        <div>
          <p>Select a dance to view or update, or create a new dance.</p>
          <Form>
            <FormGroup>
              <select onChange={this.onDanceSelectChange} value={this.state.selected}>
                <option value="">Create a New Dance</option>
                {this.state.danceList.map((dance) => {
                  return(
                    <option key={dance.uid} value={dance.uid}>{dance.date}, {dance.title}</option>
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
        {this.state.selected && 
          <div>
            <DanceCheckinList {...this.props}></DanceCheckinList>
          </div>          
        }
      </div>
    );
  }
}

export default DancePage;
