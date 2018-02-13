// @flow
// src/components/NewStudentForm/index.js
import React, { PropTypes, PureComponent } from "react";
import type { User } from "../../types.js";
import { addNewUser } from "../../lib/api.js";

type State = User;

type Props = {};

class Home extends PureComponent<Props, State> {
  state: State = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    discoveryMethod: ""
  };

  onChange = (event: any) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    // Validate form
    addNewUser(this.state);
  };

  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>New Student</h1>
        <p>Some text about the new student stuff</p>
        <form onSubmit={this.onSubmit}>
          <div className="formItem">
            <label>
              First Name:
              <input onChange={this.onChange} type="text" name="firstName" />
            </label>
          </div>
          <div className="formItem">
            <label>
              Last Name:
              <input onChange={this.onChange} type="text" name="lastName" />
            </label>
          </div>
          <div className="formItem">
            <label>
              Email:
              <input
                onChange={this.onChange}
                type="email"
                id="email"
                name="email"
              />
            </label>
          </div>
          <div className="formItem">
            <label>
              Phone Number:
              <input
                onChange={this.onChange}
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
              />
            </label>
          </div>
          <div className="formItem">
            <label>
              How did you hear about us?
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                    value="friend"
                  />
                  Friend
                </label>
              </div>
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                    value="work"
                  />
                  Work
                </label>
              </div>
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                    value="flyer"
                  />
                  Flyer
                </label>
              </div>
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                    value="facebook"
                  />
                  Facebook Ad
                </label>
              </div>
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                    value="yelp"
                  />
                  Yelp
                </label>
              </div>
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                    value="sosh"
                  />
                  Sosh
                </label>
              </div>
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                    value="meetup"
                  />
                  Meetup
                </label>
              </div>
              <div>
                <label>
                  <input
                    onChange={this.onChange}
                    type="radio"
                    name="discoveryMethod"
                  />
                  Other
                  <input
                    onChange={this.onChange}
                    type="text"
                    name="discoveryMethod"
                  />
                </label>
              </div>
            </label>
          </div>
          <div>
            <button type="submit" value="Submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Home;
