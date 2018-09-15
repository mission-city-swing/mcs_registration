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
  NavItem,
  NavLink } from 'reactstrap';

import {logOutCurrentUser, getCurrentUser } from "./lib/api.js";
import AppDateForm from "./components/Utilities/appDateForm.js";
import CurrentUserNavForm from "./components/Utilities/currentUserNavForm.js";


export default class MyNavbar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logOut = this.logOut.bind(this);
    this.state = {
      isOpen: false,
      currentUser: getCurrentUser()
    };
  }

  logOut() {
    this.setState({
      currentUser: null,
    });
    logOutCurrentUser();
    window.location.href = "/";
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <div>
        <Navbar color="faded" light expand="lg">
          <NavbarBrand href="/">
            <img alt="Mission City Swing" style={{ height: 30 }} src="http://mcs-static.s3-website-us-east-1.amazonaws.com/mcs-blank-cropped.png" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem><AppDateForm /></NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Dance
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink href="/dance-checkin">Dance Checkin</NavLink>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <NavLink href="/dance">Create or Update a Dance</NavLink>
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
                    <NavLink href="/class-checkin">Class Checkin</NavLink>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <NavLink href="/student">Update Student Info</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Admin
                </DropdownToggle>
                <DropdownMenu right>
                  {this.state.currentUser &&
                    <div>
                      <DropdownItem header>{this.state.currentUser.firstName} {this.state.currentUser.lastName} is signed in.</DropdownItem>
                      <DropdownItem>
                        <NavLink href="#" onClick={this.logOut}>Sign Out</NavLink>
                      </DropdownItem>
                    </div>
                  }
                  {!this.state.currentUser &&
                    <CurrentUserNavForm />
                  }
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
};
