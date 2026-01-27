/**
 * Filter Modal Component
 */
import { store } from '../store.js';

export function FilterModal(onClose) {
    const container = document.createElement('div');
    container.className = 'modal-backdrop active';

    const currentType = store.getState().filters.type;

    container.innerHTML = `
        <div class="modal-content">
            <header class="app-header">
                <div class="header-title">Filters</div>
                <button class="header-btn" id="closeFilterBtn">
                    <i data-lucide="x"></i>
                </button>
            </header>
            
            <div style="padding: 24px 16px;">
                <div class="section-heading">Event Type</div>
                <div class="chip-row wrap">
                    <button class="chip ${currentType === 'all' ? 'active' : ''}" data-type="all">All Events</button>
                    <button class="chip ${currentType === 'katha' ? 'active' : ''}" data-type="katha">Katha</button>
                    <button class="chip ${currentType === 'kirtan' ? 'active' : ''}" data-type="kirtan">Kirtan</button>
                    <button class="chip ${currentType === 'bhajan' ? 'active' : ''}" data-type="bhajan">Bhajan</button>
                </div>

                <div class="section-heading" style="margin-top: 24px;">Preferences</div>
                <div class="list-menu" style="margin-top: 12px; border: 1px solid var(--md-sys-color-outline-variant);">
                    <div class="menu-item-row">
                        <i data-lucide="radio"></i>
                        <span>Live Only</span>
                        <div class="toggle-switch"></div>
                    </div>
                </div>

                <button class="btn-primary full" id="applyFilters" style="margin-top: 32px;">
                    Apply Filters
                </button>
            </div>
        </div>
    `;

    // Logic
    const closeBtn = container.querySelector('#closeFilterBtn');
    const applyBtn = container.querySelector('#applyFilters');
    let selectedType = currentType;

    // Handle Chips
    container.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedType = chip.dataset.type;
        });
    });

    const handleClose = () => {
        container.remove();
        if (onClose) onClose();
    };

    closeBtn.addEventListener('click', handleClose);

    applyBtn.addEventListener('click', () => {
        store.setFilter('type', selectedType);
        handleClose();
        // Refresh
        const homeList = document.getElementById('eventsList');
        if (homeList) {
            // Re-render home list would be ideal, but store subscription should handle it?
            // Current store implementation might simple, let's trigger hash change to force reload or rely on listener
            if (window.location.hash === '' || window.location.hash === '#home') {
                // Force re-render if we had a dedicated re-render function exposed
                // For now, let's just reload the route
                window.location.hash = 'temp';
                setTimeout(() => window.location.hash = 'home', 0);
            }
        }
    });

    return container;
}
