import { initializeApp} from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage, ref} from 'firebase/storage';






const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app


// export var admin = require("firebase-admin");

// var serviceAccount = require("./loginsystem-6bf01-firebase-adminsdk-efnhn-53a6738f04.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
