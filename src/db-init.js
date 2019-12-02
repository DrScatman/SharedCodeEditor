import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBDWTyUdMQkSVoVfky9vNV2HgQQupMaU1s",
  authDomain: "sharedcodeeditor.firebaseapp.com",
  databaseURL: "https://sharedcodeeditor.firebaseio.com",
  projectId: "sharedcodeeditor",
  storageBucket: "sharedcodeeditor.appspot.com",
  messagingSenderId: "503572071315",
  appId: "1:503572071315:web:51cb36d293105544209e66"
};
  // Initialize Firebasew
  firebase.initializeApp(firebaseConfig);

const AppDB = firebase.database();
const AppAUTH = firebase.auth();

export { AppDB, AppAUTH }; // Make it available to other modules