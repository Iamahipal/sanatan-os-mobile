/**
 * Sant Darshan App - Header Component
 * App header with navigation and search
 */

import { $, show, hide, addClass, removeClass, delegate } from '../utils/dom.js';
import { back, openModal } from '../core/router.js';
import eventBus, { Events } from '../core/events.js';
import state from '../core/state.js';
import { MODALS, SCREENS } from '../data/constants.js';

/**
 * Header Manager
 */
class HeaderManager {
    constructor() {
        this.elements = {};
        this.searchOpen = false;
    }

    /**
     * Initialize header
     */
    init() {
        // Cache elements
        this.elements = {
            header: $('#app-header'),
            backBtn: $('#back-btn'),
            pageTitle: $('#page-title'),
            searchBtn: $('#search-btn'),
            searchOverlay: $('#search-overlay'),
            searchInput: $('#search-input'),
            searchClose: $('#search-close'),
            searchResults: $('#search-results')
        };

        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const { backBtn, searchBtn, searchClose, searchInput, searchOverlay, searchResults } = this.elements;

        // Back button
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                back();
            });
        }

        // Search button
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.openSearch();
            });
        }

        // Search close
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                this.closeSearch();
            });
        }

        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                eventBus.emit(Events.SEARCH_QUERY, { query: e.target.value });
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
        }

        // Search overlay backdrop click
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.closeSearch();
                }
            });
        }

        // Search result clicks (delegated)
        if (searchResults) {
            delegate(searchResults, 'click', '.search-result-item', (e, target) => {
                const saintId = target.dataset.saintId;
                if (saintId) {
                    this.closeSearch();
                    eventBus.emit(Events.SAINT_SELECTED, { saintId });
                }
            });
        }

        // Listen for screen changes
        eventBus.on(Events.SCREEN_CHANGED, ({ screenId, data }) => {
            this.updateForScreen(screenId, data);
        });

        // Listen for search results
        eventBus.on(Events.SEARCH_RESULTS, ({ results, query }) => {
            this.renderSearchResults(results, query);
        });
    }

    /**
     * Update header for current screen
     * @param {string} screenId
     * @param {Object} data
     */
    updateForScreen(screenId, data = {}) {
        const { backBtn, pageTitle, searchBtn } = this.elements;

        switch (screenId) {
            case SCREENS.HOME:
                if (backBtn) hide(backBtn);
                if (searchBtn) show(searchBtn, 'flex');
                if (pageTitle) pageTitle.textContent = 'Sant Darshan';
                break;

            case SCREENS.SAINTS_LIST:
                if (backBtn) show(backBtn, 'flex');
                if (searchBtn) show(searchBtn, 'flex');
                if (pageTitle) {
                    pageTitle.textContent = data.traditionName || 'Saints';
                }
                break;

            case SCREENS.SAINT_DETAIL:
                if (backBtn) show(backBtn, 'flex');
                if (searchBtn) hide(searchBtn);
                if (pageTitle) {
                    pageTitle.textContent = data.saintName || 'Saint';
                }
                break;
        }
    }

    /**
     * Open search overlay
     */
    openSearch() {
        const { searchOverlay, searchInput } = this.elements;

        if (searchOverlay) {
            show(searchOverlay);
            addClass(searchOverlay, 'active');
            document.body.classList.add('search-open');
            this.searchOpen = true;

            // Focus input
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }

            // Clear previous results
            this.renderSearchResults([], '');
        }
    }

    /**
     * Close search overlay
     */
    closeSearch() {
        const { searchOverlay, searchInput } = this.elements;

        if (searchOverlay) {
            removeClass(searchOverlay, 'active');
            document.body.classList.remove('search-open');

            setTimeout(() => {
                hide(searchOverlay);
            }, 300);

            this.searchOpen = false;

            // Clear input and results
            if (searchInput) {
                searchInput.value = '';
            }
            this.renderSearchResults([], '');
        }
    }

    /**
     * Render search results
     * @param {Array} results
     * @param {string} query
     */
    renderSearchResults(results, query) {
        const { searchResults } = this.elements;
        if (!searchResults) return;

        if (!query || query.length < 2) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    <p>Type at least 2 characters to search</p>
                </div>
            `;
            return;
        }

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    <p>No saints found for "${this.escapeHtml(query)}"</p>
                </div>
            `;
            return;
        }

        const html = results.map(saint => `
            <div class="search-result-item" data-saint-id="${saint.id}">
                <div class="search-result-avatar" style="background: var(--${saint.tradition}-gradient, var(--primary-gradient))">
                    ${this.getInitials(saint.name)}
                </div>
                <div class="search-result-info">
                    <div class="search-result-name">${this.escapeHtml(saint.name)}</div>
                    <div class="search-result-meta">
                        <span class="search-result-tradition">${this.escapeHtml(saint.sampradaya || saint.tradition)}</span>
                        ${saint.period ? `<span class="search-result-period">${this.escapeHtml(saint.period)}</span>` : ''}
                    </div>
                </div>
                <i class="fas fa-chevron-right search-result-arrow"></i>
            </div>
        `).join('');

        searchResults.innerHTML = html;
    }

    /**
     * Get initials from name
     * @param {string} name
     * @returns {string}
     */
    getInitials(name) {
        if (!name) return '?';
        return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    }

    /**
     * Escape HTML
     * @param {string} str
     * @returns {string}
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Set page title
     * @param {string} title
     */
    setTitle(title) {
        if (this.elements.pageTitle) {
            this.elements.pageTitle.textContent = title;
        }
    }

    /**
     * Show/hide back button
     * @param {boolean} visible
     */
    setBackVisible(visible) {
        if (this.elements.backBtn) {
            if (visible) {
                show(this.elements.backBtn, 'flex');
            } else {
                hide(this.elements.backBtn);
            }
        }
    }

    /**
     * Show/hide search button
     * @param {boolean} visible
     */
    setSearchVisible(visible) {
        if (this.elements.searchBtn) {
            if (visible) {
                show(this.elements.searchBtn, 'flex');
            } else {
                hide(this.elements.searchBtn);
            }
        }
    }

    /**
     * Check if search is open
     * @returns {boolean}
     */
    isSearchOpen() {
        return this.searchOpen;
    }
}

// Create and export singleton
const header = new HeaderManager();

export default header;
export { HeaderManager };
