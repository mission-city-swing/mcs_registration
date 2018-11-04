// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { Profile } from "../../types.js";
import { createOrUpdateProfile, getProfileByEmail, getAppDate, getProfileByName } from "../../lib/api.js";
import { getSubstringIndex, getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";


type State = Profile;

type Props = {};

class AdminStudentInfoForm extends PureComponent<Props, State> {

  defaultFields = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    memberDate: getAppDate(),
    discoveryMethod: "",
    discoveryMethodFriend: "",
    discoveryMethodOther: "",
    otherDances: [],
    otherDancesOther: "",
    student: false,
    emailOptOut: false,
    waiverAgree: true,
    conductAgree: true,
    paymentType: null,
    amt: 0,
    adminInitial: "",
    newDancer: false,
    classes: []
  };

  state: State = Object.assign({...this.defaultFields}, {
    success: "",
    error: ""
  });

  componentDidMount() {
    // When updating student info, we use the same form
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

  getStudentFromEmailBlur = (event: any) => {
    this.getStudentFromEmail(event.target.value);
  }

  getStudentFromEmail = (studentEmail) => {
    getProfileByEmail(studentEmail).on("value", (snapshot) => {
      if (snapshot.val()) {
        var profile = snapshot.val().profile;
        profile.memberDate = profile.memberDate ? new Date(profile.memberDate) : null;
        this.setState(profile);
      }
    });
  };

  getStudentFromNameBlur = (event: any) => {
    var lastName = event.target.value;
    this.getStudentFromName(this.state.firstName, lastName);
  };

  getStudentFromName = (firstName, lastName) => {
    getProfileByName(firstName, lastName).then( (profile) => {
      if (profile) {
        profile.memberDate = profile.memberDate ? new Date(profile.memberDate) : null;
        this.setState(profile);
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

  onMultiTypeChange = (event: any) => {
    var [name, checked, value] = [event.target.name, event.target.checked, event.target.value];
    var valueType = value.split(', ')[0];
    var newArray = this.state[name].slice()
    var typeIndex = getSubstringIndex(newArray, valueType);
    var valueIndex = newArray.indexOf(value);
    if (checked) {
      if (typeIndex === -1) {
        newArray.push(value);
      } else {
        newArray.splice(typeIndex, 1);
        newArray.push(value);
      }
    } else {
      newArray.splice(valueIndex, 1);
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
    var email = [this.state.firstName.toLowerCase(), this.state.lastName.toLowerCase(), dateString + '@mcs-fake-generated.com'].join('+')
    return email
    // this.setState({email: email})
  }

  onSubmit = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    var onSuccess = () => {
      var successText = "Updated profile for " + this.state.firstName + " " + this.state.lastName;
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
      if (!toSubmit.email) {
        toSubmit["email"] = this.generateFakeEmail();
      }
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
        <McsAlert color="success" text={this.state.success} visible={this.state.success.length > 0} onToggle={this.toggleAlerts.bind(this)} timeout={5}></McsAlert>
        <McsAlert color="danger" text={this.state.error} visible={this.state.error.length > 0} onToggle={this.toggleAlerts.bind(this)}></McsAlert>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="firstName">First Name <span className="required-text">*required</span></Label><Input placeholder="First Name" value={this.state.firstName} onChange={this.onChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name <span className="required-text">*required</span></Label><Input placeholder="Last Name" onChange={this.onChange} onBlur={this.getStudentFromNameBlur} value={this.state.lastName} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label form="email" type="email">Email</Label>
            <Input placeholder="me@example.com" onChange={this.onChange} onBlur={this.getStudentFromEmailBlur} value={this.state.email} type="email" id="email" name="email" />
          </FormGroup>
          <br></br>
          <FormGroup>
            <Label>Phone Number</Label><Input placeholder="123-456-7890" onChange={this.onChange} value={this.state.phoneNumber} type="tel" id="phoneNumber" name="phoneNumber" />
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
          <br></br>
          <FormGroup tag="fieldset">
            <legend>What classes would you like to register for? (Select all that apply.)</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="classes" checked={this.state.classes.indexOf('WCS Fundamentals, Drop-in') !== -1} value="WCS Fundamentals, Drop-in" /> {' '} WCS Fundamentals, Drop-in
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="classes" checked={this.state.classes.indexOf('WCS Fundamentals, Monthly Series') !== -1} value="WCS Fundamentals, Monthly Series" /> {' '} WCS Fundamentals, Monthly Series
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="classes" checked={this.state.classes.indexOf('Intermediate WCS, Drop-in') !== -1} value="Intermediate WCS, Drop-in" /> {' '} Intermediate WCS, Drop-in
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onMultiTypeChange} type="checkbox" name="classes" checked={this.state.classes.indexOf('Intermediate WCS, Monthly Series') !== -1} value="Intermediate WCS, Monthly Series" /> {' '} Intermediate WCS, Monthly Series
              </Label>
            </FormGroup>
          </FormGroup>
          <br></br>
          <FormGroup tag="fieldset">
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} name="emailOptOut" type="checkbox" checked={this.state.emailOptOut} />
                <strong>"Please check here if you do not wish to receive email updates from Mission City Swing"</strong>
              </Label>
            </FormGroup>
          </FormGroup>
          <br></br>
          <h5>"For Office Use Only"</h5>
          <FormGroup>
            <Label for="amt">Amt</Label><Input type="number" value={this.state.amt} onChange={this.onChange} name="amt" />
          </FormGroup>
          <FormGroup tag="fieldset">
            <legend className="h6">Payment Type</legend>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="paymentType" checked={this.state.paymentType === "cash"} value="cash" /> Ca
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="paymentType" checked={this.state.paymentType === "check"} value="check" /> Ch
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} type="radio" name="paymentType" checked={this.state.paymentType === "credit"} value="credit" /> Cr
              </Label>
            </FormGroup>
          </FormGroup>
          <FormGroup tag="fieldset">
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} name="student" type="checkbox" checked={this.state.student} />
                <strong>Full time student, must show valid student ID ("St")</strong>
              </Label>
            </FormGroup>
          </FormGroup>
          <FormGroup tag="fieldset">
            <FormGroup check>
              <Label check>
                <Input onChange={this.onChange} name="newDancer" type="checkbox" checked={this.state.newDancer} />
                <strong>New dancer ("ND")</strong>
              </Label>
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Label for="adminInitial">Admin Initial</Label><Input value={this.state.adminInitial} onChange={this.onChange} name="adminInitial" />
          </FormGroup>
          <br></br>
          <FormGroup>
            <Label for="memberDate">Member Since (date on form)</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={getDateFromStringSafe(this.state.memberDate)}
              name="memberDate"
              onChange={this.onMemberDateChange}
            />
          </FormGroup>
          <br></br>
          <Button value="submit" onClick={this.onSubmit}>Admin Submit</Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(AdminStudentInfoForm);
