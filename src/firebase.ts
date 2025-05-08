import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD1QNpYrtXuHIy9ZgYAfEISg-jyszsw8QY",
    authDomain: "traffic-control-system-20573.firebaseapp.com",
    databaseURL: "https://traffic-control-system-20573-default-rtdb.firebaseio.com/",
    projectId: "traffic-control-system-20573",
    storageBucket: "traffic-control-system-20573.firebasestorage.app",
    messagingSenderId: "849780227845",
    appId: "1:849780227845:web:9e85ae5d66261b33f5416c",
    measurementId: "G-ZJD5P07FR4"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth }; 