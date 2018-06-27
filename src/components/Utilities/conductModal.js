// @flow
// src/components/Utilities/conductModal.js
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, FormGroup } from 'reactstrap';


class CodeOfConductModalLink extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.confirm = this.confirm.bind(this);
    this.deny = this.deny.bind(this);
    this.state = {
      modalOpen: false
    };
  }

  toggle() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  confirm() {
    this.props.afterConfirm({agree: true});
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  deny() {
    this.props.afterConfirm({agree: false});
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  render() {
    return (
      <FormGroup check>
        <Label check>
          <Input onChange={this.toggle} name="conductAgree" type="checkbox" checked={this.props.checked} />
          <strong>I agree to the Mission City Swing Code of Conduct</strong>
          <Modal {...this.props.modalOptions} size="lg" isOpen={this.state.modalOpen} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Mission City Swing Code of Conduct</ModalHeader>
            <ModalBody>
              <div>
                <p><strong>SHORT VERSION</strong></p>
                <p>Mission City Swing aspires to create a safe, welcoming, and inclusive environment for those who enjoy West Coast Swing. We want everyone to feel comfortable, accepted, and supported, regardless of age, gender, sexual orientation, physical appearance, ability, ethnicity, religion, nationality, or other personal circumstance.</p>
                <p>Our community aspires to live by certain values and principles:</p>
                <ul>
                <li><strong>Respect and compassion.</strong> Everyone deserves to be acknowledged and treated with dignity and kindness. We accept others for who they are and we are responsive to others’ needs, desires, opinions, and preferences.</li>
                <li><strong>Diversity and inclusion.</strong> We welcome anyone and everyone who is interested in joining our community. We celebrate diversity and we appreciate the value of bringing different people together for a shared purpose.</li>
                <li><strong>Safety and comfort.</strong> We seek to ensure that everyone feels secure and at ease in our community. We work to create a supportive and nurturing environment and to prevent physical, emotional, or psychological injury and abuse of any kind.</li>
                <li><strong>Community and citizenship.</strong> We value relationships and connecting with others, a sense of fellowship and camaraderie, and supporting one another to achieve our goals. We believe that each of us has a part to play in creating, shaping, and sustaining our community.</li>
                </ul>
                <p>To ensure that everyone has fun in our community, we have a Code of Conduct which describes a set of norms and behaviors for people to follow. You may ask to see the Code of Conduct at the front desk or you may view it in full below.</p>
                <p>We do not tolerate harassment or abuse of any kind. The reason does not matter – such behavior is unacceptable. Any behavior which makes another person feel unsafe or uncomfortable to the point of being unable to enjoy their experience at Mission City Swing can be considered harassment. <strong>We reserve the right to remove or ban anyone who does not abide by our Code of Conduct.</strong></p>
                <p>If you experience harassment at MCS, or notice someone else being harassed, please contact one of our staff right away, so we can help put a stop to it. You can find MCS staff on duty at the front desk, or at the DJ booth when registration is closed. You can directly contact Eric at (510) 545-3173 or you may <a href="https://missioncityswing.com/contact/" target="_blank" rel="noopener noreferrer">contact us online</a>. We promise to listen and to treat you with respect and confidentiality.</p>
                <p>We want Mission City Swing to be a place where everyone and anyone can have a good time sharing in their passion for dancing. We are grateful for your help in fostering a safe, comfortable, and welcoming environment for all.</p>
              </div>
              <div>
                <a href="https://missioncityswing.files.wordpress.com/2017/12/mcs-code-of-conduct-2017.pdf" target="_blank" rel="noopener noreferrer">Read the full version (PDF) here</a>
              </div>
            </ModalBody>
            <ModalFooter>
              <div>
                <Button color="success" onClick={this.confirm}>I agree</Button><span className="mr-1"></span><Button color="danger" onClick={this.deny}> I do not agree</Button>
              </div>
            </ModalFooter>
          </Modal>
          </Label>
        </FormGroup>
    );
  }
}

export { CodeOfConductModalLink };
