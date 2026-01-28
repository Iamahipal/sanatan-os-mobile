/**
 * Donation Modal Component
 */
export function DonationModal(vachakName, onClose) {
    const container = document.createElement('div');
    container.className = 'modal-backdrop active';

    container.innerHTML = `
        <div class="modal-content">
            <div style="padding: 24px; text-align: center;">
                <div style="width: 64px; height: 64px; background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">
                    🎁
                </div>
                <h3>Support ${vachakName}</h3>
                <p style="color: var(--md-sys-color-on-surface-variant); margin-bottom: 24px;">
                    Your contribution helps organize more such divine events.
                </p>

                <div class="amount-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
                    <button class="chip">₹101</button>
                    <button class="chip active">₹501</button>
                    <button class="chip">₹1001</button>
                </div>

                <div class="action-buttons-stack" style="display: flex; flex-direction: column; gap: 12px;">
                    <button class="btn-primary full">Proceed to Pay ₹501</button>
                    <button class="btn-secondary full" id="closeDonate">Cancel</button>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#closeDonate').onclick = () => {
        container.remove();
        if (onClose) onClose();
    };

    container.querySelectorAll('.chip').forEach(btn => {
        btn.onclick = () => {
            container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const amt = btn.innerText;
            container.querySelector('.btn-primary').innerText = `Proceed to Pay ${amt}`;
        };
    });

    return container;
}
