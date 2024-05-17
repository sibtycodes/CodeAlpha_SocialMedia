// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAwzz5hIb1LOtrQHp5Lswpp5IHMv1hX2w",
  authDomain: "socialapp-5f322.firebaseapp.com",
  projectId: "socialapp-5f322",
  storageBucket: "socialapp-5f322.appspot.com",
  messagingSenderId: "617067802883",
  appId: "1:617067802883:web:ef003a955cd0569c553936",
  measurementId: "G-R7CZZFGD30"
};

const firebaseConfigForChat = {
  apiKey: "AIzaSyBsWpMfZzxlNVdE_gvUDdwFZAyHr3BltpA",
  authDomain: "sibtymedia.firebaseapp.com",
  projectId: "sibtymedia",
  storageBucket: "sibtymedia.appspot.com",
  messagingSenderId: "757701481058",
  appId: "1:757701481058:web:ba74c1069702fc0398373b"
};

// Initialize Firebase for chat app
let chatapp:any;
if (!getApps().find(app => app.name === 'chatApp')) {
  chatapp = initializeApp(firebaseConfigForChat, 'chatApp');
} else {
  chatapp = getApp('chatApp');
}

export const chatdb = getFirestore(chatapp);

// Initialize Firebase
let app;
if (!getApps().find(app => app.name === 'mainApp')) {
  app = initializeApp(firebaseConfig, 'mainApp');
} else {
  app = getApp('mainApp');
}
export const storage = getStorage(app);