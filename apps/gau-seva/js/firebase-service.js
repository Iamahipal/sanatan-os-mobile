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

        // Send Telegram notification to admin group
        await sendTelegramAlert(report);

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

// ===== TELEGRAM BOT INTEGRATION (SECURE) =====
// Uses Vercel serverless proxy - Token hidden in environment variables
const TELEGRAM_CONFIG = {
    // Proxy endpoint (token stored in Vercel env vars)
    proxyUrl: '/api/telegram-alert',
    // Enable/disable notifications
    enabled: true
};

/**
 * Send instant alert via secure Vercel proxy
 * @param {Object} report - The rescue report data
 */
async function sendTelegramAlert(report) {
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('⚠️ Telegram notifications disabled');
        return false;
    }

    try {
        // Send to secure proxy (no token exposed)
        const response = await fetch(TELEGRAM_CONFIG.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Telegram alert sent via secure proxy!');
            return true;
        } else {
            console.error('❌ Telegram proxy error:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Telegram send error:', error);
        return false;
    }
}

/**
 * Send photo to Telegram (for rescue photos)
 * @param {File} photoFile - The photo file
 * @param {string} caption - Photo caption
 */
async function sendTelegramPhoto(photoFile, caption) {
    if (!TELEGRAM_CONFIG.enabled) return false;

    try {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CONFIG.chatId);
        formData.append('photo', photoFile);
        formData.append('caption', caption);
        formData.append('parse_mode', 'Markdown');

        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendPhoto`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('❌ Telegram photo error:', error);
        return false;
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

/**
 * Save a crowdsourced Gaushala suggestion
 * @param {Object} suggestionData
 * @returns {Promise<boolean>}
 */
async function saveGaushalaSuggestion(suggestionData) {
    try {
        if (!db) await initFirebase();
        if (!db) return false;

        const data = {
            ...suggestionData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            source: 'crowdsource_form'
        };

        await db.collection('gaushala_suggestions').add(data);
        console.log('✅ Suggestion saved to Firestore');
        return true;
    } catch (error) {
        console.error('❌ Suggestion save error:', error);
        return false;
    }
}

// Export functions
window.GauSevaFirebase = {
    init: initFirebase,
    saveReport: saveRescueReport,
    getReportByCaseId: getReportByCaseId,
    updateStatus: updateReportStatus,
    getPendingReports: getPendingReports,
    syncLocalReports: syncLocalReports,
    saveSuggestion: saveGaushalaSuggestion
};
