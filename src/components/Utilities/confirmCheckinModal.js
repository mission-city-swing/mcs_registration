// @flow
// src/components/Utilities/confirmCheckinModal.js
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';


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
    console.log('constructor', this.state);
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

  componentDidUpdate() {
    // fixes an issue where the modal info text box wouldn't properly update
    if (this.state.modalData.info !== this.props.modalData.info) {
      this.setState({modalData: this.props.modalData});
    }
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

export { AdminConfirmButtonModal };
