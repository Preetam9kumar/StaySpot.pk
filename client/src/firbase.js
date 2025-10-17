// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,   //process.env.REACT_APP_FIREBASE_API_KEY 
  authDomain: "stayspot-de01c.firebaseapp.com",
  projectId: "stayspot-de01c",
  storageBucket: "stayspot-de01c.firebasestorage.app",
  messagingSenderId: "26658861901",
  appId: "1:26658861901:web:0acf566c5a57db534f3d04"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);