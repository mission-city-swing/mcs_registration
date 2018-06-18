// @flow
// src/components/Utilities/confirmButton.js
import React from 'react';
import { Button, ButtonGroup, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

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

export { ConfirmButtonPopover };
