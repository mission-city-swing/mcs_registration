// @flow

export type Profile = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  discoveryMethod: string,
  discoveryMethodOther: string,
  otherDances: array,
  otherDancesOther: string,
  classes: array,
  student: boolean
};

export type Dance = {
  date: string,
  info: string
};

export type Checkin = {
  date: string,
  email: string
};
