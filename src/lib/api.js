// @flow
import type { Profile, Dance, User, ClassCheckin, DanceCheckin, ProfileAdminInfo, MonthlyPass } from "../types.js";
import uuidv3 from "uuid/v3";
import Cookies from 'universal-cookie';
// I don't know if I need this
import firebase from 'firebase';

// I have purposely added fire.js to the .gitignore so we don't check in our keys
import { StageDB, ProductionDB } from '../fire.js'
import { MiscException, getMonthString } from './utils.js'

require("firebase/functions");

const cookies = new Cookies();
const fireDB = StageDB;
fireDB.functions()
// fireDB.functions.useFunctionsEmulator('http://localhost:5001');

const createCharge = fireDB.functions().httpsCallable('createCharge');

// generated with UUID cli
const MCS_APP = "9f9e25a0-3087-11e8-9d77-e3d459600d35";

// Current User Cookie APIs
function setCurrentUser(currentUser: User) {
  let d = new Date();
  d.setDate(d.getDate() + 2);
  cookies.set('currentUser', currentUser, { path: '/', expires: d});
};

export function getCurrentUser() {
  var currentUser = cookies.get('currentUser') || null;
  return currentUser
};

export function removeCurrentUser() {
  cookies.remove('currentUser');
};

// App Date Cookies APIs
export function setAppDate(date: dateString) {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  cookies.set('appDate', date, { path: '/', expires: d});
};

export function getAppDate() {
  var date = cookies.get('appDate');
  if (date) {
    date = new Date(date);
  } else {
    date = new Date();
  }
  return date
};

export function removeAppDate() {
  cookies.remove('appDate');
};

// Event Cookie API
export function setAppEventId(eventId) {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  cookies.set('appEventId', eventId, { path: '/', expires: d});
};

export function getAppEventId() {
  var eventId = cookies.get('appEventId');
  if (eventId) {
    return eventId;
  } else {
    return "";
  }
};

export function removeAppEventId() {
  cookies.remove('appEventId');
};

// Utility Functions
function getCurrentUserId() {
  var currentUser = getCurrentUser();
  if (currentUser == null) {
    throw MiscException("Admin must log in to authorize this event", "AuthException")
  }
  return currentUser.uuid;
}

// Real web APIs

// Dancer Profile API
export const getProfileById = (profileId) => {
  return fireDB.database().ref("profiles/" + profileId);
};

export const getProfileByEmail = (profileEmail) => {
  const profileId = uuidv3(profileEmail, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId);
};

export const getProfileByName = (firstName, lastName) => {
  return new Promise(function(resolve, reject) {
    fireDB.database().ref("profiles/").orderByChild("profile/lastName").equalTo(lastName).once("value").then(function(snapshot) {
      for (var childSnapshot in snapshot.val()) {
        if (snapshot.val()[childSnapshot].profile.firstName === firstName) {
          resolve(snapshot.val()[childSnapshot].profile);
        } else {
          resolve(null);
        }
      }
    }, function(error) {
      Error(error);
    });
  });
};

export const createOrUpdateProfile = (options: Profile) => {
  options.author = getCurrentUserId();
  if (!(options.waiverAgree && options.conductAgree)) {
    throw MiscException("Must agree to liability waiver and code of conduct", "FormException")
  }
  if (!(options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, and email required", "FormException")
  }
  if (options.birthday) {
    options.birthday = getMonthString(options.birthday.getMonth()) + " " + options.birthday.getDate();  
  }
  options.memberDate = options.memberDate.toDateString()
  const profileId = uuidv3(options.email, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId).once("value").then(function(snapshot){
    var profileToWrite = {...options};
    if (snapshot.val() && snapshot.val()["profile"]) {
      var oldProfile = snapshot.val()["profile"];
      profileToWrite = Object.assign(oldProfile, profileToWrite);
    }
    return fireDB.database().ref("profiles/" + profileId + "/profile").set(profileToWrite);
  });
};

export const getProfiles = fireDB.database().ref("profiles/");

// Admin Info API
export const createOrUpdateProfileAdminInfo = (options: ProfileAdminInfo) => {
  options.author = getCurrentUserId();
  if (!options.email) {
    throw MiscException("Must include profile email", "FormException")
  }
  const profileId = uuidv3(options.email, MCS_APP);
  // Don't want to add email to profile twice
  delete options.email;
  return fireDB.database().ref("profiles/" + profileId + "/adminInfo").set(options);
};

// Cache latest monthly pass on profile
export const setLatestMonthlyPass = (options: MonthlyPass) => {
  options.author = getCurrentUserId();
  if (!options.email) {
    throw MiscException("Must include profile email", "FormException")
  }
  const profileId = uuidv3(options.email, MCS_APP);
  // Don't want to add email to profile object twice, but we want it when
  // we save the monthly pass object
  var withoutEmail = {...options}
  delete withoutEmail.email;
  return fireDB.database().ref("profiles/" + profileId + "/latestMonthlyPass").set(withoutEmail).then((success) => {
    return addMonthlyPass(options)
  })
};

// Monthly Pass API
export const addMonthlyPass = (options: MonthlyPass) => {
  options.author = getCurrentUserId();
  if (!options.email) {
    throw MiscException("Must include profile email", "FormException")
  }
  const passId = uuidv3(options.email + options.year + options.monthName, MCS_APP);
  // Don't want to add email to profile twice
  return fireDB.database().ref("monthly-passes/" + passId).set(options);
};

export const getMonthlyPassesByEmail = (profileEmail) => {
  return fireDB.database().ref("monthly-passes/").orderByChild("email").equalTo(profileEmail)
}

// Dance API
export const getDances = fireDB.database().ref("dances/").orderByChild('date');

export const getDance = (danceId) => {
  return fireDB.database().ref("dances/" + danceId);
};

export const getDanceByDate = (dateString) => {
  return fireDB.database().ref("dances/").orderByChild('date').equalTo(dateString);
};

export const deleteDance = (danceId) => {
  if (danceId) {
    return fireDB.database().ref("dances/" + danceId).remove();
  } else {
    throw MiscException("No Dance ID given", "DataException")
  }
};

export const addNewDance = (options: Dance) => {
  options.author = getCurrentUserId();
  if (!options.date) {
    throw MiscException("Date required", "FormException")
  }
  options.date = options.date.toDateString();
  const danceId = uuidv3(options.date, MCS_APP);
  return fireDB.database().ref("dances/" + danceId).set(options);
};

// Event API
export const getEvents = fireDB.database().ref("events/").orderByChild('date');

export const getEvent = (eventId) => {
  return fireDB.database().ref("events/" + eventId);
};

export const getEventByDate = (dateString) => {
  return fireDB.database().ref("events/").orderByChild('date').equalTo(dateString);
};

export const deleteEvent = (eventId) => {
  if (eventId) {
    return fireDB.database().ref("events/" + eventId).remove();
  } else {
    throw MiscException("No Event ID given", "DataException")
  }
};

export const addNewEvent = (options: Event) => {
  options.author = getCurrentUserId();
  if (!options.date) {
    throw MiscException("Date required", "FormException")
  }
  options.date = options.date.toDateString();
  const eventId = uuidv3(options.date + options.title, MCS_APP);
  return fireDB.database().ref("events/" + eventId).set(options);
};

// Checkins
export const addNewDanceCheckin = (options: DanceCheckin) => {
  options.author = getCurrentUserId();
  // check for name, email, and date
  if (!(options.date && options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, email, and date required", "FormException")
  }
  if (!(options.waiverAgree && options.conductAgree)) {
    throw MiscException("Must agree to liability waiver and code of conduct", "FormException")
  }
  // we just care about the day
  options.date = options.date.toDateString();
  const checkin = uuidv3(options.date + options.email, MCS_APP);
  fireDB.database().ref("dance-checkins/" + checkin).set(options);
  const profileId = uuidv3(options.email, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId).once("value").then(function(snapshot){
    if (snapshot.val() == null) {
      var profile = {...options};
      profile.memberDate = (getAppDate()).toDateString();
      return fireDB.database().ref("profiles/" + profileId + "/profile").set(profile);
    } else {
      return fireDB.database().ref("profiles/" + profileId).once("value")
    }
  });
};

export function updateDanceCheckinWithPayment(checkin, nonce, amount) {
  return createCharge({
    nonce,
    amount
  }).then(data => {
    const checkinId = uuidv3(checkin.date + checkin.email, MCS_APP);
    const checkinRef = `dance-checkins/${checkinId}`;
    return fireDB.database().ref(checkinRef).once("value").then(snapshot => {
      const checkinAttrs = snapshot.val();
      const updatedCheckin = {
        ...checkinAttrs,
        didPay: true,
        didPayAmount: amount
      };
      return fireDB.database().ref(checkinRef).set(updatedCheckin);
    });
  });
}

export const getDanceCheckinByEmail = (studentEmail) => {
  // get checkins for a student
  return fireDB.database().ref("dance-checkins/").orderByChild("email").equalTo(studentEmail)
};

export const getDanceCheckinByDate = (classDate) => {
  // get checkins for a specific date
  return fireDB.database().ref("dance-checkins").orderByChild("date").equalTo(classDate)
};

export const addNewClassCheckin = (options: ClassCheckin) => {
  // set author
  options.author = getCurrentUserId();
  // check for name, email, and date
  if (!(options.date && options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, email, and date required", "FormException")
  }
  if (options.classes.length < 1) {
    throw MiscException("Must check in for at least one class", "FormException")
  }
  if (!(options.waiverAgree && options.conductAgree)) {
    throw MiscException("Must agree to liability waiver and code of conduct", "FormException")
  }
  // we just care about the day
  options.date = options.date.toDateString();
  const checkin = uuidv3(options.date + options.email, MCS_APP);
  return fireDB.database().ref("class-checkins/" + checkin).set(options).then(function() {
    const profileId = uuidv3(options.email, MCS_APP);
    fireDB.database().ref("profiles/" + profileId).once("value").then(function(snapshot){
      if (snapshot.val() == null) {
        var profile = {...options};
        profile.memberDate = (getAppDate()).toDateString();
        delete profile.classes;
        return fireDB.database().ref("profiles/" + profileId + "/profile").set(profile);
      } else {
        return fireDB.database().ref("profiles/" + profileId).once("value")
      }
    });
  });
};

export function updateClassCheckinWithPayment(checkin, nonce, amount) {
  return createCharge({
    nonce,
    amount
  }).then(data => {
    const checkinId = uuidv3(checkin.date + checkin.email, MCS_APP);
    const checkinRef = `class-checkins/${checkinId}`;
    return fireDB.database().ref(checkinRef).once("value").then(snapshot => {
      const checkinAttrs = snapshot.val();
      const updatedCheckin = {
        ...checkinAttrs,
        didPay: true,
        didPayAmount: amount
      };
      return fireDB.database().ref(checkinRef).set(updatedCheckin);
    });
  });
}

export const getClassCheckinByEmail = (studentEmail) => {
  // get checkins for a student
  return fireDB.database().ref("class-checkins").orderByChild("email").equalTo(studentEmail)
};

export const getClassCheckinByDate = (classDate) => {
  // get checkins for a specific date
  return fireDB.database().ref("class-checkins").orderByChild("date").equalTo(classDate)
};

export const addNewEventCheckin = (options: EventCheckin) => {
  options.author = getCurrentUserId();
  // check for name, email, and event ID
  if (!(options.eventId && options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, email, and event ID required", "FormException")
  }
  if (!(options.waiverAgree && options.conductAgree)) {
    throw MiscException("Must agree to liability waiver and code of conduct", "FormException")
  }
  // we just care about the day
  options.date = options.date.toDateString();
  // key event checkin on event ID
  const checkin = uuidv3(options.eventId + options.email, MCS_APP);
  fireDB.database().ref("event-checkins/" + checkin).set(options);
  const profileId = uuidv3(options.email, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId).once("value").then(function(snapshot){
    if (snapshot.val() == null) {
      var profile = {...options};
      profile.memberDate = (getAppDate()).toDateString();
      return fireDB.database().ref("profiles/" + profileId + "/profile").set(profile);
    } else {
      return fireDB.database().ref("profiles/" + profileId).once("value")
    }
  });
};

export const getEventCheckinByEmail = (studentEmail) => {
  // get checkins for a student
  return fireDB.database().ref("event-checkins/").orderByChild("email").equalTo(studentEmail)
};

export const getEventCheckinByDate = (eventDate) => {
  // get checkins for a specific date
  return fireDB.database().ref("event-checkins").orderByChild("date").equalTo(eventDate)
};

export const getEventCheckinByEventId = (eventId) => {
  // get checkins for a specific event ID
  return fireDB.database().ref("event-checkins").orderByChild("eventId").equalTo(eventId)
};


// User API for _Auth_
// Question: What is the difference between exporting function and exporting const?

export const addNewUser = (options: User) => {
  var currentUser = {};
  return fireDB.auth().createUserWithEmailAndPassword(options.email, options.password).then(function(){
    currentUser = {
      firstName: options.firstName,
      lastName: options.lastName,
      email: options.email
    };
    const userId = uuidv3(options.email, MCS_APP);
    fireDB.database().ref("users/" + userId).set(currentUser);
    currentUser.uuid = userId;
    return setCurrentUser(currentUser);
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log([errorCode, errorMessage]);
  });
};

export const signInUser = (options: User) => {
  return fireDB.auth().signInWithEmailAndPassword(options.email, options.password).then(function(){
    const userId = uuidv3(options.email, MCS_APP);
    return fireDB.database().ref("users/" + userId).once('value').then(function(snapshot){
      var currentUser = snapshot.val();
      currentUser.uuid = userId;
      setCurrentUser(currentUser);
    });
  });
};

export const logOutCurrentUser = () => {
  return firebase.auth().signOut().then(function() {
    return removeCurrentUser();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log([errorCode, errorMessage]);
  });
};

export const sendResetEmail = (options) => {
  return firebase.auth().sendPasswordResetEmail(options.email)
};
