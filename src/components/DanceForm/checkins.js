// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import { Table } from 'reactstrap';
import { CSVLink } from 'react-csv';
import ReactTable from 'react-table';
import queryString from 'query-string';
import { getDance, getDanceCheckinByDate, getClassCheckinByDate } from "../../lib/api.js";
import { reactTableFuzzyMatchFilter } from '../../lib/utils.js'

type State = {};

type Props = {};

class DanceCheckinList extends PureComponent<Props, State> {
  state: State = {
    danceCheckinList: [],
    classCheckinList: [],
    danceId: '',
    danceDate: null,
    csvHeaders: ['Date', 'Check-in ID', 'Name', 'Email', 'Checkin Items', 'Checkin Info']
  };

  getDanceCheckinsFromQuery = () => {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var danceId = parsedSearch["uid"];
      if (danceId) {
        this.setState({ danceId: danceId });
        getDance(danceId).on("value", (snapshot) => {
          const date = snapshot.val().date;
          this.setState({ danceDate: date });
          this.getCheckinsFromDate(date);
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
      this.makeCsvDataWithName(classCheckinList, "csvDataClass");
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
      this.makeCsvDataWithName(danceCheckinList, "csvDataDance");
    });
  };

  makeCsvDataWithName = (checkinList, csvName) => {
    var csvRows = [];
    // All dance CSVs use headers stored in this.state.csvHeaders
    checkinList.map( (checkin) => {
      return csvRows.push([
        checkin.date,
        checkin.uid,
        [checkin.firstName, checkin.lastName].join(' '),
        checkin.email,
        (checkin.classes || ['dance']).join('; '),
        checkin.info,
      ]);
    });
    this.setState({ [csvName]: csvRows })
  };

  componentDidMount() {
    this.getDanceCheckinsFromQuery();
  };

  render() {

    return (
      <div>
        <h4>Activity</h4>
        {this.state.csvDataDance && this.state.csvDataClass &&
          <h5>Stats <CSVLink filename={"dance-data-" + this.state.danceDate + ".csv"} data={this.state.csvDataClass.concat(this.state.csvDataDance)} headers={this.state.csvHeaders} className="btn btn-success">Download Dance Data CSV</CSVLink></h5>
        }
        {/* Used a regular react-strap table here just to display this info nicely */}
        <Table bordered>
          <thead>
            <tr>
              <th>Total Attendees</th>
              <th>Class Check-ins</th>
              <th>Dance Check-ins</th>
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
          {this.state.classCheckinList &&
            <div>
              <h5>Class Check-ins</h5>
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
            </div>
          }
          <br></br>
          {this.state.danceCheckinList &&
            <div>
              <h5>Dance Check-ins</h5>
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
          }
        </div>
      </div>
    );
  }
}

export default DanceCheckinList;
