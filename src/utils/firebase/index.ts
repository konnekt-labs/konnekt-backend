import firebase from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { FIREBASE_CONFIG } from "../consts";

console.log("Initializing Firebase...");

const app = firebase.initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
console.log("Firebase initialized");
export { app, auth };
