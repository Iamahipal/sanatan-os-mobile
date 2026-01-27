/**
 * Firebase Admin SDK Configuration
 * 
 * INSTRUCTIONS:
 * 1. Go to Firebase Console > Project Settings > Service Accounts
 * 2. Click "Generate new private key"
 * 3. Save the JSON file as 'service-account.json' in this directory
 * 4. OR populate the environment variables below
 */

require('dotenv').config();

const admin = require('firebase-admin');

// Check if using Service Account JSON file or Env Vars
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : {
        "type": "service_account",
        "project_id": process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : "YOUR_PRIVATE_KEY",
        "client_email": process.env.FIREBASE_CLIENT_EMAIL || "YOUR_CLIENT_EMAIL",
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
    };

const initFirebase = () => {
    try {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('🔥 Firebase Admin Initialized Successfully');
        }
        return admin.firestore();
    } catch (error) {
        console.error('❌ Firebase Init Failed:', error.message);
        console.error('   -> Please ensure service-account.json exists or ENV vars are set.');
        return null;
    }
};

module.exports = { initFirebase, admin };
