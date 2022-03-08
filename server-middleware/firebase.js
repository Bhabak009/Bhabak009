import { initializeApp } from 'firebase/app';
import { getDatabase,ref, set } from "firebase/database";
var fireDb=require("firebase/database");
const firebaseConfig ={

  apiKey: "AIzaSyADCZSDj0wHLCkJU5W6HN2iyo7y978SRec",
  authDomain: "smartenergyconservation.firebaseapp.com",
  databaseURL: "https://smartenergyconservation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartenergyconservation",
  storageBucket: "smartenergyconservation.appspot.com",
  messagingSenderId: "366935591012",
  appId: "1:366935591012:web:a62fd1b589eb476111b771",
  measurementId: "G-Y7MVLQNQF7"
};  
const fireApp = initializeApp(firebaseConfig);
var db = getDatabase(fireApp);
module.exports=db;