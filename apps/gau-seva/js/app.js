/**
 * Gau Seva - Cow Protection App
 * Main Application Logic
 */

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

function initApp() {
    // Counter animation
    animateCounters();

    // Photo upload
    initPhotoUpload();

    // Location detection
    initLocationDetection();

    // Condition chips
    initConditionChips();

    // Rescue form submission
    initRescueForm();

    // Smooth scroll for nav
    initSmoothScroll();
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

                    // Try to get address from coordinates
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        locationInput.value = address;
                        locationInput.dataset.lat = latitude;
                        locationInput.dataset.lon = longitude;
                    } catch (error) {
                        locationInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
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

        // Prepare data
        const rescueData = {
            location: locationInput.value,
            lat: locationInput.dataset.lat,
            lon: locationInput.dataset.lon,
            conditions: conditions,
            description: description.value,
            contact: contactNumber.value,
            timestamp: new Date().toISOString(),
            hasPhoto: photoInput.files.length > 0
        };

        // In a real app, this would send to a backend
        console.log('Rescue Report:', rescueData);

        // Show success message
        submitBtn.innerHTML = '<i data-lucide="check"></i> Alert Sent!';
        submitBtn.style.background = '#388E3C';
        lucide.createIcons();

        showToast('🙏 Rescue alert sent! Team will contact you shortly.', 'success');

        // Generate WhatsApp message
        const whatsappText = encodeURIComponent(
            `🐄 *COW RESCUE NEEDED*\n\n` +
            `📍 Location: ${rescueData.location}\n` +
            `🩹 Condition: ${conditions.join(', ')}\n` +
            `📝 Details: ${rescueData.description || 'Not provided'}\n` +
            `📞 Contact: ${rescueData.contact}\n\n` +
            `🗺️ Map: https://maps.google.com/?q=${rescueData.lat},${rescueData.lon}`
        );

        // Update WhatsApp link
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.href = `https://wa.me/919876543210?text=${whatsappText}`;
        }

        // Reset form after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = '<i data-lucide="send"></i> Send Rescue Alert';
            submitBtn.style.background = '';
            lucide.createIcons();
        }, 3000);
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
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
`;
document.head.appendChild(style);
