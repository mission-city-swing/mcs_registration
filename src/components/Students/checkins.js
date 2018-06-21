// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import ReactTable from 'react-table';
import queryString from 'query-string';
import { getClassCheckinByEmail, getDanceCheckinByEmail, getProfileByEmail, getDanceByDate } from "../../lib/api.js";
import { sortDateStrings, currentMonthString, reactTableFuzzyMatchFilter } from '../../lib/utils.js'

type State = {};

type Props = {};

class StudentCheckinList extends PureComponent<Props, State> {
  state: State = {
    danceCheckinList: [],
    classCheckinList: [],
    latestMonthlyPass: {}
  };

  getStudentFromQuery = () => {
    if (this.props.location) {
      var parsedSearch = queryString.parse(this.props.location.search);
      if (this.props.location.search) {
        var studentEmail = parsedSearch["email"];
        this.getCheckinsFromStudentEmail(studentEmail);
        this.getLatestMonthlyPassFromEmail(studentEmail);
      }
    }
  };

  getCheckinsFromStudentEmail = (studentEmail) => {
    getClassCheckinByEmail(studentEmail).on("value", (snapshot) => {
      if (snapshot.val()) {
        var checkinListObj = snapshot.val();
        Object.keys(checkinListObj).forEach((uid) => {
          var checkin = Object.assign({uid: uid}, checkinListObj[uid]);
          this.setState({ 
            classCheckinList: this.state.classCheckinList.concat([checkin])
          });
        })
      }
    });
    getDanceCheckinByEmail(studentEmail).on("value", (snapshot) => {
      if (snapshot.val()) {
        var checkinListObj = snapshot.val();
        Object.keys(checkinListObj).forEach((uid) => {
          var checkin = Object.assign({uid: uid}, checkinListObj[uid]);
          getDanceByDate(checkin.date).on("value", (danceSnapshot) => {
            if (danceSnapshot.val()) {
              checkin.dance = Object.assign({uid: Object.keys(danceSnapshot.val())[0]}, Object.values(danceSnapshot.val())[0]);
            } else {
              checkin.dance = {};
            }
            this.setState({ 
              danceCheckinList: this.state.danceCheckinList.concat([checkin])
            });
          });
        })
      }
    });
  };

  getLatestMonthlyPassFromEmail = (studentEmail) => {
    getProfileByEmail(studentEmail).on("value", (snapshot) => {
      var profile = snapshot.val();
      if (profile.latestMonthlyPass) {
        this.setState({latestMonthlyPass: profile.latestMonthlyPass})
      }
    })
  }

  componentDidMount() {
    this.getStudentFromQuery();
  };

  makeDataColumns(dataList, fields = []) {
    if (dataList.length > 0) {
      var headers = Object.keys(dataList[0]).map(function(key) { return({Header: key, accessor: key}) })
      return headers
    } else {
      return []
    }
  };


  render() {
    return (
      <div>
        <h5>Class Checkins</h5>
        {this.state.latestMonthlyPass.monthName === currentMonthString() &&
          <p><strong>Student has monthly pass for {this.state.latestMonthlyPass.numClasses} classes for {this.state.latestMonthlyPass.monthName}</strong></p>
        }
        <ReactTable
          data={this.state.classCheckinList}
          columns={[{
            Header: "Date",
            accessor: "date",
            sortMethod: sortDateStrings,
            maxWidth: 200
          }, {
            Header: "Classes",
            id: "classes",
            accessor: (d) => d.classes.join('; ')
          }, {
            Header: "Checkin Notes",
            accessor: "info"
          }]}
          defaultPageSize={5}
          className="-striped"
          filterable
          defaultFilterMethod={reactTableFuzzyMatchFilter}
        />
        <br></br>
        <h5>Dance Checkins</h5>
        <ReactTable
          data={this.state.danceCheckinList}
          columns={[{
            Header: "Date",
            accessor: "date",
            sortMethod: sortDateStrings,
            maxWidth: 200
          }, {
            Header: "Dance",
            accessor: (d) => d.dance.title,
            id: "dance"
          }, {
            Header: "Checkin Notes",
            accessor: "info"
          }]}
          defaultPageSize={5}
          className="-striped"
          filterable
          defaultFilterMethod={reactTableFuzzyMatchFilter}
        />
      </div>
    );
  }
}

export default StudentCheckinList;
