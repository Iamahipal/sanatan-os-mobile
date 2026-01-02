/**
 * Firebase Configuration for Habit Tracker
 * Using existing Sanatan OS Firebase project: sanatan-os-push
 */

const firebaseConfig = {
    apiKey: "AIzaSyCByJh7DedGRde6dycc88jxSqWI78U9iUg",
    authDomain: "sanatan-os-push.firebaseapp.com",
    projectId: "sanatan-os-push",
    storageBucket: "sanatan-os-push.firebasestorage.app",
    messagingSenderId: "860881978914",
    appId: "1:860881978914:web:a3d8d5d3bf274cc719ac7b",
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
