// @flow
// src/components/EventForm/form.js
import React, { PureComponent } from "react";
import { Table } from 'reactstrap';
import ReactTable from 'react-table';
import queryString from 'query-string';
import { getEvent, getEventCheckinByDate, getEventCheckinByEventId } from "../../lib/api.js";
import { reactTableFuzzyMatchFilter } from '../../lib/utils.js'

type State = {};

type Props = {};

class EventCheckinList extends PureComponent<Props, State> {
  state: State = {
    eventCheckinList: [],
  }

  getEventCheckinsFromQuery = () => {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var eventId = parsedSearch["uid"];
      if (eventId) {
        getEvent(eventId).on("value", (snapshot) => {
          if (snapshot.val()) {
            this.getCheckinsFromEvent(eventId, snapshot.val().date);
          } else {
            window.location.href = "/admin/event?error=No event with ID " + eventId;
          }
        });
      }
    }
  };

  getCheckinsFromEvent = (eventId, eventDate) => {
    getEventCheckinByEventId(eventId).on("value", (snapshot) => {
      var eventCheckinList = [];
      if (snapshot.val()) {
        console.log(snapshot.val());
        var checkinListObj = snapshot.val();
        Object.keys(checkinListObj).map(function(uid) {
          return eventCheckinList.push(Object.assign({uid: uid}, checkinListObj[uid]))
        })
        this.setState({eventCheckinList: eventCheckinList});
      } else {
        getEventCheckinByDate(eventDate).on("value", (snapshot) => {
          var eventCheckinList = [];
          if (snapshot.val()) {
            console.log(snapshot.val());
            var checkinListObj = snapshot.val();
            Object.keys(checkinListObj).map(function(uid) {
              return eventCheckinList.push(Object.assign({uid: uid}, checkinListObj[uid]))
            })
            this.setState({eventCheckinList: eventCheckinList});
          }
        });
      }
    });
  };

  componentDidMount() {
    this.getEventCheckinsFromQuery();
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
              {/* Would like to have the count of checkins per checkin type, need a helper method to pull the checkins per type */}
              {/* Need a helper method to pull the checkins per type */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.eventCheckinList.length}</td>
            </tr>
          </tbody>
        </Table>
        <div>
          <h5>Event Check-ins</h5>
          <ReactTable
            data={this.state.eventCheckinList}
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
              Header: "Checkin Items",
              id: "checkinItems",
              accessor: (d) => d.checkinItems.join('; ')
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

export default EventCheckinList;
