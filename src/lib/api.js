// @flow
import type { Profile, Dance, User, ClassCheckin, DanceCheckin, ProfileAdminInfo, MonthlyPass } from "../types.js";
import uuidv3 from "uuid/v3";
import Cookies from 'universal-cookie';
// I don't know if I need this
import firebase from 'firebase';

// I have purposely added fire.js to the .gitignore so we don't check in our keys
import { StageDB, ProductionDB } from '../fire.js'
import { MiscException, getMonthString, sortByNameAndEmail, sortByDate, getDaysBetweenDates } from './utils.js'

require("firebase/functions");

const cookies = new Cookies();
// To deploy, change this to point to ProductionDB
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
    throw MiscException("User must log in to authorize this event", "AuthException")
  }
  return currentUser.uuid;
}

function getCurrentAdminId() {
  var currentUser = getCurrentUser();
  if (!(currentUser && currentUser.isAdmin)){
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
  options.author = getCurrentAdminId();
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
  options.author = getCurrentAdminId();
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
  options.author = getCurrentAdminId();
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
  options.author = getCurrentAdminId();
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
  options.author = getCurrentAdminId();
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
  options.author = getCurrentAdminId();
  if (!options.date) {
    throw MiscException("Date required", "FormException")
  }
  options.date = options.date.toDateString();
  const eventId = uuidv3(options.date + options.title, MCS_APP);
  return fireDB.database().ref("events/" + eventId).set(options);
};

// Dance Checkins

export const addNewDanceCheckin = (options: DanceCheckin) => {
  options.author = getCurrentAdminId();
  // check for name, email, and date
  if (!(options.date && options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, email, and date required", "FormException")
  }
  if (!(options.healthAttestationAgree && options.vaccinationCheck)) {
    throw MiscException("Must agree to health attestation and pass vaccination check", "FormException")
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

// Not in use yet
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

// Class Checkins

export const addNewClassCheckin = (options: ClassCheckin) => {
  // set author
  options.author = getCurrentAdminId();
  // check for name, email, and date
  if (!(options.date && options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, email, and date required", "FormException")
  }
  if (options.classes.length < 1) {
    throw MiscException("Must check in for at least one class", "FormException")
  }
  if (!(options.healthAttestationAgree && options.vaccinationCheck)) {
    throw MiscException("Must agree to health attestation and pass vaccination check", "FormException")
  }
  if (!(options.waiverAgree && options.conductAgree)) {
    throw MiscException("Must agree to liability waiver and code of conduct", "FormException")
  }
  // we just care about the day
  options.date = options.date.toDateString();
  const checkin = uuidv3(options.date + options.email, MCS_APP);
  return fireDB.database().ref("class-checkins/" + checkin).set(options).then(function() {
    const profileId = uuidv3(options.email, MCS_APP);
    return fireDB.database().ref("profiles/" + profileId).once("value").then(function(snapshot){
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

export const getClassCheckinByDateAndLevel = (classDate, levelName) => {
  // get checkins for a specific date and level
  return new Promise(function(resolve, reject) {
    fireDB.database().ref("class-checkins").orderByChild("date").equalTo(classDate).once("value", (snapshot) => {
      var classCheckinList = [];
      const checkinListObj = snapshot.val();
      if (checkinListObj) {
        Object.keys(checkinListObj).map(function(uid) {
          const classes = checkinListObj[uid].classes.join(',')
          if (!(classes.match(levelName) === null)) {
            classCheckinList.push(Object.assign({uid: uid}, checkinListObj[uid]))
          }
        })
      }
      resolve(classCheckinList);
    });

  });
};

// Event checkins

export const addNewEventCheckin = (options: EventCheckin) => {
  options.author = getCurrentAdminId();
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

// If the dancer is a guest of the venue, add a status message to be displayed
// to the volunteer.
export const maybeAddGuestMessage = (successText, profile_snapshot) => {
  if (profile_snapshot != null) {
    var adminInfo = profile_snapshot.val().adminInfo
    if (adminInfo && adminInfo.guest) {
      successText += "  NOTE: This dancer is our guest and does not need " +
        "to pay. They're probably famous or something."
    }
  }
  return successText
};

// Class Series API

export const addNewClassSeries = (options: Event) => {
  options.author = getCurrentAdminId();
  if (!(options.startDate && options.endDate && options.level)) {
    throw MiscException("Start date, end date, and level required", "FormException")
  }
  options.startDate = options.startDate.toDateString();
  options.endDate = options.endDate.toDateString();
  const classSeriesId = uuidv3(options.startDate + options.level, MCS_APP);
  return fireDB.database().ref("class-series/" + classSeriesId).set(options);
};

export const getAllClassSeries = fireDB.database().ref("class-series/").orderByChild('startDate');

export const getOneClassSeries = (classSeriesId) => {
  return fireDB.database().ref("class-series/" + classSeriesId);
};

export const getClassSeriesByDate = (dateString) => {
  return fireDB.database().ref("class-series/").orderByChild('startDate').equalTo(dateString);
};

export const getClassSeriesCheckinsByClassSeriesId = (classSeriesId) => {
  return new Promise(function(resolve, reject) {
    getOneClassSeries(classSeriesId).on("value", (snapshot) => {
      const classSeries = snapshot.val();
      var seriesCheckinPromises = [];
      if (classSeries == null) {
        throw MiscException("Class series does not exist", "ClassSeriesException")
      } else {
        getDaysBetweenDates(new Date(classSeries.startDate), new Date(classSeries.endDate)).forEach(date => {
          seriesCheckinPromises.push(getClassCheckinByDateAndLevel(date.toDateString(), classSeries.level));
        });

        resolve(Promise.all(seriesCheckinPromises).then((checkinLists) => {
          var seriesCheckins = [];
          checkinLists.forEach(checkinList => {
            seriesCheckins = seriesCheckins.concat(checkinList);
          });
          seriesCheckins.sort(sortByNameAndEmail);
          seriesCheckins.sort(sortByDate);
          return seriesCheckins;
        }));
      }
    })
  })
};

export const getClassSeriesAttendees = (classSeriesId) => {
  return getClassSeriesCheckinsByClassSeriesId.on("value", (checkinList) => {
    var attendeesObj = {};
    var attendees = [];
    checkinList.forEach(checkin => {
      // Using destruction assignment as shorthand https://stackoverflow.com/a/39333479
      attendeesObj[checkin.email] = (({ email, firstName, lastName }) => ({ email, firstName, lastName }))(checkin);
    });
    Object.keys(attendeesObj).forEach((email) => attendees.push(attendeesObj[email]));
    attendees.sort(sortByNameAndEmail);
    return attendees;
  });
};

export const deleteClassSeries = (classSeriesId) => {
  if (classSeriesId) {
    return fireDB.database().ref("class-series/" + classSeriesId).remove();
  } else {
    throw MiscException("No class series ID given", "DataException")
  }
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
