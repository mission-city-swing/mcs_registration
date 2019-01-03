// @flow
// src/components/NewStudentForm/form.js
import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import queryString from 'query-string';
import type { Profile } from "../../types.js";
import { createOrUpdateProfile, getProfileByEmail, getAppDate, getProfileByName } from "../../lib/api.js";
import { getDateFromStringSafe } from "../../lib/utils.js";
import McsAlert from "../Utilities/alert.js";
import { ConfirmButtonPopover } from "../Utilities/confirmButton.js";
import { CodeOfConductModalLink } from "../Utilities/conductModal.js";
import { LiabilityWaiverModalLink } from "../Utilities/waiverModal.js";


type State = Profile;

type Props = {};

class StudentInfoForm extends PureComponent<Props, State> {

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
    emailOptOut: false,
    waiverAgree: false,
    conductAgree: false
  };

  state: State = Object.assign({...this.defaultFields}, {
    success: "",
    error: ""
  });

  componentDidMount() {
    // When updating student info, we use the same form
    this.getStudentFromQuery();
    // Set function for additional actions on submit, like a redirect
    if (this.props.addActionsOnSubmit) {
      this.addActionsOnSubmit = this.props.addActionsOnSubmit
    } else {
      this.addActionsOnSubmit = () => {}
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
        this.setProfileStateFromSnaphshot(snapshot.val().profile);
      }
    });
  };

  getStudentFromEmailBlur = (event: any) => {
    this.getStudentFromEmail(event.target.value);
  };

  getStudentFromNameBlur = (event: any) => {
    var lastName = event.target.value;
    this.getStudentFromName(this.state.firstName, lastName);
  };

  getStudentFromName = (firstName, lastName) => {
    getProfileByName(firstName, lastName).then( (profile) => {
      if (profile) {
        this.setProfileStateFromSnaphshot(profile);
      }
    });
  };

  setProfileStateFromSnaphshot = (profileSnap) => {
    profileSnap.birthday = profileSnap.birthday ? new Date(profileSnap.birthday) : null
    profileSnap.memberDate = profileSnap.memberDate ? new Date(profileSnap.memberDate) : null
    this.setState(profileSnap);
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

  afterWaiverConfirm(args) {
    this.setState({waiverAgree: args.agree});
  }

  afterConductConfirm(args) {
    this.setState({conductAgree: args.agree});
  }

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

  confirmCoc(options) {
    this.setState({
      conductAgree: options.agree
    })
  }

  onSubmit = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    // Validate form
    var onSuccess = () => {
      var successText = "Created or updated profile for " + this.state.email
      this.setState({success: successText});
      this.clearForm();

      this.addActionsOnSubmit({
        email: this.state.email,
        newDancer: !this.state.otherDances.includes("West Coast Swing")
      });
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
          <h5>Basic Info</h5>
          <FormGroup>
            <Label for="firstName">First Name</Label><Input placeholder="First Name" value={this.state.firstName} onChange={this.onChange} name="firstName" />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name</Label><Input placeholder="Last Name" onChange={this.onChange} onBlur={this.getStudentFromNameBlur} value={this.state.lastName} name="lastName" />
          </FormGroup>
          <FormGroup>
            <Label form="email" type="email">Email</Label><Input placeholder="me@example.com" onChange={this.onChange} onBlur={this.getStudentFromEmailBlur} value={this.state.email} type="email" id="email" name="email" />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label><Input placeholder="123-456-7890" onChange={this.onChange} value={this.state.phoneNumber} type="tel" id="phoneNumber" name="phoneNumber" />
          </FormGroup>
          <FormGroup>
            <Label for="birthday">Birthday (so that we can invite you to birthday jams)</Label>
            <DateTimePicker 
              time={false}
              format={'MMMM D'}
              value={getDateFromStringSafe(this.state.birthday)}
              name="birthday"
              onChange={this.onBirthdayChange}
              views={['month']}
              footer={false}
              headerFormat={'MMMM'}
            />
            <Button outline onClick={this.clearBirthday}>Clear Date</Button>
          </FormGroup>
          <br></br>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onChange} name="student" type="checkbox" checked={this.state.student} />
              <strong>Full time student, must show valid student ID</strong>
            </Label>
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
          <h5>Email Preferences</h5>
          <FormGroup check>
            <Label check>
              <Input onChange={this.onChange} name="emailOptOut" type="checkbox" checked={this.state.emailOptOut} />
              <strong>Please check here if you do not wish to receive email from Mission City Swing</strong>
            </Label>
          </FormGroup>
          <br></br>
          <h5>Legal Stuff</h5>
          <LiabilityWaiverModalLink checked={this.state.waiverAgree} afterConfirm={this.afterWaiverConfirm.bind(this)}  />
          <br></br>
          <CodeOfConductModalLink checked={this.state.conductAgree} afterConfirm={this.afterConductConfirm.bind(this)} />
          <br></br>
          <FormGroup>
            <Label for="memberDate">Member Since</Label>
            <DateTimePicker 
              time={false}
              format={'dddd, MMMM Do YYYY'}
              value={getDateFromStringSafe(this.state.memberDate)}
              name="memberDate"
              onChange={this.onMemberDateChange}
            />
          </FormGroup>
          <br></br>
          <ConfirmButtonPopover buttonOptions={{color: "primary"}} popoverOptions={{placement: "top"}} afterConfirm={this.onSubmit} popoverHeader="Confirm Your Information" popoverBody="Please confirm that your name and email are correct and that you have signed our liability waiver and code of conduct.">Submit</ConfirmButtonPopover>
          <span className="mr-1"></span>
          <Button value="clear" onClick={this.clearFormEvent}>Clear Form</Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(StudentInfoForm);
