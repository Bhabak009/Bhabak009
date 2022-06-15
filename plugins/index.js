import Vue from 'vue'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get, onValue} from 'firebase/database'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Chartkick.use(Chart))

const firebaseConfig = {
  apiKey: "AIzaSyADCZSDj0wHLCkJU5W6HN2iyo7y978SRec",
  authDomain: "smartenergyconservation.firebaseapp.com",
  databaseURL: "https://smartenergyconservation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartenergyconservation",
  storageBucket: "smartenergyconservation.appspot.com",
  messagingSenderId: "366935591012",
  appId: "1:366935591012:web:a62fd1b589eb476111b771",
  measurementId: "G-Y7MVLQNQF7"
};
const app = initializeApp(firebaseConfig);

const fireDb = getDatabase(app);

export default async function ({ app: { store, router, req } }, inject) {
  inject('fireDb', fireDb)
  inject('fireRef', ref)
  inject('fireSet', set)
  inject('firePush', push)
  inject('fireGet', get)
  inject('fireOnValue', onValue)
}