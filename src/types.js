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
  student: boolean,
  emailOptIn: boolean,
  waiverAgree: boolean,
  author: string
};

export type Dance = {
  date: string,
  title: string,
  fbLink: string,
  info: string,
  author: string
};

export type DanceCheckin = {
  date: Date,
  firstName: string,
  lastName: string,
  email: string,
  student: boolean,
  info: string,
  author: string
};

export type ClassCheckin = {
  date: Date,
  firstName: string,
  lastName: string,
  email: string,
  student: boolean,
  info: string,
  author: string
};

export type User = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
};
