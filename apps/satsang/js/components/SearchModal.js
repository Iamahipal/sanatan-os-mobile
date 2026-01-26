/**
 * Search Modal Component
 */
import { store } from '../store.js';
import { EventService } from '../services/events.js';
import { Utils } from '../utils.js';

export function SearchModal(onClose) {
    const container = document.createElement('div');
    container.className = 'modal-backdrop active'; // Reuse existing modal styles or new ones

    container.innerHTML = `
        <div class="modal-content search-content full-height">
            <header class="app-header">
                <button class="header-btn" id="closeSearchBtn">
                    <i data-lucide="chevron-left"></i>
                </button>
                <div class="search-input-wrapper">
                    <i data-lucide="search" class="search-icon-input"></i>
                    <input type="text" id="searchInput" placeholder="Search events, city, or vachak..." autocomplete="off">
                </div>
            </header>
            
            <div class="search-body">
                <div class="search-suggestions" id="searchSuggestions">
                    <h4>Popular Searches</h4>
                    <div class="chip-row">
                        <button class="chip" data-query="Bhagwat">Bhagwat</button>
                        <button class="chip" data-query="Vrindavan">Vrindavan</button>
                        <button class="chip" data-query="Ram Katha">Ram Katha</button>
                        <button class="chip" data-query="Live">Live Now</button>
                    </div>
                </div>
                
                <div class="search-results hidden" id="searchResults">
                    <!-- Results injected here -->
                </div>
                
                <div class="empty-state hidden" id="searchEmpty">
                    <p>No results found</p>
                </div>
            </div>
        </div>
    `;

    // Internal Logic
    const input = container.querySelector('#searchInput');
    const resultsContainer = container.querySelector('#searchResults');
    const suggestionsContainer = container.querySelector('#searchSuggestions');
    const emptyState = container.querySelector('#searchEmpty');
    const closeBtn = container.querySelector('#closeSearchBtn');

    // Styles removed - moved to style.css

    // Close Handler
    const handleClose = () => {
        container.remove();
        if (onClose) onClose();
    };
    closeBtn.addEventListener('click', handleClose);

    // Search Logic
    const performSearch = (query) => {
        if (!query.trim()) {
            suggestionsContainer.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            emptyState.classList.add('hidden');
            return;
        }

        suggestionsContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        // Update Store Filter
        store.setFilter('search', query);
        const results = EventService.getFilteredEvents();

        renderResults(results);
    };

    const renderResults = (events) => {
        resultsContainer.innerHTML = '';

        if (events.length === 0) {
            resultsContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        events.forEach(event => {
            const el = document.createElement('div');
            el.className = 'search-result-item';
            el.innerHTML = `
                <div style="font-weight: 600;">${event.title}</div>
                <div style="font-size: 12px; color: var(--md-sys-color-secondary);">${event.vachak ? event.vachak.name : ''} • ${event.location.cityName}</div>
            `;
            el.addEventListener('click', () => {
                window.location.hash = `event/${event.id}`;
                handleClose(); // Close modal on selection
            });
            resultsContainer.appendChild(el);
        });
    };

    // Event Listeners
    input.addEventListener('input', (e) => performSearch(e.target.value));

    // Suggestion Chips
    container.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const q = chip.dataset.query;
            input.value = q;
            performSearch(q);
        });
    });

    // Auto-focus logic
    setTimeout(() => input.focus(), 100);

    return container;
}
