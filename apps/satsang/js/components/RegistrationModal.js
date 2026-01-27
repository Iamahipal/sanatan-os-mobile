/**
 * Registration Modal
 */
export function RegistrationModal(eventName, onClose) {
    const container = document.createElement('div');
    container.className = 'modal-backdrop active';

    container.innerHTML = `
        <div class="modal-content">
            <header class="app-header">
                <div class="header-title">Register</div>
                <button class="header-btn" id="closeRegBtn">
                    <i data-lucide="x"></i>
                </button>
            </header>
            
            <div style="padding: 24px;">
                <h3 style="margin-top: 0; font-size: 1.2rem;">${eventName}</h3>
                <p style="color: var(--md-sys-color-on-surface-variant); font-size: 0.9rem; margin-bottom: 24px;">
                    Reserve your spot for this divine event.
                </p>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--md-sys-color-outline); margin-bottom: 4px;">FULL NAME</label>
                    <input type="text" class="input-field" placeholder="Enter your name" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--md-sys-color-outline-variant); background: var(--md-sys-color-surface-container);">
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--md-sys-color-outline); margin-bottom: 4px;">PHONE NUMBER</label>
                    <input type="tel" class="input-field" placeholder="+91 98765 43210" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--md-sys-color-outline-variant); background: var(--md-sys-color-surface-container);">
                </div>

                <div class="row" style="display: flex; gap: 12px; margin-bottom: 24px;">
                    <div style="flex: 1; padding: 12px; background: var(--md-sys-color-surface-container); border-radius: 8px; text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--md-sys-color-outline);">ADULTS</div>
                        <div style="font-size: 1.2rem; font-weight: 600;">2</div>
                    </div>
                    <div style="flex: 1; padding: 12px; background: var(--md-sys-color-surface-container); border-radius: 8px; text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--md-sys-color-outline);">CHILDREN</div>
                        <div style="font-size: 1.2rem; font-weight: 600;">0</div>
                    </div>
                </div>

                <button class="btn-primary full" id="confirmReg">Confirm Registration</button>
            </div>
        </div>
    `;

    const handleClose = () => {
        container.remove();
        if (onClose) onClose();
    };

    container.querySelector('#closeRegBtn').addEventListener('click', handleClose);
    container.querySelector('#confirmReg').addEventListener('click', () => {
        // Mock success
        handleClose();
        alert('Registration Successful! (Mock)');
    });

    return container;
}
