import { store } from '../core/Store.js';

/**
 * Authentication Service
 * Handles Google Sign-In and User State via Firebase
 */
export const AuthService = {
    init() {
        if (!window.firebase) {
            console.warn('Firebase SDK not loaded');
            return;
        }

        // Initialize Firebase if config exists in window (loaded via script tag in index.html)
        // We assume firebase-config.js is loaded BEFORE main.js in the HTML
        if (window.firebaseConfig && !firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
        }

        // Auth State Listener
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                store.set('user', {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                });
                console.log('User signed in:', user.email);
            } else {
                store.set('user', null);
                console.log('User signed out');
            }
        });
    },

    signIn() {
        if (!window.firebase) return;
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).catch(error => {
            console.error('Sign In Error:', error);
            alert('Sign In Failed: ' + error.message);
        });
    },

    signOut() {
        if (!window.firebase) return;
        firebase.auth().signOut();
    }
};
