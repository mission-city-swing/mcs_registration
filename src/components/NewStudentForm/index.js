// src/components/NewStudentForm/index.js
import React, { PropTypes, Component } from 'react';

class Home extends Component {
  render() {
    const { ...props } = this.props;
    return (
      <div className="App">
        <h1>New Student</h1>
        <p>Some text about the new student stuff</p>
        <form>
          <div className="formItem">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" />	
          </div>
          <div className="formItem">
            <label for="lastName">First Name</label>
            <input type="text" id="lastName" name="lastName" />	
          </div>
          <div className="formItem">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" />	
          </div>
          <div className="formItem">
            <label for="phoneNumber">First Name</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" />
          </div>
          <div className="formItem">
            <label for="discoveryMethod">How did you hear about us?</label>
            <div>
              <input type="radio" name="discoveryMethod" value="friend" />
              <label for="friend">Friend</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="work" />
              <label for="work">Work</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="flyer" />
              <label for="flyer">Flyer</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="facebook" />
              <label for="facebook">Facebook Ad</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="yelp" />
              <label for="yelp">Yelp</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="sosh" />
              <label for="sosh">Sosh</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="meetup" />
              <label for="meetup">Meetup</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="yelp" />
              <label for="friend">Yelp</label>
            </div>
            <div>
              <input type="radio" name="discoveryMethod" value="" />
              <label for="other">Other</label>
              <input type="text" name="otherReason" />            
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Home;