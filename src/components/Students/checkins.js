// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import queryString from 'query-string';
import { getClassCheckinByEmail } from "../../lib/api.js";

type State = {};

type Props = {};

class StudentCheckinList extends PureComponent<Props, State> {
  state: State = {
    checkinList: {}
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
        checkinList: snapshot.val() || {}
      });
    });
  };

  componentDidMount() {
    this.getStudentFromQuery();
  };

  render() {

    return (
      <div>
        {Object.keys(this.state.checkinList).map((uid) => {
          return(
            <div key={uid} value={uid}> Date: {this.state.checkinList[uid].date} | Classes: {this.state.checkinList[uid].classes.join(', ')}</div>
          )
        })}
      </div>
    );
  }
}

export default StudentCheckinList;
