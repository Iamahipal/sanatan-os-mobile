/**
 * Satsang App - Event Check-In Service
 * QR code generation and attendance tracking
 */

/**
 * Generate QR code data URL for an event
 * Uses a simple SVG-based QR code (no external library needed)
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID (optional)
 * @returns {string} QR code data URL or check-in URL
 */
export function generateCheckInCode(eventId, userId = null) {
    // Generate unique check-in code
    const checkInId = `${eventId}_${userId || 'guest'}_${Date.now()}`;
    const checkInUrl = `${window.location.origin}/#checkin/${checkInId}`;

    // Store for verification
    const checkIns = getStoredCheckIns();
    checkIns.push({
        id: checkInId,
        eventId,
        userId,
        generatedAt: new Date().toISOString(),
        scanned: false
    });
    saveCheckIns(checkIns);

    return checkInUrl;
}

/**
 * Generate a simple QR-like visual code (for demo purposes)
 * In production, use a proper QR library like qrcode.js
 * @param {string} data - Data to encode
 * @returns {string} SVG string
 */
export function generateQRSVG(data) {
    // Simple placeholder - in production use actual QR library
    const hash = simpleHash(data);
    const size = 200;
    const cellSize = 10;
    const cells = 20;

    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${size}" height="${size}" fill="white"/>`;

    // Generate pattern based on hash
    for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
            const idx = i * cells + j;
            if ((hash >> (idx % 32)) & 1) {
                svg += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
            }
        }
    }

    // Add finder patterns (corners)
    const corners = [[0, 0], [cells - 7, 0], [0, cells - 7]];
    corners.forEach(([x, y]) => {
        svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${7 * cellSize}" height="${7 * cellSize}" fill="black"/>`;
        svg += `<rect x="${(x + 1) * cellSize}" y="${(y + 1) * cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="white"/>`;
        svg += `<rect x="${(x + 2) * cellSize}" y="${(y + 2) * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="black"/>`;
    });

    svg += `</svg>`;
    return svg;
}

/**
 * Simple hash function for generating pattern
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Get stored check-ins
 */
export function getStoredCheckIns() {
    try {
        return JSON.parse(localStorage.getItem('satsang_checkins') || '[]');
    } catch {
        return [];
    }
}

/**
 * Save check-ins
 */
function saveCheckIns(checkIns) {
    localStorage.setItem('satsang_checkins', JSON.stringify(checkIns));
}

/**
 * Get check-ins for an event
 * @param {string} eventId 
 */
export function getEventCheckIns(eventId) {
    return getStoredCheckIns().filter(c => c.eventId === eventId);
}

/**
 * Mark a check-in as scanned (for organizers)
 * @param {string} checkInId 
 */
export function markScanned(checkInId) {
    const checkIns = getStoredCheckIns();
    const checkIn = checkIns.find(c => c.id === checkInId);
    if (checkIn) {
        checkIn.scanned = true;
        checkIn.scannedAt = new Date().toISOString();
        saveCheckIns(checkIns);
        return true;
    }
    return false;
}

/**
 * Get attendance stats for an event
 * @param {string} eventId 
 */
export function getAttendanceStats(eventId) {
    const checkIns = getEventCheckIns(eventId);
    return {
        total: checkIns.length,
        scanned: checkIns.filter(c => c.scanned).length,
        pending: checkIns.filter(c => !c.scanned).length
    };
}

/**
 * Show check-in modal with QR code
 * @param {Object} event - Event object
 * @param {string} userId - User ID (optional)
 */
export function showCheckInModal(event, userId = null) {
    const existing = document.getElementById('checkInModal');
    if (existing) existing.remove();

    const checkInUrl = generateCheckInCode(event.id, userId);
    const qrSvg = generateQRSVG(checkInUrl);

    const modal = document.createElement('div');
    modal.id = 'checkInModal';
    modal.className = 'modal modal--center active';
    modal.innerHTML = `
        <div class="modal__backdrop"></div>
        <div class="modal__content checkin-modal">
            <div class="modal__header">
                <h3 class="modal__title">Event Check-In</h3>
                <button class="modal__close" aria-label="Close">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="modal__body">
                <div class="checkin-qr">
                    ${qrSvg}
                </div>
                <h4 class="checkin-event">${event.title}</h4>
                <p class="checkin-hint">Show this code at the venue for check-in</p>
                <button class="btn btn--outline btn--full" id="shareCheckInBtn">
                    <i data-lucide="share-2"></i>
                    Share Check-In
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    // Event handlers
    modal.querySelector('.modal__backdrop').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal__close').addEventListener('click', () => modal.remove());

    modal.querySelector('#shareCheckInBtn').addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check-In: ${event.title}`,
                    text: `My check-in code for ${event.title}`,
                    url: checkInUrl
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(checkInUrl);
            alert('Check-in link copied to clipboard!');
        }
    });
}
