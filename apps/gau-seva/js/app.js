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

    // Update Gaushala count from database
    updateGaushalaCount();

    // Nearby Help - GPS based Gaushala finder
    initNearbyHelp();
}

// Initialize Nearby Help section
function initNearbyHelp() {
    const loadingEl = document.getElementById('nearbyLoading');
    const listEl = document.getElementById('nearbyList');

    if (!loadingEl || !listEl) return;

    // Wait for location to be detected
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                showNearbyGaushalas(latitude, longitude);
            },
            (error) => {
                // Location denied - show all Gaushalas
                console.log('Location access denied:', error);
                showNearbyGaushalas(null, null);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        showNearbyGaushalas(null, null);
    }
}

// Show nearby Gaushalas with distance
function showNearbyGaushalas(userLat, userLng) {
    const loadingEl = document.getElementById('nearbyLoading');
    const listEl = document.getElementById('nearbyList');

    if (!listEl) return;

    // Get all Gaushalas with WhatsApp or phone
    const allGaushalas = EMERGENCY_CONTACTS.gaushalas.filter(g => g.whatsapp || g.phone);

    // Calculate distance and sort
    const withDistance = allGaushalas.map(g => {
        let distance = null;
        if (userLat && userLng && g.geo && g.geo.lat) {
            distance = haversineDistance(userLat, userLng, g.geo.lat, g.geo.lng);
        }
        return { ...g, distance };
    });

    // Sort by distance (nearest first), null distances at end
    withDistance.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
    });

    // Take top 5
    const nearest = withDistance.slice(0, 5);

    // Hide loading
    if (loadingEl) loadingEl.style.display = 'none';
    listEl.style.display = 'flex';

    if (nearest.length === 0) {
        listEl.innerHTML = '<div class="no-nearby">No Gaushalas found. Call 1962 for help.</div>';
        lucide.createIcons();
        return;
    }

    // Render cards
    listEl.innerHTML = nearest.map(g => {
        const distanceText = g.distance !== null
            ? `${Math.round(g.distance)} km`
            : g.city || 'Unknown';

        const whatsappBtn = g.whatsapp
            ? `<a href="https://wa.me/${g.whatsapp}?text=🐄 Cow rescue help needed!" class="nearby-btn whatsapp" target="_blank">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
               </a>`
            : '';

        const callBtn = g.phone
            ? `<a href="tel:${g.phone}" class="nearby-btn call">
                <i data-lucide="phone"></i> Call
               </a>`
            : '';

        return `
            <div class="nearby-card">
                <div class="nearby-header">
                    <span class="nearby-name">${g.name}</span>
                    <span class="nearby-distance">${distanceText}</span>
                </div>
                <div class="nearby-location">
                    <i data-lucide="map-pin"></i>
                    ${g.city || g.district || ''}, ${g.state}
                </div>
                <div class="nearby-actions">
                    ${whatsappBtn}
                    ${callBtn}
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// Update Gaushala count in UI
function updateGaushalaCount() {
    const countEl = document.getElementById('gaushalaCount');
    if (countEl && typeof getVerifiedGaushalaCount === 'function') {
        countEl.textContent = getVerifiedGaushalaCount();
    }
}

// Helper: Read file as Base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
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

// Update the direct WhatsApp link in the rescue form
function updateDirectWhatsappLink() {
    const directWhatsappBtn = document.getElementById('directWhatsappBtn');
    if (!directWhatsappBtn) return;

    // Find nearest Gaushala
    if (typeof findNearestGaushala === 'function') {
        const gaushala = findNearestGaushala(userLocation.lat, userLocation.lon, userLocation.state);

        // Build message
        const message = encodeURIComponent(
            `🐄 *COW RESCUE NEEDED* 🐄\n\n` +
            `📍 Location: ${userLocation.address || 'Unknown'}\n` +
            `🗺️ GPS: ${userLocation.lat ? `https://maps.google.com/?q=${userLocation.lat},${userLocation.lon}` : 'Not available'}\n\n` +
            `Please send help!`
        );

        // Use Gaushala WhatsApp if available, otherwise show alert
        if (gaushala && gaushala.whatsapp) {
            directWhatsappBtn.href = `https://wa.me/${gaushala.whatsapp}?text=${message}`;
            directWhatsappBtn.onclick = null;
        } else {
            // No WhatsApp available - show 1962 prompt instead
            directWhatsappBtn.href = '#';
            directWhatsappBtn.onclick = (e) => {
                e.preventDefault();
                showToast('📞 No local WhatsApp available. Please call 1962 for fastest help.', 'info');
            };
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

                        // Extract city from response
                        if (data.address && data.address.city) {
                            userLocation.city = data.address.city;
                        } else if (data.address && data.address.town) {
                            userLocation.city = data.address.town;
                        } else if (data.address && data.address.village) {
                            userLocation.city = data.address.village;
                        }

                        locationInput.dataset.lat = latitude;
                        locationInput.dataset.lon = longitude;

                        // Update WhatsApp link with nearest Gaushala
                        updateDirectWhatsappLink();
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

    // Function to clear all selected conditions
    window.clearSelectedConditions = () => {
        selectedConditions = [];
        chips.forEach(chip => chip.classList.remove('active'));
    };
}

// ===== GENERATE CASE ID =====
// Format: #MH-PUN-131224-001 (State-City-Date-Seq)
function generateCaseId() {
    const date = new Date();

    // Date part: DDMMYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const dateStr = `${day}${month}${year}`;

    // State code (2 letters)
    const stateCode = getStateCode(userLocation.state);

    // City code (first 3 letters)
    const cityCode = getCityCode(userLocation.address);

    // Sequential number for today (stored in localStorage)
    const seqKey = `gauSevaSeq_${dateStr}`;
    let seq = parseInt(localStorage.getItem(seqKey) || '0') + 1;
    localStorage.setItem(seqKey, seq.toString());
    const seqStr = String(seq).padStart(3, '0');

    return `#${stateCode}-${cityCode}-${dateStr}-${seqStr}`;
}

// State code mapping (ISO 3166-2:IN)
function getStateCode(state) {
    const codes = {
        'andhra pradesh': 'AP', 'arunachal pradesh': 'AR', 'assam': 'AS',
        'bihar': 'BR', 'chhattisgarh': 'CG', 'goa': 'GA', 'gujarat': 'GJ',
        'haryana': 'HR', 'himachal pradesh': 'HP', 'jharkhand': 'JH',
        'karnataka': 'KA', 'kerala': 'KL', 'madhya pradesh': 'MP',
        'maharashtra': 'MH', 'manipur': 'MN', 'meghalaya': 'ML',
        'mizoram': 'MZ', 'nagaland': 'NL', 'odisha': 'OR', 'punjab': 'PB',
        'rajasthan': 'RJ', 'sikkim': 'SK', 'tamil nadu': 'TN',
        'telangana': 'TG', 'tripura': 'TR', 'uttar pradesh': 'UP',
        'uttarakhand': 'UK', 'west bengal': 'WB', 'delhi': 'DL',
        'jammu and kashmir': 'JK', 'ladakh': 'LA', 'puducherry': 'PY',
        'chandigarh': 'CH', 'dadra and nagar haveli': 'DN',
        'daman and diu': 'DD', 'lakshadweep': 'LD', 'andaman and nicobar': 'AN'
    };

    if (!state) return 'XX';
    const key = state.toLowerCase().trim();
    return codes[key] || state.substring(0, 2).toUpperCase();
}

// Extract city code from address
function getCityCode(address) {
    if (!address) return 'UNK';

    // Try to extract city name (usually after first comma or before district)
    const parts = address.split(',');
    if (parts.length > 1) {
        // Take second part (usually city/area name)
        const cityPart = parts[1].trim();
        // Remove common suffixes
        const cleanCity = cityPart.replace(/\s*(district|taluka|tehsil|block)/gi, '').trim();
        return cleanCity.substring(0, 3).toUpperCase();
    }

    // Fallback: first 3 letters of first word
    return address.split(' ')[0].substring(0, 3).toUpperCase();
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

        // Show loading state
        submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Sending...';
        submitBtn.disabled = true;
        lucide.createIcons();

        // Process photo if exists
        if (photoInput.files.length > 0) {
            try {
                const base64Photo = await readFileAsBase64(photoInput.files[0]);
                rescueData.photoBase64 = base64Photo;
            } catch (e) {
                console.error('Photo processing error:', e);
            }
        }

        // Store locally for offline support
        storeReportLocally(rescueData);

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

        // Reset entire form for next submission
        resetRescueForm();

        // Show appropriate toast
        if (firebaseSaved) {
            showToast('🙏 Report sent to rescue network! Case ID: ' + caseId, 'success');
        } else {
            showToast('📱 Report saved locally. Tap WhatsApp to send directly.', 'success');
        }
    });
}

// Reset the rescue form for new submission
function resetRescueForm() {
    // Reset description
    const description = document.getElementById('description');
    if (description) description.value = '';

    // Reset contact number
    const contactNumber = document.getElementById('contactNumber');
    if (contactNumber) contactNumber.value = '';

    // Reset photo upload
    const photoInput = document.getElementById('cowPhoto');
    if (photoInput) photoInput.value = '';

    // Hide photo preview
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
        photoPreview.innerHTML = '';
        photoPreview.style.display = 'none';
    }

    // Show upload area again
    const uploadArea = document.getElementById('photoUpload');
    if (uploadArea) uploadArea.style.display = 'flex';

    // Clear selected conditions using the proper function
    if (window.clearSelectedConditions) {
        window.clearSelectedConditions();
    }

    console.log('✅ Form reset for new submission');
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
