// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import queryString from 'query-string';
import { getClassCheckinByEmail, getDanceCheckinByEmail } from "../../lib/api.js";

type State = {};

type Props = {};

class StudentCheckinList extends PureComponent<Props, State> {
  state: State = {
    danceCheckinList: {},
    classCheckinList: {}
  };

  getStudentFromQuery = () => {
    console.log(this.props);
    if (this.props.location) {
      var parsedSearch = queryString.parse(this.props.location.search);
      if (this.props.location.search) {
        var studentEmail = parsedSearch["email"];
        this.getCheckinsFromStudentEmail(studentEmail);
      }
    }
  };

  getCheckinsFromStudentEmail = (studentEmail) => {
    getClassCheckinByEmail(studentEmail).on("value", (snapshot) => {
      console.log(snapshot.val())
      this.setState({
        classCheckinList: snapshot.val() || {}
      });
    });
    getDanceCheckinByEmail(studentEmail).on("value", (snapshot) => {
      console.log(snapshot.val())
      this.setState({
        danceCheckinList: snapshot.val() || {}
      });
    });
  };

  componentDidMount() {
    this.getStudentFromQuery();
  };

  render() {

    return (
      <div>
        <h5>Class Checkins</h5>
        {Object.keys(this.state.classCheckinList).map((uid) => {
          return(
            <div key={uid} value={uid}>Date: {this.state.classCheckinList[uid].date} | Classes: {this.state.classCheckinList[uid].classes.join(', ')}</div>
          )
        })}
        <br></br>
        <h5>Dance Checkins</h5>
        {Object.keys(this.state.danceCheckinList).map((uid) => {
          return(
            <div key={uid} value={uid}>{this.state.danceCheckinList[uid].date}</div>
          )
        })}
      </div>
    );
  }
}

export default StudentCheckinList;
