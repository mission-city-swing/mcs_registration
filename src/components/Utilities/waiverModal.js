// @flow
// src/components/Utilities/conductModal.js
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class LiabilityWaiverModalLink extends React.Component {
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
      <span>
        <a onClick={this.toggle}>
          {this.props.children}
        </a>
        <Modal {...this.props.modalOptions} size="lg" isOpen={this.state.modalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Mission City Swing Waiver and Release Form</ModalHeader>
          <ModalBody>
            <div>
              <ol>
                <li><strong>Voluntary participation:</strong> As a Mission City Swing (hereinafter MCS) student, I have voluntarily chosen to participate in the dance training offered by MCS and that I am under no obligation to continue such dance training.</li>
                <li><strong>Assumption of Risk:</strong> Dance training and related activities carry certain risks that can result in injury, both minor and major. I voluntarily assume and accept all risks and potential hazards involved in dance training and related activities provided by MCS. I understand that I am strongly advised to obtain comprehensive medical insurance prior to engaging in this activity.</li>
                <li><strong>Release:</strong> In consideration of the opportunity afforded me to participate in the dance training offered at MCS, I am waiving the right to file any claim or lawsuit against MCS, its employees, members, officers, directors, agents, or representatives for any injury or damage resulting from my participation in this dance training or all related activities, including but not limited to claim of injury, damage to facility, equipment, supervision, including negligence or acts of omission by MCS, its employees, members, officers, directors, agents, or representatives.</li>
                <li><strong>Knowing and Voluntary Execution:</strong> I have carefully read this agreement and fully understand its contents. I am aware that this is a release of liability and a promise not to sue MCS or its employees, members, officers, directors, agents, or representatives, and I sign this agreement of my own free will. I understand that MCS has the right to refuse services and classes to any individual at any time.</li>
                <li><strong>Sales:</strong> I understand that all sales are final and non-transferable. I understand that any exception made to this policy is subject to Managerial approval and processing fees. I understand that New Student promotions are subject to rules and limitations and that it is my responsibility to inquire about New Student promotions and to take advantage of these special promotions under the terms established by MCS.</li>
                <li><strong>Consent to Photograph and Video:</strong> I hereby irrevocably consent to, and authorize the use and reproduction by MCS of any photographs, recordings, videos, and/or other reproductions, which have been secured by or for MCS for promotional purposes.</li>
                <li><strong>Integrated Agreement:</strong> This liability agreement supersedes and replaces all previous agreements between parties concerning this event, whether written or oral.</li>
              </ol>
            </div>
          </ModalBody>
          <ModalFooter>
            <div>
              <Button color="success" onClick={this.confirm}>I agree</Button><span className="mr-1"></span><Button color="danger" onClick={this.deny}> I do not agree</Button>
            </div>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export { LiabilityWaiverModalLink };
