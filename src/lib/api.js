// @flow
import type { Profile } from "../types.js";
import uuidv1 from "uuid/v1";

let database;

// TODO: think about how to structure the database
export const getProfiles = () => {};

export const addNewProfile = (options: Profile) => {
  const profileId = uuidv1();
  database.ref("profiles/" + profileId).set(options);
};

export const injectDatabaseForApi = (firebase: any) => {
  database = firebase.database();
};
