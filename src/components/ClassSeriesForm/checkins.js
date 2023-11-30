// @flow
// src/components/ClassSeriesForm/form.js
import React, { PureComponent } from "react";
import { Table } from 'reactstrap';
import { CSVLink } from 'react-csv';
import ReactTable from 'react-table';
import queryString from 'query-string';
import { getOneClassSeries, getClassSeriesCheckinsByClassSeriesId } from "../../lib/api.js";
import { getDateFromStringSafe, sortDateStrings, reactTableFuzzyMatchFilter, averageValueOfArray } from '../../lib/utils.js'

type State = {};

type Props = {};

class ClassSeriesCheckinList extends PureComponent<Props, State> {
  state: State = {
    classSeriesId: "",
    classSeriesCheckinList: [],
    csvData: [],
    csvHeaders: [],
    classSeriesUniqueStudents: 0,
    classSeriesFirstWeek: null,
    classSeriesLastWeek: null,
    classSeriesCheckinsFirstWeek: 0,
    classSeriesCheckinsLastWeek: 0,
    classSeriesAverageCheckinsPerWeek: 0,
  }

  getClassSeriesCheckinsFromQuery = () => {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var classSeriesId = parsedSearch["uid"];
      if (classSeriesId) {
        getOneClassSeries(classSeriesId).on("value", (snapshot) => {
          if (snapshot.val()) {
            this.setState({classSeriesId: classSeriesId});
            this.getCheckinsFromClassSeries(classSeriesId);
          } else {
            window.location.href = "/admin/class-series?error=No class series with ID " + classSeriesId;
          }
        });
      }
    }
  };

  makeCsvData = (classSeriesCheckinList) => {
    var csvRows = [];
    var headers = ['ClassSeries ID', 'Date', 'Check-in ID', 'Name', 'Email', 'Checkin Items', 'Checkin Info']
    classSeriesCheckinList.map( (checkin) => {
      return csvRows.push([
        checkin.classSeriesId || this.state.classSeriesId,
        checkin.date,
        checkin.uid,
        [checkin.firstName, checkin.lastName].join(' '),
        checkin.email,
        (checkin.classes || []).join("; "),
        checkin.info,
      ]);
    });
    this.setState({csvData: csvRows, csvHeaders: headers})
  };

  setCheckinDataFromList = (classSeriesCheckinList) => {
    this.setState({classSeriesCheckinList: classSeriesCheckinList});
    this.makeCsvData(classSeriesCheckinList);
    this.setState({classSeriesUniqueStudents: [...new Set(classSeriesCheckinList.map((checkin) => checkin.email))].length});
    this.getAverageCheckinsPerWeekFromList(classSeriesCheckinList);
  };

  getCheckinsFromClassSeries = (classSeriesId) => {
    getClassSeriesCheckinsByClassSeriesId(classSeriesId).then((classSeriesCheckinList) => {
      if (classSeriesCheckinList) {
        this.setCheckinDataFromList(classSeriesCheckinList);
      }
    });
  };

  getAverageCheckinsPerWeekFromList = (classSeriesCheckinList) => {
    var checkinDates = [...new Set(classSeriesCheckinList.map((checkin) => checkin.date))];
    sortDateStrings(checkinDates);
    var checkinsByDate = {};
    // Fill out checkinsByDate
    checkinDates.map( (checkinDate) => {
      checkinsByDate[checkinDate] = 0;
    });
    classSeriesCheckinList.map( (checkin) => {
      var checkinDate = checkin.date;
      checkinsByDate[checkinDate] = checkinsByDate[checkinDate] + 1;
    });
    // Pull checkins for first and last dates
    var maxDate = checkinDates[0];
    var minDate = checkinDates[checkinDates.length - 1];
    this.setState({
      classSeriesFirstWeek: minDate,
      classSeriesLastWeek: maxDate,
      classSeriesCheckinsFirstWeek: checkinsByDate[minDate],
      classSeriesCheckinsLastWeek: checkinsByDate[maxDate],
    });
    // Average class checkin count
    var averageCheckins = 0;
    averageCheckins = averageValueOfArray(Object.values(checkinsByDate));
    this.setState({classSeriesAverageCheckinsPerWeek: averageCheckins});
  }

  componentDidMount() {
    this.getClassSeriesCheckinsFromQuery();
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
              <th>Total Checkins</th>
              <th>Unique Students</th>
              <th>First Week Checkins | {this.state.classSeriesFirstWeek}</th>
              <th>Last Week Checkins | {this.state.classSeriesLastWeek}</th>
              <th>Average Checkins Per Week</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.classSeriesCheckinList.length}</td>
              <td>{this.state.classSeriesUniqueStudents}</td>
              <td>{this.state.classSeriesCheckinsFirstWeek}</td>
              <td>{this.state.classSeriesCheckinsLastWeek}</td>
              <td>{this.state.classSeriesAverageCheckinsPerWeek}</td>
            </tr>
          </tbody>
        </Table>
        <div>
          <h5>Class Series Check-ins <CSVLink filename={"event-data-" + this.state.classSeriesId + ".csv"} data={this.state.csvData} headers={this.state.csvHeaders} className="btn btn-success">Download CSV</CSVLink></h5>
          <ReactTable
            data={this.state.classSeriesCheckinList}
            columns={[{
              Header: "Date",
              accessor: "date",
              id: "date",
              maxWidth: 200
            }, {
              Header: "Name",
              accessor: (d) => [d.firstName, d.lastName].join(' '),
              id: "name",
              maxWidth: 300
            }, {
              Header: "Email",
              accessor: "email",
              maxWidth: 300
            }, {
              Header: "Checkin Items",
              id: "checkinItems",
              accessor: (d) => (d.classes || []).join('; ')
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

export default ClassSeriesCheckinList;
