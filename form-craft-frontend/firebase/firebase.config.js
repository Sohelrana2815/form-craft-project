// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH-UGL-RdTav0WY5n1LK6IjkNTuoF09ks",
  authDomain: "form-craft-152302.firebaseapp.com",
  projectId: "form-craft-152302",
  storageBucket: "form-craft-152302.firebasestorage.app",
  messagingSenderId: "369563804503",
  appId: "1:369563804503:web:70d4898ca23bce50e0d412",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
