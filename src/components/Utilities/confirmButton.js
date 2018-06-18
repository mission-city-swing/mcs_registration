// @flow
// src/components/Utilities/confirmButton.js
import React from 'react';
import { Button, ButtonGroup, Popover, PopoverHeader, PopoverBody, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

class ConfirmButtonPopover extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.yes = this.yes.bind(this);
    this.no = this.no.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  yes() {
    this.props.afterConfirm();
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  no() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    return (
      <span>
        <Button {...this.props.buttonOptions} id={'Popover-' + this.props.id} onClick={this.toggle}>
          {this.props.children}
        </Button>
        <Popover {...this.props.popoverOptions} isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle}>
          <PopoverHeader>{this.props.popoverHeader}</PopoverHeader>
          <PopoverBody>
            <p>{this.props.popoverBody}</p>
            <div>
              <ButtonGroup>
                <Button color="success" onClick={this.yes}>Yes</Button>
                <Button color="danger" onClick={this.no}>No</Button>
              </ButtonGroup>
            </div>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

class AdminConfirmButtonModal extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.confirm = this.confirm.bind(this);
    this.onInfoChange = this.onInfoChange.bind(this);
    this.state = {
      modalOpen: false,
      modalData: this.props.modalData
    };
  }

  toggle() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  confirm() {
    this.props.afterConfirm({info: this.state.modalData.info});
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  onInfoChange(event: any) {
    const { target: { name, value } } = event;
    var newData = {...this.state.modalData}
    newData.info = value;
    this.setState({modalData: newData})
  }

  render() {
    return (
      <span>
        <Button {...this.props.buttonOptions} onClick={this.toggle}>
          {this.props.children}
        </Button>
        <Modal {...this.props.modalOptions} isOpen={this.state.modalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{this.props.modalHeader}</ModalHeader>
          <ModalBody>
            <div>{this.props.modalBody}</div>
            <br></br>
            <div>
              <pre>{JSON.stringify(this.props.modalData, null, '\t')}</pre>
            </div>
            <div>
              <FormGroup>
                <Label for="info">Additional Info</Label><Input type="textarea" placeholder="New dancer? Guest?" onChange={this.onInfoChange} value={this.state.modalData.info} name="info" />
              </FormGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            <span>Admin Only</span>
            <Button color="danger" outline onClick={this.confirm}>Confirm?</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export { ConfirmButtonPopover, AdminConfirmButtonModal };
