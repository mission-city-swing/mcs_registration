// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import queryString from 'query-string';
import { getDance, getDanceCheckinByDate, getClassCheckinByDate } from "../../lib/api.js";

type State = {};

type Props = {};

class DanceCheckinList extends PureComponent<Props, State> {
  state: State = {
    danceCheckinList: {},
    classCheckinList: {}
  };

  getDanceCheckinsFromQuery = () => {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var danceId = parsedSearch["uid"];
      if (danceId) {
        getDance(danceId).on("value", (snapshot) => {
          this.getCheckinsFromDate(snapshot.val().date);
        });
      }
    }
  };

  getCheckinsFromDate = (danceDate) => {
    getClassCheckinByDate(danceDate).on("value", (snapshot) => {
      console.log(snapshot.val())
      this.setState({
        classCheckinList: snapshot.val() || {}
      });
    });
    getDanceCheckinByDate(danceDate).on("value", (snapshot) => {
      console.log(snapshot.val())
      this.setState({
        danceCheckinList: snapshot.val() || {}
      });
    });
  };

  componentDidMount() {
    this.getDanceCheckinsFromQuery();
  };

  render() {

    return (
      <div>
        <h5>Class Checkins</h5>
        {Object.keys(this.state.classCheckinList).map((uid) => {
          return(
            <div key={uid} value={uid}> Email: {this.state.classCheckinList[uid].email} | Classes: {this.state.classCheckinList[uid].classes.join(', ')}</div>
          )
        })}
        <br></br>
        <h5>Dance Checkins</h5>
        {Object.keys(this.state.danceCheckinList).map((uid) => {
          return(
            <div key={uid} value={uid}>{this.state.danceCheckinList[uid].email}</div>
          )
        })}
      </div>
    );
  }
}

export default DanceCheckinList;
