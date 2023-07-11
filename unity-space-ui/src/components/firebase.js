import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBEeqfeEtqVSLgXu6IvGHdduhoRgKGfGCU",
    authDomain: "unityspace-52083.firebaseapp.com",
    projectId: "unityspace-52083",
    storageBucket: "unityspace-52083.appspot.com",
    messagingSenderId: "480191100100",
    appId: "1:480191100100:web:ed8b07963b2d708d3c4591",
    measurementId: "G-L0Y1L96RT1"
  };
 const app = initializeApp(firebaseConfig);
// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
export const db = getFirestore();
