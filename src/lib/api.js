// @flow
import type { User } from "../types.js";
import uuidv1 from "uuid/v1";

let database;

// TODO: think about how to structure the database
export const getUsers = () => {};

export const addNewUser = (options: User) => {
  const userId = uuidv1();
  database.ref("users/" + userId).set(options);
};

export const injectDatabaseForApi = (firebase: any) => {
  database = firebase.database();
};
