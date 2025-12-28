/**
 * Firebase Configuration for Habit Tracker
 * Using existing Sanatan OS Firebase project: sanatan-os-push
 */

const firebaseConfig = {
    apiKey: "AIzaSyCbpJn70aedORd6dycc88jxSqM178U91ig",
    authDomain: "sanatan-os-push.firebaseapp.com",
    projectId: "sanatan-os-push",
    storageBucket: "sanatan-os-push.firebasestorage.app",
    messagingSenderId: "840881978014",
    appId: "1:840881978014:web:a3d8d5d30f274ecc719ae7b",
    databaseURL: "https://sanatan-os-push-default-rtdb.firebaseio.com"
};

// Initialize Firebase (if not already done by another app)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Auth and Firestore references
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Collection reference helpers
const getHabitsRef = (userId) => db.collection('users').doc(userId).collection('habits');
const getUserRef = (userId) => db.collection('users').doc(userId);
