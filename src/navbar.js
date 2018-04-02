import React, { Component } from 'react';

import {
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink } from 'reactstrap';

import { logOutCurrentUser } from "./lib/api.js";


export default class MyNavbar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar color="faded" light>
          <NavbarBrand href="/">Mission City Swing Registration</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Dance
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink href="/dance">New Dance Form</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink href="/dance-checkin">Dance Checkin</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Students
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink href="/new-student">New Student Form</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink href="/returning">Returning Student Checkin</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Admin
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink href="/new-user">New Admin User</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink href="/signin">Sign In Form</NavLink>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <NavLink href="#" onClick={logOutCurrentUser}>Sign Out</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
};
