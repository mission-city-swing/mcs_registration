// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import { Table } from 'reactstrap';
import ReactTable from 'react-table';
import queryString from 'query-string';
import { getDance, getDanceCheckinByDate, getClassCheckinByDate } from "../../lib/api.js";
import { reactTableFuzzyMatchFilter } from '../../lib/utils.js'

type State = {};

type Props = {};

class DanceCheckinList extends PureComponent<Props, State> {
  state: State = {
    danceCheckinList: [],
    classCheckinList: []
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
      var classCheckinList = [];
      if (snapshot.val()) {
        var checkinListObj = snapshot.val();
        Object.keys(checkinListObj).map(function(uid) {
          return classCheckinList.push(Object.assign({uid: uid}, checkinListObj[uid]))
        })
      }
      this.setState({classCheckinList: classCheckinList});
    });

    getDanceCheckinByDate(danceDate).on("value", (snapshot) => {
      var danceCheckinList = [];
      if (snapshot.val()) {
        var checkinListObj = snapshot.val();
        Object.keys(checkinListObj).map(function(uid) {
          return danceCheckinList.push(Object.assign({uid: uid}, checkinListObj[uid]))
        })
      }
      this.setState({danceCheckinList: danceCheckinList});
    });
  };

  componentDidMount() {
    this.getDanceCheckinsFromQuery();
  };

  render() {

    return (
      <div>
        <h4>Activity</h4>
        <h5>Stats</h5>
        {/* Used a regular react-strap table here just to display this info nicely */}
        <Table bordered>
          <thead>
            <tr>
              <th>Total Attendees</th>
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
        <div>
          <h5>Class Checkins</h5>
          <ReactTable
            data={this.state.classCheckinList}
            columns={[{
              Header: "Name",
              accessor: (d) => [d.firstName, d.lastName].join(' '),
              id: "name",
              maxWidth: 300
            }, {
              Header: "Email",
              accessor: "email",
              maxWidth: 300
            }, {
              Header: "Classes",
              id: "classes",
              accessor: (d) => d.classes.join('; ')
            }, {
              Header: "Notes",
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
              Header: "Name",
              accessor: (d) => [d.firstName, d.lastName].join(' '),
              id: "name",
              maxWidth: 300
            }, {
              Header: "Email",
              accessor: "email",
              maxWidth: 300
            }, {
              Header: "Notes",
              accessor: "info"
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

export default DanceCheckinList;
