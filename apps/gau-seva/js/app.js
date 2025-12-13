/**
 * Gau Seva - Cow Protection App
 * Main Application Logic with Emergency Routing
 */

// Global state for rescue data
let currentRescueData = {};
let userLocation = { lat: null, lon: null, address: null, state: null };

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

function initApp() {
    // Counter animation
    animateCounters();

    // Photo upload
    initPhotoUpload();

    // Location detection (auto-detect on load)
    initLocationDetection();

    // Condition chips
    initConditionChips();

    // Rescue form submission
    initRescueForm();

    // Smooth scroll for nav
    initSmoothScroll();

    // NEW: Emergency triage system
    initEmergencyTriage();

    // Initialize Firebase and sync any offline reports
    initFirebaseAndSync();
}

// ===== FIREBASE INITIALIZATION =====
async function initFirebaseAndSync() {
    try {
        // Initialize Firebase (from firebase-service.js)
        if (window.GauSevaFirebase) {
            await window.GauSevaFirebase.init();

            // Sync any offline reports
            const syncResult = await window.GauSevaFirebase.syncLocalReports();
            if (syncResult.synced > 0) {
                console.log(`✅ Synced ${syncResult.synced} offline reports to cloud`);
            }
        }
    } catch (error) {
        console.warn('Firebase init warning:', error);
    }
}

// ===== EMERGENCY TRIAGE SYSTEM =====
function initEmergencyTriage() {
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyModal = document.getElementById('emergencyModal');
    const criticalModal = document.getElementById('criticalModal');
    const successModal = document.getElementById('successModal');

    // Close buttons
    const closeEmergency = document.getElementById('closeEmergencyModal');
    const closeCritical = document.getElementById('closeCriticalModal');
    const closeSuccess = document.getElementById('closeSuccessModal');

    // Triage options
    const triageCritical = document.getElementById('triageCritical');
    const triageReport = document.getElementById('triageReport');
    const backToTriage = document.getElementById('backToTriage');

    if (!emergencyBtn) return;

    // Open triage modal
    emergencyBtn.addEventListener('click', () => {
        openModal(emergencyModal);
        // Refresh icons in modal
        setTimeout(() => lucide.createIcons(), 100);
    });

    // Close modals
    closeEmergency?.addEventListener('click', () => closeModal(emergencyModal));
    closeCritical?.addEventListener('click', () => closeModal(criticalModal));
    closeSuccess?.addEventListener('click', () => closeModal(successModal));

    // Triage: Critical path
    triageCritical?.addEventListener('click', () => {
        closeModal(emergencyModal);
        openModal(criticalModal);
        // Update state-specific service name
        updateStateServiceName();
        // Find nearest Gaushala for WhatsApp
        updateNearestGaushala();
        setTimeout(() => lucide.createIcons(), 100);
    });

    // Triage: Report path (scroll to form)
    triageReport?.addEventListener('click', () => {
        closeModal(emergencyModal);
        const rescueSection = document.getElementById('rescue');
        if (rescueSection) {
            rescueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Back button in critical modal
    backToTriage?.addEventListener('click', () => {
        closeModal(criticalModal);
        openModal(emergencyModal);
    });

    // Close on overlay click
    [emergencyModal, criticalModal, successModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });
}

function openModal(modal) {
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
}

// Update state-specific 1962 service name
function updateStateServiceName() {
    const serviceNameEl = document.getElementById('stateServiceName');
    if (!serviceNameEl) return;

    if (userLocation.state && typeof getStateServiceName === 'function') {
        const service = getStateServiceName(userLocation.state);
        serviceNameEl.textContent = service.name;
    } else {
        serviceNameEl.textContent = 'Pashu Dhan Sanjeevani';
    }
}

// Find and display nearest Gaushala
function updateNearestGaushala() {
    const gaushalaBtnName = document.getElementById('nearestGaushalaName');
    const gaushalaBtn = document.getElementById('nearestGaushalaBtn');

    if (!gaushalaBtnName || !gaushalaBtn) return;

    // Try to find nearest based on location
    if (typeof findNearestGaushala === 'function') {
        const gaushala = findNearestGaushala(null, userLocation.state);

        if (gaushala) {
            gaushalaBtnName.textContent = gaushala.name;

            // Construct WhatsApp link with emergency message
            const message = encodeURIComponent(
                `🚨 *COW EMERGENCY* 🚨\n\n` +
                `📍 Location: ${userLocation.address || 'Unknown'}\n` +
                `🗺️ GPS: ${userLocation.lat ? `https://maps.google.com/?q=${userLocation.lat},${userLocation.lon}` : 'Not available'}\n\n` +
                `⚠️ This is a critical emergency. Please send help immediately!`
            );

            gaushalaBtn.href = `https://wa.me/${gaushala.whatsapp}?text=${message}`;
        }
    }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.impact-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateNumber(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeOut);

        element.textContent = current.toLocaleString('en-IN');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== PHOTO UPLOAD =====
function initPhotoUpload() {
    const uploadArea = document.getElementById('photoUpload');
    const photoInput = document.getElementById('cowPhoto');
    const preview = document.getElementById('photoPreview');

    if (!uploadArea || !photoInput) return;

    uploadArea.addEventListener('click', () => photoInput.click());

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Cow photo">`;
                preview.style.display = 'block';
                uploadArea.style.display = 'none';
                currentRescueData.photoData = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// ===== LOCATION DETECTION =====
function initLocationDetection() {
    const locationInput = document.getElementById('locationInput');
    const getLocationBtn = document.getElementById('getLocationBtn');

    if (!locationInput || !getLocationBtn) return;

    // Auto-detect on load
    getLocation();

    getLocationBtn.addEventListener('click', getLocation);

    function getLocation() {
        if ('geolocation' in navigator) {
            locationInput.value = 'Detecting location...';

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    userLocation.lat = latitude;
                    userLocation.lon = longitude;

                    // Try to get address from coordinates
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        locationInput.value = address;
                        userLocation.address = address;

                        // Extract state from response
                        if (data.address && data.address.state) {
                            userLocation.state = data.address.state;
                        }

                        locationInput.dataset.lat = latitude;
                        locationInput.dataset.lon = longitude;
                    } catch (error) {
                        locationInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        userLocation.address = locationInput.value;
                    }
                },
                (error) => {
                    locationInput.value = 'Location unavailable. Enter manually.';
                    locationInput.readOnly = false;
                    locationInput.placeholder = 'Enter address or landmark';
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            locationInput.value = '';
            locationInput.readOnly = false;
            locationInput.placeholder = 'Enter address or landmark';
        }
    }
}

// ===== CONDITION CHIPS =====
function initConditionChips() {
    const chips = document.querySelectorAll('.chip');
    let selectedConditions = [];

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');

            const value = chip.dataset.value;
            if (chip.classList.contains('active')) {
                selectedConditions.push(value);
            } else {
                selectedConditions = selectedConditions.filter(c => c !== value);
            }
        });
    });

    // Store globally for form submission
    window.getSelectedConditions = () => selectedConditions;
}

// ===== GENERATE CASE ID =====
function generateCaseId() {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `#GAU-${year}-${random}`;
}

// ===== STORE REPORT LOCALLY (Offline Support) =====
function storeReportLocally(report) {
    try {
        let reports = JSON.parse(localStorage.getItem('gauSevaReports') || '[]');
        reports.push(report);
        localStorage.setItem('gauSevaReports', JSON.stringify(reports));
        return true;
    } catch (e) {
        console.error('Failed to store report locally:', e);
        return false;
    }
}

// ===== RESCUE FORM SUBMISSION =====
function initRescueForm() {
    const submitBtn = document.getElementById('submitRescue');

    if (!submitBtn) return;

    submitBtn.addEventListener('click', async () => {
        const locationInput = document.getElementById('locationInput');
        const description = document.getElementById('description');
        const contactNumber = document.getElementById('contactNumber');
        const photoInput = document.getElementById('cowPhoto');

        const conditions = window.getSelectedConditions ? window.getSelectedConditions() : [];

        // Validation
        if (conditions.length === 0) {
            showToast('Please select at least one condition', 'error');
            return;
        }

        if (!contactNumber.value.trim()) {
            showToast('Please enter your contact number', 'error');
            return;
        }

        // Generate Case ID
        const caseId = generateCaseId();

        // Prepare data
        const rescueData = {
            caseId: caseId,
            location: locationInput.value,
            lat: userLocation.lat || locationInput.dataset.lat,
            lon: userLocation.lon || locationInput.dataset.lon,
            state: userLocation.state,
            conditions: conditions,
            description: description.value,
            contact: contactNumber.value,
            timestamp: new Date().toISOString(),
            hasPhoto: photoInput.files.length > 0,
            status: 'pending'
        };

        // Store locally for offline support
        storeReportLocally(rescueData);

        // Show loading state
        submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Sending...';
        submitBtn.disabled = true;
        lucide.createIcons();

        // Save to Firebase Firestore
        let firebaseSaved = false;
        try {
            if (window.GauSevaFirebase) {
                const result = await window.GauSevaFirebase.saveReport(rescueData);
                firebaseSaved = result.success;
                if (result.success) {
                    console.log('✅ Report saved to Firebase:', result.docId);
                }
            }
        } catch (error) {
            console.warn('Firebase save failed, using localStorage:', error);
        }

        // Show success modal
        const successModal = document.getElementById('successModal');
        const caseIdDisplay = document.getElementById('caseIdDisplay');
        const whatsappFollowupBtn = document.getElementById('whatsappFollowupBtn');

        if (caseIdDisplay) caseIdDisplay.textContent = caseId;

        // Generate WhatsApp message for followup
        const message = encodeURIComponent(
            `🐄 *COW RESCUE REPORT* 🐄\n\n` +
            `📋 Case ID: ${caseId}\n` +
            `📍 Location: ${rescueData.location}\n` +
            `🩹 Condition: ${conditions.join(', ')}\n` +
            `📝 Details: ${rescueData.description || 'Not provided'}\n` +
            `📞 Contact: ${rescueData.contact}\n\n` +
            `🗺️ Map: https://maps.google.com/?q=${rescueData.lat},${rescueData.lon}`
        );

        // Find nearest Gaushala for WhatsApp
        let rescueNumber = '919876543210'; // Default
        if (typeof findNearestGaushala === 'function') {
            const gaushala = findNearestGaushala(null, rescueData.state);
            if (gaushala && gaushala.whatsapp) rescueNumber = gaushala.whatsapp;
        }

        if (whatsappFollowupBtn) {
            whatsappFollowupBtn.href = `https://wa.me/${rescueNumber}?text=${message}`;
        }

        openModal(successModal);
        lucide.createIcons();

        // Reset button
        submitBtn.innerHTML = '<i data-lucide="send"></i> Send Rescue Alert';
        submitBtn.disabled = false;
        lucide.createIcons();

        // Show appropriate toast
        if (firebaseSaved) {
            showToast('🙏 Report sent to rescue network! Case ID: ' + caseId, 'success');
        } else {
            showToast('📱 Report saved locally. Tap WhatsApp to send directly.', 'success');
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Update active nav
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: ${type === 'success' ? '#388E3C' : type === 'error' ? '#D32F2F' : '#333'};
        color: white;
        border-radius: 12px;
        font-size: 0.9rem;
        z-index: 9999;
        max-width: 90%;
        text-align: center;
        animation: slideUp 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animation for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
`;
document.head.appendChild(style);
