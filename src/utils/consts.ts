export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4500;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "asd213sea@#43dsds"
);
export const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId,
  measurementId: process.env.FIREBASE_measurementId,
};
