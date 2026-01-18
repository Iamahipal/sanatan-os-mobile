// Firebase Cloud Messaging Service Worker
// This file must be at the root of your app's scope

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase config - same as in firebase-config.js
firebase.initializeApp({
    apiKey: "AIzaSyCbpJn70aedORd6dycc88jxSqM178U91ig",
    authDomain: "sanatan-os-push.firebaseapp.com",
    projectId: "sanatan-os-push",
    storageBucket: "sanatan-os-push.firebasestorage.app",
    messagingSenderId: "840881978014",
    appId: "1:840881978014:web:a3d8d5d30f274ecc719ae7b"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[FCM SW] Background message:', payload);

    const notificationTitle = payload.notification?.title || '🙏 Naam Jap Reminder';
    const notificationOptions = {
        body: payload.notification?.body || 'Time for your daily Naam Jap sadhana!',
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'naamjap-reminder',
        requireInteraction: true
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus existing window or open new one
            for (const client of clientList) {
                if (client.url.includes('/japa/') && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow('./');
        })
    );
});
