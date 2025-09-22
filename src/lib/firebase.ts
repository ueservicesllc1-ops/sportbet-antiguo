
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDie7Ua9OhTqWsqdR3fhnmbKSz7k5KrgtQ",
  authDomain: "studio-3302383355-1ea39.firebaseapp.com",
  projectId: "studio-3302383355-1ea39",
  storageBucket: "studio-3302383355-1ea39.appspot.com",
  messagingSenderId: "1096593910879",
  appId: "1:1096593910879:web:6b401f58aa19c8b12affea"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
