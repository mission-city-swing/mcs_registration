// @flow
// src/components/Home/index.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, CardTitle, CardText } from 'reactstrap';
import queryString from 'query-string';
import { getCurrentUser } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js";


class Home extends Component {
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

  render() {

    return (
      <div className="App">
        <div>
          <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0}></McsAlert>
          <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0}></McsAlert>
          <Container>
            <Row>
              <Col>
                <Card className="card-body text-center">
                  <CardTitle>New Student Form</CardTitle>
                  <CardText>Fill out new student details form.</CardText>
                  <Link to="/new-student"><Button size="lg">New Student</Button></Link>
                </Card>
              </Col>
              <Col>
                <Card className="card-body text-center">
                  <CardTitle>Returning Student Class Checkin</CardTitle>
                  <CardText>Returning students check in here.</CardText>
                  <Link to="/class-checkin"><Button size="lg">Class Checkin</Button></Link>
                </Card>
              </Col>
              <Col>
                <Card className="card-body text-center">
                  <CardTitle>Dance Checkin</CardTitle>
                  <CardText>Check into the dance.</CardText>
                  <Link to="/dance-checkin"><Button size="lg">Dance Checkin</Button></Link>
                </Card>

              </Col>
            </Row>
          </Container>
        </div>
        <br></br>
        <div>
        Current User: { this.state.currentUser.email || "Not Signed In" }
        </div>
        <br></br>
      </div>
    );
  }
}

export default Home;
