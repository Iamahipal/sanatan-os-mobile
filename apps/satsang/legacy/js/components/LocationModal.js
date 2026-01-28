/**
 * Location Modal Component
 */
import { store } from '../store.js';
import { cities } from '../data/mock_data.js';

export function LocationModal(onClose) {
    const container = document.createElement('div');
    container.className = 'modal-backdrop active';

    // Current selected city
    const currentCity = store.getState().filters.city || 'Mathura';

    container.innerHTML = `
        <div class="modal-content full-height">
            <header class="app-header">
                <button class="header-btn" id="closeLocBtn">
                    <i data-lucide="x"></i>
                </button>
                <div class="header-title" style="flex:1; text-align:center;">Select Location</div>
                <div style="width: 40px;"></div> <!-- Spacer -->
            </header>
            
            <div class="search-input-wrapper" style="margin: 16px;">
                <i data-lucide="search" class="search-icon-input"></i>
                <input type="text" id="citySearch" placeholder="Search city..." autocomplete="off">
            </div>

            <div class="search-body" style="padding-top: 0;">
                <div class="section-heading" style="padding: 0 16px; font-size: 0.9rem;">Popular Cities</div>
                <div class="location-list">
                    ${cities.map(city => `
                        <div class="list-item ${city.name === currentCity ? 'selected' : ''}" data-city="${city.name}">
                            <i data-lucide="map-pin"></i>
                            <div class="list-item-content">
                                <h4>${city.name}</h4>
                                <p>${city.state}</p>
                            </div>
                            ${city.name === currentCity ? '<i data-lucide="check" class="check-icon"></i>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Internal Logic
    const closeBtn = container.querySelector('#closeLocBtn');

    // Close Handler
    const handleClose = () => {
        container.classList.remove('active'); // Fade out effect if CSS supports
        setTimeout(() => container.remove(), 200);
        if (onClose) onClose();
    };
    closeBtn.addEventListener('click', handleClose);

    // City Selection
    container.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => {
            const city = item.dataset.city;
            store.setFilter('city', city);
            handleClose();
            // Optional: Reload home if needed
            window.location.hash = 'home';
        });
    });

    return container;
}
