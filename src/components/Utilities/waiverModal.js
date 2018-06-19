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
        <Modal {...this.props.modalOptions} isOpen={this.state.modalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Mission City Swing Liability Waiver</ModalHeader>
          <ModalBody>
            <div>
              <p><strong>TL;DR</strong></p>
              <p>I realize that partner dancing is a full-contact sport, and I promise not to sue Mission City Swing if I happen to get hurt.</p>
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
