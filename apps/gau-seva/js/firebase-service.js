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

// ===== TELEGRAM BOT INTEGRATION =====
// Gau Seva Alert Bot - Instant notifications to admin group
const TELEGRAM_CONFIG = {
    // Bot token from @BotFather
    botToken: '8324979909:AAEhGsir2FyhdbYALLvmGuyGvH5kWm2cqnE',
    // Gau Seva group chat ID
    chatId: '-5093954682',
    // ENABLED - Will send alerts for every rescue report
    enabled: true
};

/**
 * Send instant alert to Telegram admin group
 * @param {Object} report - The rescue report data
 */
async function sendTelegramAlert(report) {
    // Check if Telegram is configured
    if (!TELEGRAM_CONFIG.enabled ||
        TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE') {
        console.log('⚠️ Telegram not configured - skipping alert');
        return false;
    }

    try {
        // Build Google Maps link
        const mapLink = report.lat && report.lon
            ? `https://www.google.com/maps?q=${report.lat},${report.lon}`
            : 'Location not available';

        // Format conditions
        const conditions = Array.isArray(report.conditions)
            ? report.conditions.join(', ')
            : report.conditions || 'Unknown';

        // Build message
        const message = `
🚨 *NEW COW RESCUE ALERT* 🚨

📋 *Case ID:* ${report.caseId || 'N/A'}
🩹 *Condition:* ${conditions}
📍 *Address:* ${report.location || 'Not provided'}
🗺️ *Map:* [Open Location](${mapLink})
📞 *Reporter:* ${report.contact || 'N/A'}
🏛️ *State:* ${report.state || 'Unknown'}
📝 *Details:* ${report.description || 'None'}

⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

_Please coordinate with nearest Gaushala immediately!_
        `.trim();

        // Send to Telegram
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            })
        });

        const result = await response.json();

        if (result.ok) {
            console.log('✅ Telegram alert sent successfully!');
            return true;
        } else {
            console.error('❌ Telegram error:', result.description);
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

// Export functions
window.GauSevaFirebase = {
    init: initFirebase,
    saveReport: saveRescueReport,
    getReportByCaseId: getReportByCaseId,
    updateStatus: updateReportStatus,
    getPendingReports: getPendingReports,
    syncLocalReports: syncLocalReports
};
