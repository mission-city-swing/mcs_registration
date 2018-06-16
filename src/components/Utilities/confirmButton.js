// @flow
// src/components/Utilities/confirmButton.js
import React from 'react';
import { Button, ButtonGroup, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class ConfirmButton extends React.Component {
  constructor(props) {
    super(props);

    console.log(props)
    this.toggle = this.toggle.bind(this);
    this.yes = this.yes.bind(this);
    this.no = this.no.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    console.log(this.state)
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  yes() {
    console.log('yes');
    console.log(this.props);
    this.props.afterConfirm();
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  no() {
    console.log('no');
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

export default ConfirmButton;
