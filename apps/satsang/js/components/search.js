/**
 * Satsang App - Smart Search Component
 * Search across vachaks, events, and cities with fuzzy matching
 */

import { store } from '../store.js';

/**
 * Simple fuzzy search score
 * @param {string} query - Search query
 * @param {string} text - Text to search in
 * @returns {number} Score (0-1, higher is better match)
 */
function fuzzyScore(query, text) {
    if (!query || !text) return 0;

    query = query.toLowerCase().trim();
    text = text.toLowerCase();

    // Exact match
    if (text.includes(query)) return 1;

    // Start match
    if (text.startsWith(query)) return 0.9;

    // Word boundary match
    const words = text.split(/\s+/);
    for (const word of words) {
        if (word.startsWith(query)) return 0.8;
    }

    // Character sequence match
    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
        if (text[i] === query[queryIndex]) {
            queryIndex++;
        }
    }
    if (queryIndex === query.length) {
        return 0.5 * (query.length / text.length);
    }

    return 0;
}

/**
 * Search vachaks
 * @param {string} query 
 * @returns {Array} Matching vachaks with scores
 */
export function searchVachaks(query) {
    const state = store.getState();
    return state.vachaks
        .map(vachak => ({
            ...vachak,
            score: Math.max(
                fuzzyScore(query, vachak.name),
                fuzzyScore(query, vachak.shortName),
                fuzzyScore(query, vachak.specialty)
            )
        }))
        .filter(v => v.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

/**
 * Search events
 * @param {string} query 
 * @returns {Array} Matching events with scores
 */
export function searchEvents(query) {
    const state = store.getState();
    return state.events
        .map(event => {
            const vachak = store.getVachak(event.vachakId);
            return {
                ...event,
                vachakName: vachak?.shortName || '',
                score: Math.max(
                    fuzzyScore(query, event.title),
                    fuzzyScore(query, event.location?.cityName || ''),
                    fuzzyScore(query, vachak?.shortName || '')
                )
            };
        })
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
}

/**
 * Search cities
 * @param {string} query 
 * @returns {Array} Matching cities
 */
export function searchCities(query) {
    const state = store.getState();
    const cities = new Map();

    state.events.forEach(event => {
        if (event.location?.city) {
            const key = event.location.city;
            if (!cities.has(key)) {
                cities.set(key, {
                    id: key,
                    name: event.location.cityName || key,
                    count: 0
                });
            }
            cities.get(key).count++;
        }
    });

    return Array.from(cities.values())
        .map(city => ({
            ...city,
            score: fuzzyScore(query, city.name)
        }))
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

/**
 * Combined search across all types
 * @param {string} query 
 * @returns {Object} Search results grouped by type
 */
export function searchAll(query) {
    if (!query || query.length < 2) {
        return { vachaks: [], events: [], cities: [] };
    }

    return {
        vachaks: searchVachaks(query),
        events: searchEvents(query),
        cities: searchCities(query)
    };
}

/**
 * Show search modal
 */
export function showSearchModal() {
    const existingModal = document.getElementById('searchModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'modal modal--fullscreen active';
    modal.innerHTML = `
        <div class="search-modal">
            <div class="search-modal__header">
                <div class="search-modal__input-wrap">
                    <i data-lucide="search"></i>
                    <input type="text" 
                           id="searchInput" 
                           class="search-modal__input" 
                           placeholder="Search vachaks, events, cities..."
                           autocomplete="off"
                           autofocus>
                    <button class="search-modal__clear" id="searchClear" style="display: none;">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <button class="search-modal__close" id="searchClose">Cancel</button>
            </div>
            
            <div class="search-modal__body">
                <div id="searchResults" class="search-results">
                    <!-- Initial state: Recent searches or suggestions -->
                    <div class="search-empty">
                        <p>Type to search for vachaks, events, or cities</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Initialize icons
    if (window.lucide) window.lucide.createIcons();

    const input = modal.querySelector('#searchInput');
    const clearBtn = modal.querySelector('#searchClear');
    const resultsContainer = modal.querySelector('#searchResults');

    // Focus input
    setTimeout(() => input.focus(), 100);

    // Event handlers
    modal.querySelector('#searchClose').addEventListener('click', () => closeSearchModal());

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        resultsContainer.innerHTML = '<div class="search-empty"><p>Type to search for vachaks, events, or cities</p></div>';
        input.focus();
    });

    // Debounced search
    let searchTimeout;
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearBtn.style.display = query ? 'flex' : 'none';

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderSearchResults(query, resultsContainer);
        }, 200);
    });

    // Escape to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') closeSearchModal();
    };
    document.addEventListener('keydown', handleEscape);
    modal._handleEscape = handleEscape;
}

/**
 * Close search modal
 */
export function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        if (modal._handleEscape) {
            document.removeEventListener('keydown', modal._handleEscape);
        }
        modal.remove();
        document.body.style.overflow = '';
    }
}

/**
 * Render search results
 */
function renderSearchResults(query, container) {
    if (!query || query.length < 2) {
        container.innerHTML = '<div class="search-empty"><p>Type at least 2 characters to search</p></div>';
        return;
    }

    const results = searchAll(query);
    const hasResults = results.vachaks.length || results.events.length || results.cities.length;

    if (!hasResults) {
        container.innerHTML = `
            <div class="search-empty">
                <i data-lucide="search-x"></i>
                <p>No results for "${query}"</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    let html = '';

    // Vachaks
    if (results.vachaks.length) {
        html += `
            <div class="search-section">
                <h4 class="search-section__title">Vachaks</h4>
                ${results.vachaks.map(v => `
                    <div class="search-result search-result--vachak" data-type="vachak" data-id="${v.id}">
                        <div class="search-result__avatar">
                            ${v.image
                ? `<img src="${v.image}" alt="${v.shortName}">`
                : `<span>${v.emoji || '🙏'}</span>`
            }
                        </div>
                        <div class="search-result__info">
                            <div class="search-result__name">${v.shortName}</div>
                            <div class="search-result__meta">${v.specialty}</div>
                        </div>
                        <i data-lucide="chevron-right"></i>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Events
    if (results.events.length) {
        html += `
            <div class="search-section">
                <h4 class="search-section__title">Events</h4>
                ${results.events.map(e => `
                    <div class="search-result search-result--event" data-type="event" data-id="${e.id}">
                        <div class="search-result__icon">
                            <i data-lucide="calendar"></i>
                        </div>
                        <div class="search-result__info">
                            <div class="search-result__name">${e.title}</div>
                            <div class="search-result__meta">${e.vachakName} • ${e.location?.cityName || ''}</div>
                        </div>
                        <i data-lucide="chevron-right"></i>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Cities
    if (results.cities.length) {
        html += `
            <div class="search-section">
                <h4 class="search-section__title">Cities</h4>
                ${results.cities.map(c => `
                    <div class="search-result search-result--city" data-type="city" data-id="${c.id}">
                        <div class="search-result__icon">
                            <i data-lucide="map-pin"></i>
                        </div>
                        <div class="search-result__info">
                            <div class="search-result__name">${c.name}</div>
                            <div class="search-result__meta">${c.count} events</div>
                        </div>
                        <i data-lucide="chevron-right"></i>
                    </div>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Click handlers
    container.querySelectorAll('.search-result').forEach(result => {
        result.addEventListener('click', () => {
            const type = result.dataset.type;
            const id = result.dataset.id;

            closeSearchModal();

            if (type === 'vachak') {
                window.location.hash = `#vachak/${id}`;
            } else if (type === 'event') {
                window.location.hash = `#event/${id}`;
            } else if (type === 'city') {
                store.setLocation({ city: id });
                window.location.hash = '#home';
            }
        });
    });
}
