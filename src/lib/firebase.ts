// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg3TCsZWax_zKQ2xZx0xTfFEEPMMuxYDk",
  authDomain: "chitchat-60c02.firebaseapp.com",
  projectId: "chitchat-60c02",
  storageBucket: "chitchat-60c02.appspot.com",
  messagingSenderId: "878752001360",
  appId: "1:878752001360:web:968f2c525381f185b3b0c5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
