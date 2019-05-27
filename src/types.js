// @flow

export type Profile = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  birthday: Date,
  memberDate: Date,
  discoveryMethod: string,
  discoveryMethodFriend: string,
  discoveryMethodOther: string,
  otherDances: [],
  otherDancesOther: string,
  classes: [],
  student: boolean,
  emailOptOut: boolean,
  waiverAgree: boolean,
  conductAgree: boolean,
  author: string,
  paymentType: string,
  amt: int,
  adminInitial: string
};

export type ProfileAdminInfo = {
  email: string,
  info: string,
  completedFundamentals: boolean,
  author: string
};

export type MonthlyPass = {
  email: string,
  numClasses: int,
  monthName: string,
  year: string,
  classes: [],
  author: string
};

export type Dance = {
  date: Date,
  title: string,
  fbLink: string,
  info: string,
  author: string
};

export type Event = {
  date: Date,
  title: string,
  fbLink: string,
  checkinItems: [],
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
  waiverAgree: boolean,
  conductAgree: boolean,
  author: string
};

export type ClassCheckin = {
  date: Date,
  firstName: string,
  lastName: string,
  email: string,
  student: boolean,
  info: string,
  waiverAgree: boolean,
  conductAgree: boolean,
  classes: [],
  author: string
};

export type EventCheckin = {
  date: Date,
  eventId: string,
  firstName: string,
  lastName: string,
  email: string,
  student: boolean,
  checkinItems: [],
  info: string,
  waiverAgree: boolean,
  conductAgree: boolean,
  author: string
};

export type User = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
};
