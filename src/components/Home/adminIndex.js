// @flow
// src/components/Home/index.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, CardTitle, CardText } from 'reactstrap';
import queryString from 'query-string';
import { getCurrentUser } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js";


class AdminHome extends Component {
  state: State = {
    currentUser: {},
    success: "",
    error: ""
  };

  componentDidMount() {
    this.setState({
      currentUser: getCurrentUser()
    });
    this.getAlertFromQuery();
  }

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


  render() {

    return (
      <div className="App">
        <div>
          <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.onToggleSuccess.bind(this)}></McsAlert>
          <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.onToggleError.bind(this)}></McsAlert>
          <Container>
          { !(this.state.currentUser && this.state.currentUser.isAdmin) &&
            <Row>
              <Col>
                <Card className="card-body text-center mb-2">
                  <CardTitle>Sign In</CardTitle>
                  <CardText>Sign in or create a new admin user.</CardText>
                  <Link to="/signin"><Button size="lg">Sign In</Button></Link>
                </Card>
              </Col>
            </Row>
          }
          { this.state.currentUser && this.state.currentUser.isAdmin &&
            <Row>
              <Col>
                <Card className="card-body text-center mb-2">
                  <CardTitle className="front-page-card">View a Dance</CardTitle>
                  <CardText className="front-page-card">View or create a dance object to see stats about checkins.</CardText>
                  <Link to="/admin/dance"><Button size="lg">View a Dance</Button></Link>
                </Card>
              </Col>
              <Col>
                <Card className="card-body text-center mb-2">
                  <CardTitle className="front-page-card">Update Student Info</CardTitle>
                  <CardText className="front-page-card">Update or add admin info about an existing student.</CardText>
                  <Link to="/admin/student"><Button size="lg">Update Student Info</Button></Link>
                </Card>
              </Col>
              <Col>
                <Card className="card-body text-center mb-2">
                  <CardTitle className="front-page-card">New Student Form</CardTitle>
                  <CardText className="front-page-card">Create a student object from paper forms.</CardText>
                  <Link to="/admin/new-student"><Button size="lg">New Student</Button></Link>
                </Card>
              </Col>
              <Col>
                <Card className="card-body text-center mb-2">
                  <CardTitle className="front-page-card">Create or View an Event</CardTitle>
                  <CardText className="front-page-card">Create a special event or view stats.</CardText>
                  <Link to="/admin/event"><Button size="lg">Create or View an Event</Button></Link>
                </Card>
              </Col>
            </Row>
          }
          </Container>
        </div>
      </div>
    );
  }
}

export default AdminHome;
