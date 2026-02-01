/**
 * Satsang App - Authentication Service
 * User accounts with phone OTP sign-in
 */

// Auth state
let currentUser = null;

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
    return currentUser !== null;
}

/**
 * Get current user
 */
export function getCurrentUser() {
    return currentUser;
}

/**
 * Load user from localStorage on app start
 */
export function loadUserSession() {
    try {
        const stored = localStorage.getItem('satsang_user');
        if (stored) {
            currentUser = JSON.parse(stored);
            console.log('👤 User session restored:', currentUser.phone);
        }
    } catch (err) {
        console.log('No stored session');
    }
}

/**
 * Save user to localStorage
 */
function saveUserSession() {
    if (currentUser) {
        localStorage.setItem('satsang_user', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('satsang_user');
    }
}

/**
 * Send OTP to phone number
 * @param {string} phone - Phone number
 * @returns {Promise<boolean>} Success
 */
export async function sendOTP(phone) {
    // Validate phone
    if (!phone || phone.length < 10) {
        throw new Error('Invalid phone number');
    }

    // In production, this would call Firebase/Supabase auth API
    console.log('📱 Sending OTP to:', phone);

    // Simulate OTP send delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store pending verification
    sessionStorage.setItem('pending_phone', phone);
    sessionStorage.setItem('pending_otp', '123456'); // In production, server generates this

    return true;
}

/**
 * Verify OTP and sign in
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} User object
 */
export async function verifyOTP(otp) {
    const phone = sessionStorage.getItem('pending_phone');
    const storedOTP = sessionStorage.getItem('pending_otp');

    if (!phone || !storedOTP) {
        throw new Error('No pending verification');
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, this would verify with backend
    if (otp !== storedOTP) {
        throw new Error('Invalid OTP');
    }

    // Create/load user
    currentUser = {
        id: `user_${phone}`,
        phone,
        name: null, // User can set later
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    // Clear pending
    sessionStorage.removeItem('pending_phone');
    sessionStorage.removeItem('pending_otp');

    // Save session
    saveUserSession();

    console.log('✅ User signed in:', currentUser.phone);
    return currentUser;
}

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 */
export function updateProfile(updates) {
    if (!currentUser) {
        throw new Error('Not logged in');
    }

    currentUser = { ...currentUser, ...updates };
    saveUserSession();

    console.log('👤 Profile updated');
    return currentUser;
}

/**
 * Sign out user
 */
export function signOut() {
    currentUser = null;
    saveUserSession();
    console.log('👋 User signed out');
}

/**
 * Sync user data (saved events, reminders) with cloud
 * In production, this would sync with Firebase/Supabase
 */
export async function syncUserData() {
    if (!currentUser) return;

    // Get local data
    const savedEvents = JSON.parse(localStorage.getItem('satsang_saved_events') || '[]');
    const reminders = JSON.parse(localStorage.getItem('satsang_reminders') || '[]');

    // In production: Upload to cloud
    console.log('☁️ Syncing user data...', { savedEvents: savedEvents.length, reminders: reminders.length });

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('✅ Data synced');
}

/**
 * Show login modal
 */
export function showLoginModal() {
    const existing = document.getElementById('loginModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.className = 'modal modal--bottom active';
    modal.innerHTML = `
        <div class="modal__backdrop"></div>
        <div class="modal__content login-modal">
            <div class="modal__header">
                <h3 class="modal__title">Sign In</h3>
                <button class="modal__close" aria-label="Close">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="modal__body">
                <div class="login-step" id="phoneStep">
                    <p class="login-description">Enter your phone number to sign in or create account</p>
                    <div class="phone-input-wrap">
                        <span class="phone-prefix">+91</span>
                        <input type="tel" 
                               id="phoneInput" 
                               class="phone-input" 
                               placeholder="9876543210"
                               maxlength="10"
                               pattern="[0-9]*"
                               inputmode="numeric">
                    </div>
                    <button class="btn btn--primary btn--full" id="sendOTPBtn">
                        Send OTP
                    </button>
                </div>
                
                <div class="login-step" id="otpStep" style="display: none;">
                    <p class="login-description">Enter the 6-digit OTP sent to your phone</p>
                    <input type="text" 
                           id="otpInput" 
                           class="otp-input" 
                           placeholder="123456"
                           maxlength="6"
                           pattern="[0-9]*"
                           inputmode="numeric">
                    <button class="btn btn--primary btn--full" id="verifyOTPBtn">
                        Verify & Sign In
                    </button>
                    <button class="btn btn--ghost btn--full" id="changePhoneBtn">
                        Change phone number
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    // Event handlers
    modal.querySelector('.modal__backdrop').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal__close').addEventListener('click', () => modal.remove());

    const phoneStep = modal.querySelector('#phoneStep');
    const otpStep = modal.querySelector('#otpStep');
    const phoneInput = modal.querySelector('#phoneInput');
    const otpInput = modal.querySelector('#otpInput');

    modal.querySelector('#sendOTPBtn').addEventListener('click', async () => {
        const phone = phoneInput.value.trim();
        if (phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            await sendOTP(phone);
            phoneStep.style.display = 'none';
            otpStep.style.display = 'block';
            otpInput.focus();
        } catch (err) {
            alert(err.message);
        }
    });

    modal.querySelector('#verifyOTPBtn').addEventListener('click', async () => {
        const otp = otpInput.value.trim();
        if (otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            await verifyOTP(otp);
            modal.remove();
            // Trigger profile re-render
            window.dispatchEvent(new CustomEvent('auth-changed'));
        } catch (err) {
            alert(err.message);
        }
    });

    modal.querySelector('#changePhoneBtn').addEventListener('click', () => {
        otpStep.style.display = 'none';
        phoneStep.style.display = 'block';
        phoneInput.focus();
    });

    // Focus input
    setTimeout(() => phoneInput.focus(), 100);
}
