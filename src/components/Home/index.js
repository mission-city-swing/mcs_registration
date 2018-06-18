// @flow
// src/components/Home/index.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, CardTitle, CardText } from 'reactstrap';
import { getCurrentUser } from "../../lib/api.js";


class Home extends Component {
  state: State = {
    currentUser: {}
  };

  componentDidMount() {
    this.setState({
      currentUser: getCurrentUser()
    });
  }

  render() {

    return (
      <div className="App">
        <div>
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
                  <CardTitle>Returning Student Checkin</CardTitle>
                  <CardText>Check in  a returing student.</CardText>
                  <Link to="/class-checkin"><Button size="lg">Returning Student</Button></Link>
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
