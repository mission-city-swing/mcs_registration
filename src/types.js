// @flow

export type Profile = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  discoveryMethod: string,
  discoveryMethodFriend: string,
  discoveryMethodOther: string,
  otherDances: [],
  otherDancesOther: string,
  classes: [],
  student: boolean
};

export type Dance = {
  date: string,
  fbLink: string,
  info: string
};

export type DanceCheckin = {
  date: Date,
  firstName: string,
  lastName: string,
  email: string  
};

export type ClassCheckin = {
  date: Date,
  firstName: string,
  lastName: string,
  email: string
};

export type User = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
};
