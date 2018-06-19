// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import queryString from 'query-string';
import { getClassCheckinByEmail, getDanceCheckinByEmail } from "../../lib/api.js";
import { sortByDate } from '../../lib/utils.js'

type State = {};

type Props = {};

class StudentCheckinList extends PureComponent<Props, State> {
  state: State = {
    danceCheckinList: [],
    classCheckinList: []
  };

  getStudentFromQuery = () => {
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
      var classCheckinList = [];
      if (snapshot.val()) {
        var checkinListObj = snapshot.val();
        Object.keys(checkinListObj).map(function(uid) {
          return classCheckinList.push(Object.assign({uid: uid}, checkinListObj[uid]))
        })
      }
      classCheckinList.sort(sortByDate)
      this.setState({classCheckinList: classCheckinList});
    });
    getDanceCheckinByEmail(studentEmail).on("value", (snapshot) => {
      var danceCheckinList = [];
      if (snapshot.val()) {
        var checkinListObj = snapshot.val();
        Object.keys(checkinListObj).map(function(uid) {
          return danceCheckinList.push(Object.assign({uid: uid}, checkinListObj[uid]))
        })
      }
      danceCheckinList.sort(sortByDate)
      this.setState({danceCheckinList: danceCheckinList});
    });
  };

  componentDidMount() {
    this.getStudentFromQuery();
  };

  render() {

    return (
      <div>
        <h5>Class Checkins</h5>
        {this.state.classCheckinList.map(function(checkin) {
          return(
            <div key={checkin.uid} value={checkin.uid}>Date: {checkin.date} | Classes: {checkin.classes.join(', ')} | Info: {checkin.info}</div>
            )
        })}
        <br></br>
        <h5>Dance Checkins</h5>
        {Object.keys(this.state.danceCheckinList).map((uid) => {
          return(
            <div key={uid} value={uid}>Date: {this.state.danceCheckinList[uid].date} | Info: {this.state.danceCheckinList[uid].info}</div>
          )
        })}
      </div>
    );
  }
}

export default StudentCheckinList;
