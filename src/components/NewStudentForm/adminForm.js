// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { Profile } from "../../types.js";
import { createOrUpdateProfile, getProfileByEmail, getAppDate } from "../../lib/api.js";
import McsAlert from "../Utilities/alert.js";


type State = Profile;

type Props = {};

class AdminStudentInfoForm extends PureComponent<Props, State> {

  defaultFields = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthday: null,
    memberDate: getAppDate(),
    discoveryMethod: "",
    discoveryMethodFriend: "",
    discoveryMethodOther: "",
    otherDances: [],
    otherDancesOther: "",
    student: false,
    emailOptIn: true,
    waiverAgree: true,
    conductAgree: true
  };

  state: State = Object.assign({...this.defaultFields}, {
    success: "",
    error: ""
  });

  componentDidMount() {
    // When updating student info, we use the same form
    this.getStudentFromQuery();
    this.setErrorParamsFromQuery()
    // Set function for additional actions on submit, like a redirect
    if (this.props.addActionsOnSubmit) {
      this.addActionsOnSubmit = this.props.addActionsOnSubmit
    } else {
      this.addActionsOnSubmit = () => {}
    }
  };


  setErrorParamsFromQuery = () => {
    if (this.props.location) {
      if (this.props.location.search) {
        var parsedSearch = queryString.parse(this.props.location.search);
        this.setState({
          success: parsedSearch["success"] || "",
          error: parsedSearch["error"] || "",
        });
      }
    }
  };


  getStudentFromQuery = () => {
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
      if (snapshot.val()) {
        var profile = snapshot.val().profile;
        profile.birthday = new Date(profile.birthday)
        profile.memberDate = new Date(profile.memberDate)
        this.setState(profile)
      }
    });
  };

  onChange = (event: any) => {
    var name = event.target.name;
    var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  };

  clearDiscovery = (discoveryMethod: string) => {
    this.setState({
      discoveryMethod: discoveryMethod,
      discoveryMethodFriend: "",
      discoveryMethodOther: ""
    })
  };

  onDiscoveryChange = (event: any) => {
    this.clearDiscovery(event.target.name);
    this.onChange(event);
  };

  onDiscoveryTextBoxChange = (event: any) => {
    var name = event.target.name;
    this.clearDiscovery(name);
    var value;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else {
      value = event.target.value;
      // If text box is not empty, also set the discoveryMethod
      if (value) {
        this.setState({
          'discoveryMethod': event.target.name === 'discoveryMethodFriend' ? 'friend' : 'other'
        });
      }
    }
    this.setState({
      [name]: value
    });
  };

  onBirthdayChange = (value) => {
    this.setState({birthday: value});
  };

  clearBirthday = () => {
    this.onBirthdayChange(null)
  };

  onMemberDateChange = (value) => {
    this.setState({memberDate: value});
  };

  onMultiChange = (event: any) => {
    var [name, checked, value] = [event.target.name, event.target.checked, event.target.value];
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
    this.setState({...this.defaultFields});
  };

  toggleAlerts(event: any) {
    console.log(event)
    this.setState({
      success: "",
      error: ""
    });
  };

  generateFakeEmail = () => {
    // Sometimes with the paper forms, people didn't put an email address
    // With this new system, we key eveything by email address, so we need
    // to be able to enter _something_
    var dateString = [this.state.memberDate.getFullYear(), this.state.memberDate.getMonth(), this.state.memberDate.getDate()].join('.')
    var email = this.state.firstName.toLowerCase() + '+' + this.state.lastName.toLowerCase() + '+' + dateString + '@mcs-fake-generated.com'
    this.setState({email: email})
  }

  onSubmit = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    // Validate form
    var onSuccess = () => {
      var successText = "Updated profile for " + this.state.email
      this.setState({success: successText});
      window.location.href = "/admin/new-student?success=" + encodeURIComponent(successText);
    }
    var onError = (errorText) => {
      this.setState({error: errorText});
    }

    try {
      var toSubmit = {};
      var newState = {...this.state};
      Object.keys(this.defaultFields).map(function(key) {
        return toSubmit[key] = newState[key];
      })

      createOrUpdateProfile(toSubmit).then(function(success) {
        onSuccess();
      }).catch(function(error) {
        onError(error.toString());
      })
    } catch(error) {
      onError(error.toString());
    }
  };

  render() {

    return (
      <div>
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <h5>Minimum Info</h5>
          <FormGroup>
            <Label for="firstName">First Name (required)</Label><Input placeholder="First Name" value={this.state.firstName} onChange={this.onChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name (required)</Label><Input placeholder="Last Name" onChange={this.onChange} value={this.state.lastName} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label form="email" type="email">Email</Label>
            <Input placeholder="me@example.com" onChange={this.onChange} value={this.state.email} type="email" id="email" name="email" />
            <Button outline onClick={this.generateFakeEmail}>Generate</Button>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onChange} name="student" type="checkbox" checked={this.state.student} />
              <strong>Full time student, must show valid student ID</strong>
            </Label>
          </FormGroup>
          <br></br>
          <FormGroup>
            <Label for="memberDate">Member Since</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={this.state.memberDate}
              name="memberDate"
              onChange={this.onMemberDateChange}
            />
          </FormGroup>
          <br></br>
          <h5>Additional Info</h5>
          <FormGroup>
            <Label>Phone Number</Label><Input placeholder="123-456-7890" onChange={this.onChange} value={this.state.phoneNumber} type="tel" id="phoneNumber" name="phoneNumber" />
          </FormGroup>
          <FormGroup>
            <Label for="birthday">Birthday</Label>
            <DateTimePicker
              time={false}
              format={'MMMM D'}
              value={this.state.birthday}
              name="birthday"
              onChange={this.onBirthdayChange}
              views={['month']}
              footer={false}
              headerFormat={'MMMM'}
            />
            <Button outline onClick={this.clearBirthday}>Clear Date</Button>
          </FormGroup>
          <br></br>
          <FormGroup tag="fieldset">
            <legend className="h5">How did you hear about us?</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryTextBoxChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'friend'} value="friend" /> Friend
                <Input onChange={this.onDiscoveryTextBoxChange} name="discoveryMethodFriend" value={this.state.discoveryMethodFriend} />
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'web search'} value="web search" /> Web Search
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'flyer'} value="flyer" /> Flyer
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'postcard'} value="postcard" /> Postcard
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'facebook'} value="facebook" /> Facebook
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'yelp'} value="yelp" /> Yelp
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'meetup'} value="meetup" /> Meetup
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onDiscoveryTextBoxChange} type="radio" name="discoveryMethod" checked={this.state.discoveryMethod === 'other'} value="other" /> Other
                <Input onChange={this.onDiscoveryTextBoxChange} name="discoveryMethodOther" value={this.state.discoveryMethodOther} />
              </Label>
            </FormGroup>
          </FormGroup>
          <br></br>
          <FormGroup tag="fieldset">
            <legend className="h5">Do you already know any of these partner dances? (Select all that apply.)</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('West Coast Swing') !== -1} value="West Coast Swing" /> West Coast Swing
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Lindy Hop') !== -1} value="Lindy Hop" /> Lindy Hop
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Blues') !== -1} value="Blues" /> Blues
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Ballroom') !== -1} value="Ballroom" /> Ballroom
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Country') !== -1} value="Country" /> Country
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Salsa') !== -1} value="Salsa" /> Salsa
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Tango') !== -1} value="Tango" /> Tango
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Zouk') !== -1} value="Zouk" /> Zouk
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Other Latin') !== -1} value="Other Latin" /> Other Latin
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiChange} type="checkbox" name="otherDances" checked={this.state.otherDances.indexOf('Other') !== -1} value="Other" /> Other
                <Input onChange={this.onChange} name="otherDancesOther" value={this.state.otherDancesOther} />
              </Label>
            </FormGroup>
          </FormGroup>
          <Button value="submit" onClick={this.onSubmit}>Admin Submit</Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(AdminStudentInfoForm);
