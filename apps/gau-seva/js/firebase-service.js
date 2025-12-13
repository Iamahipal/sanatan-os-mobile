/**
 * Gau Seva - Firebase Service
 * Handles Firestore database for rescue reports
 */

// Firebase config (same as main SanatanOS project)
const firebaseConfig = {
    apiKey: "AIzaSyCbpJn70aedORd6dycc88jxSqM178U91ig",
    authDomain: "sanatan-os-push.firebaseapp.com",
    projectId: "sanatan-os-push",
    storageBucket: "sanatan-os-push.firebasestorage.app",
    messagingSenderId: "840881978014",
    appId: "1:840881978014:web:a3d8d5d30f274ecc719ae7b"
};

// Initialize Firebase (check if already initialized)
let app, db;

async function initFirebase() {
    try {
        // Check if Firebase is loaded
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded');
            return false;
        }

        // Initialize app if not already done
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.apps[0];
        }

        // Initialize Firestore
        db = firebase.firestore();
        console.log('✅ Firebase Firestore initialized');
        return true;
    } catch (error) {
        console.error('❌ Firebase init error:', error);
        return false;
    }
}

/**
 * Save rescue report to Firestore
 * @param {Object} report - The rescue report data
 * @returns {Promise<Object>} - Result with docId or error
 */
async function saveRescueReport(report) {
    try {
        // Ensure Firebase is initialized
        if (!db) {
            const initialized = await initFirebase();
            if (!initialized) {
                // Fallback: save to localStorage only
                console.warn('Firebase not available, saving locally');
                return { success: false, error: 'Firebase not available', savedLocally: true };
            }
        }

        // Add timestamp and status
        const reportData = {
            ...report,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
            assignedTo: null,
            resolvedAt: null,
            notes: []
        };

        // Save to 'rescue_reports' collection
        const docRef = await db.collection('rescue_reports').add(reportData);

        console.log('✅ Report saved to Firestore:', docRef.id);

        return {
            success: true,
            docId: docRef.id,
            caseId: report.caseId
        };
    } catch (error) {
        console.error('❌ Firestore save error:', error);
        return {
            success: false,
            error: error.message,
            savedLocally: true
        };
    }
}

/**
 * Get rescue report by Case ID
 * @param {string} caseId - The case ID (e.g., #GAU-2024-1234)
 * @returns {Promise<Object|null>} - The report or null
 */
async function getReportByCaseId(caseId) {
    try {
        if (!db) await initFirebase();
        if (!db) return null;

        const snapshot = await db.collection('rescue_reports')
            .where('caseId', '==', caseId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('❌ Get report error:', error);
        return null;
    }
}

/**
 * Update report status
 * @param {string} docId - Firestore document ID
 * @param {string} status - New status (pending, assigned, resolved)
 * @param {string} notes - Optional notes
 */
async function updateReportStatus(docId, status, notes = '') {
    try {
        if (!db) await initFirebase();
        if (!db) return false;

        const updateData = {
            status: status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (status === 'resolved') {
            updateData.resolvedAt = firebase.firestore.FieldValue.serverTimestamp();
        }

        if (notes) {
            updateData.notes = firebase.firestore.FieldValue.arrayUnion({
                text: notes,
                timestamp: new Date().toISOString()
            });
        }

        await db.collection('rescue_reports').doc(docId).update(updateData);
        console.log('✅ Report status updated:', docId, status);
        return true;
    } catch (error) {
        console.error('❌ Update status error:', error);
        return false;
    }
}

/**
 * Get all pending reports (for admin dashboard)
 * @returns {Promise<Array>} - List of pending reports
 */
async function getPendingReports() {
    try {
        if (!db) await initFirebase();
        if (!db) return [];

        const snapshot = await db.collection('rescue_reports')
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('❌ Get pending reports error:', error);
        return [];
    }
}

/**
 * Sync localStorage reports to Firestore (for offline-first)
 */
async function syncLocalReports() {
    try {
        if (!db) await initFirebase();
        if (!db) return { synced: 0, failed: 0 };

        const localReports = JSON.parse(localStorage.getItem('gauSevaReports') || '[]');
        const unsyncedReports = localReports.filter(r => !r.syncedToFirebase);

        let synced = 0;
        let failed = 0;

        for (const report of unsyncedReports) {
            const result = await saveRescueReport(report);
            if (result.success) {
                report.syncedToFirebase = true;
                report.firestoreDocId = result.docId;
                synced++;
            } else {
                failed++;
            }
        }

        // Update localStorage with sync status
        localStorage.setItem('gauSevaReports', JSON.stringify(localReports));

        console.log(`✅ Synced ${synced} reports, ${failed} failed`);
        return { synced, failed };
    } catch (error) {
        console.error('❌ Sync error:', error);
        return { synced: 0, failed: 0 };
    }
}

// Export functions
window.GauSevaFirebase = {
    init: initFirebase,
    saveReport: saveRescueReport,
    getReportByCaseId: getReportByCaseId,
    updateStatus: updateReportStatus,
    getPendingReports: getPendingReports,
    syncLocalReports: syncLocalReports
};
