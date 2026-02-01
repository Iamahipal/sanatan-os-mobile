/**
 * Satsang App - Donations Service
 * UPI integration and donation tracking
 */

/**
 * Generate UPI payment URL
 * @param {Object} options - Payment options
 * @returns {string} UPI URL
 */
export function generateUPIUrl(options = {}) {
    const {
        payee = 'satsang@upi', // UPI ID
        name = 'Satsang Sewa',
        amount = '',
        transactionId = `SAT${Date.now()}`,
        transactionNote = 'Donation for Satsang Sewa',
        currency = 'INR'
    } = options;

    // UPI URL scheme
    const params = new URLSearchParams({
        pa: payee,
        pn: name,
        tn: transactionNote,
        cu: currency,
        tr: transactionId
    });

    if (amount) {
        params.set('am', amount);
    }

    return `upi://pay?${params.toString()}`;
}

/**
 * Open UPI payment
 * @param {Object} options 
 */
export function initiateUPIPayment(options = {}) {
    const url = generateUPIUrl(options);

    // Log donation attempt
    logDonation({
        transactionId: options.transactionId || `SAT${Date.now()}`,
        amount: options.amount,
        status: 'initiated',
        timestamp: new Date().toISOString()
    });

    // Open UPI app
    window.location.href = url;
}

/**
 * Log donation to localStorage
 */
function logDonation(donation) {
    const donations = getDonations();
    donations.push(donation);
    localStorage.setItem('satsang_donations', JSON.stringify(donations));
}

/**
 * Get donation history
 */
export function getDonations() {
    try {
        return JSON.parse(localStorage.getItem('satsang_donations') || '[]');
    } catch {
        return [];
    }
}

/**
 * Get total donations
 */
export function getTotalDonations() {
    const donations = getDonations();
    return donations
        .filter(d => d.status === 'completed')
        .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
}

// Preset donation amounts
export const donationPresets = [
    { amount: 51, label: '₹51' },
    { amount: 101, label: '₹101' },
    { amount: 251, label: '₹251' },
    { amount: 501, label: '₹501' },
    { amount: 1001, label: '₹1001' },
    { amount: 0, label: 'Custom' }
];

/**
 * Show donation modal
 * @param {Object} context - Optional context (event, vachak, etc.)
 */
export function showDonationModal(context = {}) {
    const existing = document.getElementById('donationModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'donationModal';
    modal.className = 'modal modal--bottom active';
    modal.innerHTML = `
        <div class="modal__backdrop"></div>
        <div class="modal__content donation-modal">
            <div class="modal__header">
                <h3 class="modal__title">🙏 Donate for Sewa</h3>
                <button class="modal__close" aria-label="Close">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="modal__body">
                <p class="donation-description">
                    Your contributions help organize kathas, feed devotees, and spread dharma.
                </p>
                
                <!-- Preset Amounts -->
                <div class="donation-presets">
                    ${donationPresets.map(p => `
                        <button class="donation-preset" data-amount="${p.amount}">
                            ${p.label}
                        </button>
                    `).join('')}
                </div>
                
                <!-- Custom Amount -->
                <div class="donation-custom" id="customAmountWrap" style="display: none;">
                    <label for="customAmount">Enter Amount</label>
                    <div class="donation-custom-input">
                        <span class="currency">₹</span>
                        <input type="number" 
                               id="customAmount" 
                               placeholder="Enter amount"
                               min="1"
                               inputmode="numeric">
                    </div>
                </div>
                
                <!-- Payment Method -->
                <div class="donation-methods">
                    <button class="btn btn--primary btn--full" id="payUPIBtn" disabled>
                        <i data-lucide="smartphone"></i>
                        Pay with UPI
                    </button>
                </div>
                
                <p class="donation-note">
                    <i data-lucide="shield-check"></i>
                    Secure payment via UPI apps
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    let selectedAmount = null;
    const presets = modal.querySelectorAll('.donation-preset');
    const customWrap = modal.querySelector('#customAmountWrap');
    const customInput = modal.querySelector('#customAmount');
    const payBtn = modal.querySelector('#payUPIBtn');

    // Preset click handlers
    presets.forEach(btn => {
        btn.addEventListener('click', () => {
            presets.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const amount = parseInt(btn.dataset.amount);
            if (amount === 0) {
                // Custom amount
                customWrap.style.display = 'block';
                customInput.focus();
                selectedAmount = null;
                payBtn.disabled = true;
            } else {
                customWrap.style.display = 'none';
                selectedAmount = amount;
                payBtn.disabled = false;
            }
        });
    });

    // Custom amount input
    customInput.addEventListener('input', () => {
        const val = parseInt(customInput.value);
        if (val > 0) {
            selectedAmount = val;
            payBtn.disabled = false;
        } else {
            selectedAmount = null;
            payBtn.disabled = true;
        }
    });

    // Pay button
    payBtn.addEventListener('click', () => {
        if (!selectedAmount) return;

        initiateUPIPayment({
            amount: selectedAmount.toString(),
            transactionNote: context.eventTitle
                ? `Donation for ${context.eventTitle}`
                : 'Donation for Satsang Sewa'
        });

        modal.remove();
    });

    // Close handlers
    modal.querySelector('.modal__backdrop').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal__close').addEventListener('click', () => modal.remove());
}
