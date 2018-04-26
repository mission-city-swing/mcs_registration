// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import queryString from 'query-string';
import type { Profile } from "../../types.js";
import { addNewProfile, getProfileByEmail } from "../../lib/api.js";

type State = Profile;

type Props = {};

class StudentInfoForm extends PureComponent<Props, State> {
  state: State = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    discoveryMethod: "",
    discoveryMethodFriend: "",
    discoveryMethodOther: "",
    otherDances: [],
    otherDancesOther: "",
    student: false,
    emailOptIn: false,
    info: ""
  };

  getStudentFromQuery = () => {
    console.log(this.props);
    if (this.props.location) {
      var parsedSearch = queryString.parse(this.props.location.search);
      if (this.props.location.search) {
        var studentEmail = parsedSearch["email"];
        this.getStudentFromEmail(studentEmail);
      }
    }
  };

  getStudentFromEmail = (studentEmail) => {
    getProfileByEmail(studentEmail).on("value", (snapshot) => {
      this.setState(snapshot.val())
    });
  }

  componentDidMount() {
    this.getStudentFromQuery();
  };

  onChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  };

  onMultiChange = (event: any) => {
    const name = event.target.name;
    const checked = event.target.checked;
    const value = event.target.value;

    var newArray = this.state[name].slice()
    if (checked) {
      newArray.push(value);
    } else {
      var index = newArray.indexOf(value);
      newArray.splice(index, 1);
    }
    this.setState({
      [name]: newArray
    });
  };

  clearFormEvent = (event: any) => {
    this.clearForm();
  };

  clearForm() {
    this.setState({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      discoveryMethod: "",
      discoveryMethodFriend: "",
      discoveryMethodOther: "",
      otherDances: [],
      otherDancesOther: "",
      student: false,
      emailOptIn: false,
      info: ""
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    console.log(this.state);
    addNewProfile(this.state);
    // Clear the form
    this.clearForm();
  };

  render() {

    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="firstName">First Name</Label><Input placeholder="First Name" value={this.state.firstName} onChange={this.onChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name</Label><Input placeholder="Last Name" onChange={this.onChange} value={this.state.lastName} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onChange} value={this.state.email} type="email" id="email" name="email" />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label><Input placeholder="123-456-7890" onChange={this.onChange} value={this.state.phoneNumber} type="tel" id="phoneNumber" name="phoneNumber" />
          </FormGroup>
          <br></br>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onChange} name="student" type="checkbox" checked={this.state.student} />
              Student (with valid student ID)
            </Label>
          </FormGroup>
          <br></br>
          <FormGroup tag="fieldset">
            <legend>How did you hear about us?</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'friend'} value="friend" /> Friend
                <Input onChange={this.onChange} name="discoveryMethodFriend" value={this.state.discoveryMethodFriend} />
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'work'} value="work" /> Work
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'web search'} value="web search" /> Web Search
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'flyer'} value="flyer" /> Flyer
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'postcard'} value="postcard" /> Postcard
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'facebook'} value="facebook" /> Facebook
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'yelp'} value="yelp" /> Yelp
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'meetup'} value="meetup" /> Meetup
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'other'} value="other" /> Other
                <Input onChange={this.onChange} name="discoveryMethodOther" value={this.state.discoveryMethodOther} />
              </Label>
            </FormGroup>
          </FormGroup>
          <br></br>
          <FormGroup tag="fieldset">
            <legend>Do you already know any of these partner dances? (Select all that apply.)</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Lindy hop') !== -1} value="Lindy hop" /> {' '} Lindy hop
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Blues') !== -1} value="Blues" /> {' '} Blues
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Country') !== -1} value="Country" /> {' '} Country
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Tango') !== -1} value="Tango" /> {' '} Tango
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Salsa') !== -1} value="Salsa" /> {' '} Salsa
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Other Latin') !== -1} value="Other Latin" /> {' '} Other Latin
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Ballroom') !== -1} value="Ballroom" /> {' '} Ballroom
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Other') !== -1} value="Other" /> {' '} Other
                <Input onChange={this.onChange} name="otherDancesOther" value={this.state.otherDancesOther} />
              </Label>
            </FormGroup>
          </FormGroup>
          <br></br>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onChange} name="emailOptIn" type="checkbox" checked={this.state.emailOptIn} />
              I would like to receive email from Mission City Swing
            </Label>
          </FormGroup>
          <br></br>
          <FormGroup>
            <Label for="info">Other Info</Label><Input type="textarea" placeholder="Misc info" onChange={this.onChange} value={this.state.info} name="info" />
          </FormGroup>
          <br></br>
          <Button outline color="success" type="submit" value="Submit">Submit</Button>
          <Button outline value="clear" onClick={this.clearFormEvent}>Clear Form</Button>

        </Form>

{/*        <br></br>
        <div>
        <code>{JSON.stringify(this.state)}</code>
        </div>
        <br></br>
*/}
      </div>
    );
  }
}

export default StudentInfoForm;
