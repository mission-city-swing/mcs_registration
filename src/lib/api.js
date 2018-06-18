// @flow
import type { Profile, Dance, User } from "../types.js";
import uuidv3 from "uuid/v3";
import Cookies from 'universal-cookie';
// I don't know if I need this
import firebase from 'firebase';
// I have purposely added fire.js to the .gitignore so we don't check in our keys
import { StageDB, ProductionDB } from '../fire.js'
import { MiscException } from './utils.js'


const cookies = new Cookies();
const fireDB = StageDB;
// generated with UUID cli
const MCS_APP = "9f9e25a0-3087-11e8-9d77-e3d459600d35";

// TODO: think about how to structure the database
// Dancers have profiles
// "User" is a special word implying auth permissions


// Dancer Profile API
export const getProfileById = (prodileId) => {
  return fireDB.database().ref("profiles/" + prodileId);
};

export const getProfileByEmail = (profileEmail) => {
  const profileId = uuidv3(profileEmail, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId);
};

export const createOrUpdateProfile = (options: Profile) => {
  var currentUser = getCurrentUser();
  if (currentUser.uuid == null) {
    throw MiscException("Admin must log in to authorize this event", "AuthException")
  }
  options.author = currentUser.uuid;
  if (!options.waiverAgree) {
    throw MiscException("Must agree to liability waiver", "FormException")
  }
  if (!(options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, and email required", "FormException")
  }
  const profileId = uuidv3(options.email, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId).set(options);
};

export const getProfiles = fireDB.database().ref("profiles/").orderByChild('lastName');

// Dance API
export const getDances = fireDB.database().ref("dances/").orderByChild('date');

export const getDance = (danceId) => {
  return fireDB.database().ref("dances/" + danceId);
};

export const deleteDance = (danceId) => {
  return fireDB.database().ref("dances/" + danceId).remove();
};

export const addNewDance = (options: Dance) => {
  var currentUser = getCurrentUser();
  options.author = currentUser.uuid;

  if (options.date) {
    // we just care about the day
    options.date = options.date.toDateString();
    // can't add 2 dances to the same day
    const danceId = uuidv3(options.date, MCS_APP);
    fireDB.database().ref("dances/" + danceId).set(options);
  }
};

// Checkins
export const addNewDanceCheckin = (options: DanceCheckin) => {
  var currentUser = getCurrentUser();
  if (currentUser.uuid == null) {
    throw MiscException("Admin must log in to authorize this checkin event", "AuthException")
  }
  options.author = currentUser.uuid;
  // check for name, email, and date
  if (!(options.date && options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, email, and date required", "FormException")
  }
  if (!options.waiverAgree) {
    throw MiscException("Must agree to liability waiver", "FormException")
  }
  // we just care about the day
  options.date = options.date.toDateString();
  const checkin = uuidv3(options.date + options.email, MCS_APP);
  fireDB.database().ref("dance-checkins/" + checkin).set(options);
  const profileId = uuidv3(options.email, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId).once("value").then(function(snapshot){
    if (snapshot.val() == null) {
      return fireDB.database().ref("profiles/" + profileId).set(options);
    } else {
      return fireDB.database().ref("profiles/" + profileId).once("value");
    }
  });
};

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
  var currentUser = getCurrentUser();
  if (currentUser.uuid == null) {
    throw MiscException("Admin must log in to authorize this checkin event", "AuthException")
  }
  options.author = currentUser.uuid;
  // check for name, email, and date
  if (!(options.date && options.email && options.firstName && options.lastName)) {
    throw MiscException("First name, last name, email, and date required", "FormException")
  }
  if (options.classes.length < 1) {
    throw MiscException("Must check in for at least one class", "FormException")
  }
  if (!options.waiverAgree) {
    throw MiscException("Must agree to liability waiver", "FormException")
  }
  // we just care about the day
  options.date = options.date.toDateString();
  const checkin = uuidv3(options.date + options.email, MCS_APP);
  return fireDB.database().ref("class-checkins/" + checkin).set(options).then(function() {
    const profileId = uuidv3(options.email, MCS_APP);
    fireDB.database().ref("profiles/" + profileId).once("value").then(function(snapshot){
      if (snapshot.val() == null) {
        return fireDB.database().ref("profiles/" + profileId).set(options);
      } else {
        return fireDB.database().ref("profiles/" + profileId).once("value")
      }
    });
  });
};

export const getClassCheckinByEmail = (studentEmail) => {
  // get checkins for a student
  return fireDB.database().ref("class-checkins").orderByChild("email").equalTo(studentEmail)
};

export const getClassCheckinByDate = (classDate) => {
  // get checkins for a specific date
  return fireDB.database().ref("class-checkins").orderByChild("date").equalTo(classDate)
};

// User API for _Auth_
// Question: What is the difference between exporting function and exporting const?
function setCurrentUser(user: User) {
  var currentUser = user;
  let d = new Date();
  d.setDate(d.getDate() + 2);
  cookies.set('currentUser', currentUser, { path: '/', expires: d});
};

export function getCurrentUser() {
  var currentUser = cookies.get('currentUser');
  if (currentUser === undefined) {
    currentUser = {};
  }
  return currentUser
};

export function removeCurrentUser() {
  cookies.remove('currentUser');
};

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
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log([errorCode, errorMessage]);
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
