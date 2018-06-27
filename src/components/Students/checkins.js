// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import { Table } from "reactstrap";
import ReactTable from "react-table";
import queryString from "query-string";
import { getClassCheckinByEmail, getDanceCheckinByEmail, getProfileByEmail, getDanceByDate, getMonthlyPassesByEmail } from "../../lib/api.js";
import { sortDateStrings, currentMonthString, currentYear, reactTableFuzzyMatchFilter } from "../../lib/utils.js";

type State = {};

type Props = {};

class StudentCheckinList extends PureComponent<Props, State> {
  state: State = {
    danceCheckinList: [],
    classCheckinList: [],
    monthlyPassesList: [],
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
    getMonthlyPassesByEmail(studentEmail).on("value", (snapshot) => {
      if (snapshot.val()) {
        var passesObj = snapshot.val();
        Object.keys(passesObj).forEach((uid) => {
          var pass = Object.assign({uid: uid}, passesObj[uid]);
          pass.dateString = [pass.year, pass.monthName].join(" ")
          this.setState({ 
            monthlyPassesList: this.state.monthlyPassesList.concat([pass])
          });
        })
      }
    });
  };

  getLatestMonthlyPassFromEmail = (studentEmail) => {
    getProfileByEmail(studentEmail).on("value", (snapshot) => {
      var profile = snapshot.val();
      if (profile && profile.latestMonthlyPass) {
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
        <h4>Activity</h4>
        {this.state.latestMonthlyPass.monthName === currentMonthString() && this.state.latestMonthlyPass.year === currentYear() &&
          <p><strong>Student has monthly pass for {this.state.latestMonthlyPass.numClasses} classes for {this.state.latestMonthlyPass.monthName} {this.state.latestMonthlyPass.year}</strong></p>
        }
        <div>
          <h5>Stats</h5>
          {/* Used a regular react-strap table here just to display this info nicely */}
          <Table bordered>
            <thead>
              <tr>
                <th>Total Checkins</th>
                <th>Class Checkins</th>
                <th>Dance Checkins</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.classCheckinList.length + this.state.danceCheckinList.length}</td>
                <td>{this.state.classCheckinList.length}</td>
                <td>{this.state.danceCheckinList.length}</td>
              </tr>
            </tbody>
          </Table>
          <h5>Class Checkins</h5>
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
          <br></br>
          <h5>Monthly Passes</h5>
          <ReactTable
            data={this.state.monthlyPassesList}
            columns={[{
              Header: "Month",
              accessor: "dateString",
              maxWidth: 200
            }, {
              Header: "No. Classes",
              accessor: "numClasses",
              maxWidth: 100
            }, {
              Header: "Classes",
              id: "classes",
              accessor: (d) => d.classes.join('; ')
            }]}
            defaultPageSize={5}
            className="-striped"
            filterable
            defaultFilterMethod={reactTableFuzzyMatchFilter}
          />
        </div>
      </div>
    );
  }
}

export default StudentCheckinList;
