/**
 * Success Modal
 */
export function SuccessModal(title, message, onClose) {
    const container = document.createElement('div');
    container.className = 'modal-backdrop active';

    // Auto close after 3s
    setTimeout(() => {
        handleClose();
    }, 3000);

    container.innerHTML = `
        <div class="modal-content" style="background: transparent; box-shadow: none; display: flex; align-items: center; justify-content: center; height: 100%;">
            <div style="background: white; padding: 32px; border-radius: 24px; text-align: center; width: 80%;">
                <div style="width: 64px; height: 64px; background: #DCFCE7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #16A34A;">
                    <i data-lucide="check" style="width: 32px; height: 32px; stroke-width: 3px;"></i>
                </div>
                <h3 style="margin-bottom: 8px; color: var(--md-sys-color-on-surface);">${title}</h3>
                <p style="color: var(--md-sys-color-on-surface-variant); font-size: 0.9rem;">${message}</p>
            </div>
        </div>
    `;

    const handleClose = () => {
        container.classList.remove('active');
        setTimeout(() => container.remove(), 200);
        if (onClose) onClose();
    };

    container.addEventListener('click', handleClose);

    return container;
}
