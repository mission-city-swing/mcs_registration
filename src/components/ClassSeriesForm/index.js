// @flow
// src/components/ClassSeriesForm/index.js
import React, { PureComponent } from "react";
import { Form, FormGroup } from 'reactstrap';
import queryString from 'query-string';
import { getAllClassSeries } from "../../lib/api.js";
import ClassSeriesForm from "./form.js"
import ClassSeriesCheckinList from "./checkins.js"
// import ClassSeriesAttendeeList from "./attendees.js"
import { sortByDate } from '../../lib/utils.js';
import McsAlert from '../Utilities/alert.js';

type State = {};

type Props = {};

class ClassSeriesPage extends PureComponent<Props, State> {
  state: State = {
    selected: "",
    classSeriesList: [],
    success: "",
    error: "",
  };

  getAlertFromQuery = () => {
    if (this.props.location) {
      if (this.props.location.search) {
        var parsedSearch = queryString.parse(this.props.location.search);
        if (parsedSearch["success"]) {
          this.setState({success: parsedSearch["success"]})
        }
        if (parsedSearch["error"]) {
          this.setState({error: parsedSearch["error"]})
        }
      }
    }
  };

  onToggleSuccess = () => {
    this.setState({success: ""});
    window.history.replaceState("", "", "/");
  }

  onToggleError = () => {
    this.setState({error: ""});
    window.history.replaceState("", "", "/");
  }

  componentDidMount() {
    this.getAlertFromQuery()

    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var seriesId = parsedSearch["uid"];
      if (seriesId) {
        this.setState({selected: seriesId});
      }
    }

    getAllClassSeries.on("value", (snapshot) => {
      var classSeriesList = [];
      var classSeriesSnap = snapshot.val();
      if (classSeriesSnap) {
        Object.keys(classSeriesSnap).forEach((uid => {
          classSeriesList.push(Object.assign({uid: uid}, classSeriesSnap[uid]))
        }))
        classSeriesList.sort(sortByDate)
      }
      this.setState({classSeriesList: classSeriesList});
    });
  };

  onClassSeriesSelectChange = (event: any) => {
    var value = event.target.value;
    this.setState({
      selected: value
    });
    window.location.href = "/admin/class-series?uid=" + encodeURIComponent(value);
  };

  render() {

    return (
      <div className="App">
        <h1>Class Series</h1>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.onToggleSuccess.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.onToggleError.bind(this)}></McsAlert>
        <div>
          <p>Select a class series to view or update, or create a new class series.</p>
          <Form>
            <FormGroup>
              <select onChange={this.onClassSeriesSelectChange} value={this.state.selected}>
                <option value="">Create a New ClassSeries</option>
                {this.state.classSeriesList.map((classSeries) => {
                  return(
                    <option key={classSeries.uid} value={classSeries.uid}>{classSeries.startDate}, {classSeries.endDate}, {classSeries.level}, {classSeries.title}</option>
                  )
                })}
              </select>
            </FormGroup>
          </Form>
        </div>
        <br></br>
        <div>
          <h4>Class Series Form</h4>
          <ClassSeriesForm {...this.props} ></ClassSeriesForm>
        </div>
        <br></br>
        {this.state.selected && 
          <div>
            <ClassSeriesCheckinList {...this.props}></ClassSeriesCheckinList>
          </div>          
        }
      </div>
    );
  }
}

export default ClassSeriesPage;
