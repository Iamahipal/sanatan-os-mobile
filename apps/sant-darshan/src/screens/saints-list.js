/**
 * Sant Darshan App - Saints List Screen
 * Displays saints filtered by tradition and sampradaya
 */

import { $, clearChildren, delegate, addClass, removeClass } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';
import state from '../core/state.js';
import eventBus, { Events } from '../core/events.js';
import { navigate } from '../core/router.js';
import { SCREENS } from '../data/constants.js';
import { TRADITIONS } from '../data/traditions.js';
import { getSaintsByTradition, getSampradayasForTradition, getTradition, getSaint } from '../services/saints.js';
import storage from '../services/storage.js';
import { createSaintCard } from '../components/cards.js';

/**
 * Saints List Screen Renderer
 */
const SaintsListScreen = {
    container: null,
    cleanupFns: [],
    currentTradition: null,
    currentFilter: 'all',

    /**
     * Render the saints list screen
     * @param {HTMLElement} container
     * @param {Object} data - Screen data with tradition info
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];
        this.currentTradition = data.tradition || state.get('currentTradition');
        this.currentFilter = data.filter || state.get('currentFilter') || 'all';

        // Build the screen content
        this.buildContent();

        // Setup event handlers
        this.setupEventHandlers();

        // Return cleanup function
        return () => this.cleanup();
    },

    /**
     * Build the saints list content
     */
    buildContent() {
        const content = this.container.querySelector('.screen-content') || this.container;
        clearChildren(content);

        // Tradition header
        content.appendChild(this.createTraditionHeader());

        // Filter chips
        content.appendChild(this.createFilterChips());

        // Saints list
        content.appendChild(this.createSaintsList());
    },

    /**
     * Create tradition header section
     */
    createTraditionHeader() {
        const tradition = getTradition(this.currentTradition) || TRADITIONS[this.currentTradition];

        const section = document.createElement('section');
        section.className = 'tradition-header';

        if (!tradition) {
            section.innerHTML = `<p>Select a tradition to explore</p>`;
            return section;
        }

        section.innerHTML = `
            <div class="tradition-header-content">
                <div class="tradition-header-icon" style="background: ${tradition.gradient || tradition.color}">
                    <span>${tradition.icon}</span>
                </div>
                <div class="tradition-header-info">
                    <h2 class="tradition-header-title">${escapeHtml(tradition.name)}</h2>
                    <p class="tradition-header-title-hi" lang="hi">${escapeHtml(tradition.nameHi)}</p>
                    <p class="tradition-header-description">${escapeHtml(tradition.description)}</p>
                </div>
            </div>
        `;

        return section;
    },

    /**
     * Create filter chips for sampradayas
     */
    createFilterChips() {
        const sampradayas = getSampradayasForTradition(this.currentTradition);

        const section = document.createElement('section');
        section.className = 'filter-section';

        if (!sampradayas || sampradayas.length === 0) {
            return section;
        }

        section.innerHTML = `
            <div class="filter-chips" role="tablist">
                <button class="filter-chip ${this.currentFilter === 'all' ? 'active' : ''}"
                        data-filter="all"
                        role="tab"
                        aria-selected="${this.currentFilter === 'all'}">
                    All
                </button>
                ${sampradayas.map(s => `
                    <button class="filter-chip ${this.currentFilter === s ? 'active' : ''}"
                            data-filter="${escapeHtml(s)}"
                            role="tab"
                            aria-selected="${this.currentFilter === s}">
                        ${escapeHtml(s)}
                    </button>
                `).join('')}
            </div>
        `;

        return section;
    },

    /**
     * Create saints list
     */
    createSaintsList() {
        let saints = getSaintsByTradition(this.currentTradition);

        // Apply filter
        if (this.currentFilter && this.currentFilter !== 'all') {
            saints = saints.filter(s => s.sampradaya === this.currentFilter);
        }

        const section = document.createElement('section');
        section.className = 'saints-list-section';

        if (saints.length === 0) {
            section.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search empty-icon"></i>
                    <p>No saints found</p>
                </div>
            `;
            return section;
        }

        const list = document.createElement('div');
        list.className = 'saints-list';

        saints.forEach(saint => {
            list.appendChild(createSaintCard(saint, {
                onClick: (s) => this.onSaintClick(s),
                showExplored: true
            }));
        });

        section.appendChild(list);

        // Show count
        const count = document.createElement('p');
        count.className = 'saints-count';
        count.textContent = `${saints.length} saint${saints.length !== 1 ? 's' : ''}`;
        section.insertBefore(count, list);

        return section;
    },

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Filter chip clicks (delegated)
        const filterSection = this.container.querySelector('.filter-chips');
        if (filterSection) {
            const cleanup = delegate(filterSection, 'click', '.filter-chip', (e, target) => {
                const filter = target.dataset.filter;
                this.setFilter(filter);
            });
            this.cleanupFns.push(cleanup);
        }

        // Listen for saint explored events
        const exploredUnsub = eventBus.on(Events.SAINT_EXPLORED, () => {
            // Refresh list to update explored badges
            this.buildContent();
        });
        this.cleanupFns.push(exploredUnsub);

        // Listen for filter changes
        const filterUnsub = eventBus.on(Events.FILTER_CHANGED, ({ filter }) => {
            if (filter !== this.currentFilter) {
                this.currentFilter = filter;
                this.buildContent();
            }
        });
        this.cleanupFns.push(filterUnsub);
    },

    /**
     * Set current filter
     * @param {string} filter
     */
    setFilter(filter) {
        this.currentFilter = filter;
        state.set('currentFilter', filter, { persist: false });

        // Update UI
        const chips = this.container.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            if (chip.dataset.filter === filter) {
                addClass(chip, 'active');
                chip.setAttribute('aria-selected', 'true');
            } else {
                removeClass(chip, 'active');
                chip.setAttribute('aria-selected', 'false');
            }
        });

        // Rebuild saints list
        const listSection = this.container.querySelector('.saints-list-section');
        if (listSection) {
            const parent = listSection.parentNode;
            const newSection = this.createSaintsList();
            parent.replaceChild(newSection, listSection);
        }

        eventBus.emit(Events.FILTER_CHANGED, { filter });
    },

    /**
     * Handle saint card click
     * @param {Object} saint
     */
    onSaintClick(saint) {
        navigate(SCREENS.SAINT_DETAIL, {
            saint: saint,
            saintId: saint.id,
            saintName: saint.name
        });
    },

    /**
     * Cleanup function
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default SaintsListScreen;
