/**
 * Volunteer Modal
 */
export function VolunteerModal(onClose) {
    const container = document.createElement('div');
    container.className = 'modal-backdrop active';

    container.innerHTML = `
        <div class="modal-content">
            <div style="padding: 32px 24px; text-align: center;">
                <div style="width: 80px; height: 80px; background: #FFF3E0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #FF9800;">
                    <i data-lucide="hand-heart" style="width: 40px; height: 40px;"></i>
                </div>
                <h3 style="margin-bottom: 8px;">Join as Sevadar</h3>
                <p style="color: var(--md-sys-color-on-surface-variant); font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;">
                    "Service to humanity is service to God."<br>Join our community of volunteers and help organize divine events.
                </p>

                <div class="list-menu" style="text-align: left; margin-bottom: 24px;">
                    <div class="menu-item-row">
                        <i data-lucide="check-circle-2" style="color: var(--md-sys-color-primary);"></i>
                        <span>Event Management</span>
                    </div>
                    <div class="menu-item-row">
                        <i data-lucide="check-circle-2" style="color: var(--md-sys-color-primary);"></i>
                        <span>Prasad Distribution</span>
                    </div>
                    <div class="menu-item-row">
                        <i data-lucide="check-circle-2" style="color: var(--md-sys-color-primary);"></i>
                        <span>Crowd Control</span>
                    </div>
                </div>

                <button class="btn-primary full" id="joinBtn">Join Now</button>
                <button class="btn-text" id="cancelBtn" style="margin-top: 12px; width: 100%;">Maybe Later</button>
            </div>
        </div>
    `;

    const handleClose = () => {
        container.remove();
        if (onClose) onClose();
    };

    container.querySelector('#cancelBtn').addEventListener('click', handleClose);
    container.querySelector('#joinBtn').addEventListener('click', () => {
        handleClose();
        alert('Request Sent! We will contact you soon.');
    });

    return container;
}
