// @flow
import type { Profile, Dance, User } from "../types.js";
import uuidv3 from "uuid/v3";
import Cookies from 'universal-cookie';
// I don't know if I need this
import firebase from 'firebase';
// I have purposely added fire.js to the .gitignore so we don't check in our keys
import stage from '../fire.js';


const cookies = new Cookies();
const fireDB = stage;
// generated with UUID cli
const MCS_APP = "9f9e25a0-3087-11e8-9d77-e3d459600d35";

// TODO: think about how to structure the database
// Dancers have profiles
// "User" is a special word implying auth permissions

export const getProfile = (options: Profile) => {
  // Not quite implemented yet-- should  be able to update profile
  const profileId = uuidv3(options.email, MCS_APP);
  return fireDB.database().ref("profiles/" + profileId).once('value').then(function(snapshot){
    return snapshot.val();
  });
};

export const createOrUpdateProfile = (options: Profile) => {
  const profileId = uuidv3(options.email, MCS_APP);
  fireDB.database().ref("profiles/" + profileId).set(options);
};

export const getProfiles = fireDB.database().ref("profiles/").orderByChild('lastName');

export const addNewProfile = (options: Profile) => {
  console.log(options);
  console.log(options.email);
  const profileId = uuidv3(options.email, MCS_APP);
  fireDB.database().ref("profiles/" + profileId).set(options);
};

export const addNewDance = (options: Dance) => {
  console.log(options);
  // we just care about the day
  options.date = options.date.toDateString();
  console.log(options.date);
  // can't add 2 dances to the same day
  const danceId = uuidv3(options.date, MCS_APP);
  fireDB.database().ref("dances/" + danceId).set(options);
};

export const addNewDanceCheckin = (options: DanceCheckin) => {
  console.log(options);
  // we just care about the day
  options.date = options.date.toDateString();
  const checkin = uuidv3(options.date + options.email, MCS_APP);
  fireDB.database().ref("dance-checkins/" + checkin).set(options);
  const profileId = uuidv3(options.email, MCS_APP);
  fireDB.database().ref("profiles/" + profileId).once('value').then(function(snapshot){
    if (snapshot.val() == null) {
      fireDB.database().ref("profiles/" + profileId).set(options);
    }
  });
  console.log(options);
};

export const addNewClassCheckin = (options: DanceCheckin) => {
  console.log(options);
  // we just care about the day
  options.date = options.date.toDateString();
  const checkin = uuidv3(options.date + options.email, MCS_APP);
  fireDB.database().ref("class-checkins/" + checkin).set(options);
  const profileId = uuidv3(options.email, MCS_APP);
  fireDB.database().ref("profiles/" + profileId).once('value').then(function(snapshot){
    if (snapshot.val() == null) {
      fireDB.database().ref("profiles/" + profileId).set(options);
    }
  });
  console.log(options);
};

// User functions for _Auth_
// Question: What is the difference between exporting function and exporting const?
function setCurrentUser(user: User) {
  var currentUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };
  cookies.set('currentUser', currentUser, { path: '/' });
  console.log('set current user');
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
  console.log(options);
  console.log(options.email);
  var currentUser = {};
  fireDB.auth().createUserWithEmailAndPassword(options.email, options.password).then(function(){
    currentUser = {
      firstName: options.firstName,
      lastName: options.lastName,
      email: options.email
    };
    const userId = uuidv3(options.email, MCS_APP);
    fireDB.database().ref("users/" + userId).set(currentUser);
    setCurrentUser(currentUser);
    console.log(getCurrentUser());
    return currentUser;
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log([errorCode, errorMessage]);
  });
};

export const signInUser = (options: User) => {
  console.log(options);
  console.log(options.email);
  fireDB.auth().signInWithEmailAndPassword(options.email, options.password).then(function(){
    const userId = uuidv3(options.email, MCS_APP);
    fireDB.database().ref("users/" + userId).once('value').then(function(snapshot){
      var currentUser = {
        firstName: snapshot.val().firstName,
        lastName: snapshot.val().lastName,
        email: snapshot.val().email
      };
      setCurrentUser(currentUser);
      console.log(getCurrentUser());
      return currentUser;
    });
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log([errorCode, errorMessage]);
  });
};

export const logOutCurrentUser = () => {
  console.log(getCurrentUser());
  firebase.auth().signOut().then(function() {
    removeCurrentUser();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log([errorCode, errorMessage]);
    console.log(getCurrentUser());
  });
};
