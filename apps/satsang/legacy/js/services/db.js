/**
 * Database Service
 * Abstraction layer to handle data fetching from either:
 * 1. Live Firestore (if configured)
 * 2. Mock Data (Fallback)
 */

import { events as mockEvents, vachaks as mockVachaks, cities as mockCities } from '../data/mock_data.js';

// Configuration for Firebase (Placeholder - User must populate)
const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

class DatabaseService {
    constructor() {
        this.useLive = false;
        this.db = null;
    }

    async init() {
        // Simple check: If config is default, skip Firebase
        if (FIREBASE_CONFIG.projectId === "YOUR_PROJECT_ID") {
            console.warn('[DB] Firebase Config missing. Using Mock Data.');
            return;
        }

        try {
            // Dynamic Import to avoid loading SDK if not needed
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            const app = initializeApp(FIREBASE_CONFIG);
            this.db = getFirestore(app);
            this.collection = collection;
            this.getDocs = getDocs;
            this.query = query;
            this.orderBy = orderBy;

            this.useLive = true;
            console.log('[DB] Connected to Firestore Live! 🔥');
        } catch (e) {
            console.error('[DB] Failed to load Firebase SDK:', e);
            console.log('[DB] Falling back to Mock Data.');
        }
    }

    async getVachaks() {
        if (!this.useLive) return mockVachaks;

        try {
            const snapshot = await this.getDocs(this.collection(this.db, 'vachaks'));
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return list.length > 0 ? list : mockVachaks;
        } catch (e) {
            console.error('[DB] Error fetching Vachaks:', e);
            return mockVachaks;
        }
    }

    async getEvents() {
        if (!this.useLive) return mockEvents;

        try {
            // Fetch live events, order by start date
            const q = this.query(
                this.collection(this.db, 'events'),
                this.orderBy('dates.start', 'asc') // Requires Firestore Index
            );
            const snapshot = await this.getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Enrich with Vachak info done in Store/App level, but we return raw events here
            return list.length > 0 ? list : mockEvents;
        } catch (e) {
            console.error('[DB] Error fetching Events:', e);
            // Fallback to mock if query fails (e.g. missing index)
            return mockEvents;
        }
    }

    getCities() {
        // Cities are static config mostly
        return mockCities;
    }
}

export const dbService = new DatabaseService();
