// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArQkvAPnSQ8XNNqUerh4sbkg2tNNRlY8Q",
  authDomain: "dentist-appointment-book-fbcbc.firebaseapp.com",
  projectId: "dentist-appointment-book-fbcbc",
  storageBucket: "dentist-appointment-book-fbcbc.appspot.com",
  messagingSenderId: "1017795427238",
  appId: "1:1017795427238:web:adede235a5f190a9bf6d67",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
