/**
 * Sant Darshan App - Pilgrimage Modal
 * Sacred places associated with saints
 */

import { escapeHtml } from '../utils/sanitize.js';
import { getSaint, getAllSaints } from '../services/saints.js';
import { closeModal, navigate } from '../core/router.js';

/**
 * Pilgrimage Modal Renderer
 */
const PilgrimageModal = {
    container: null,
    cleanupFns: [],
    selectedRegion: 'all',

    /**
     * Render the pilgrimage modal
     * @param {HTMLElement} container
     * @param {Object} data
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];
        this.selectedRegion = data.region || 'all';

        this.buildModal();

        return () => this.cleanup();
    },

    /**
     * Build modal structure
     */
    buildModal() {
        const places = this.gatherPlaces();
        const regions = this.getRegions(places);

        this.container.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container modal-full-height">
                <div class="modal-header">
                    <div class="modal-title-group">
                        <h2 class="modal-title">Sacred Places</h2>
                        <p class="modal-title-hi" lang="hi">तीर्थ स्थल</p>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Region Filter -->
                    <div class="region-filter">
                        <div class="filter-chips">
                            <button class="filter-chip ${this.selectedRegion === 'all' ? 'active' : ''}" data-region="all">
                                All Regions
                            </button>
                            ${regions.map(region => `
                                <button class="filter-chip ${this.selectedRegion === region ? 'active' : ''}"
                                        data-region="${escapeHtml(region)}">
                                    ${escapeHtml(region)}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Places Count -->
                    <p class="places-count">
                        <i class="fas fa-map-marker-alt"></i>
                        ${this.getFilteredPlaces(places).length} sacred places
                    </p>

                    <!-- Places List -->
                    <div class="places-list" id="places-list">
                        ${this.renderPlacesList(this.getFilteredPlaces(places))}
                    </div>
                </div>
            </div>
        `;

        // Setup close button
        const closeBtn = this.container.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal());
        }

        // Backdrop click
        const backdrop = this.container.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => closeModal());
        }

        // Region filter
        this.container.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                this.selectedRegion = chip.dataset.region;
                this.container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.updatePlacesList(places);
            });
        });

        // Place card clicks
        this.setupPlaceCardListeners();
    },

    /**
     * Gather all places from saints
     */
    gatherPlaces() {
        const saints = getAllSaints();
        const places = [];
        const seenPlaces = new Set();

        saints.forEach(saint => {
            if (saint.places && Array.isArray(saint.places)) {
                saint.places.forEach(place => {
                    const key = `${place.name}-${place.location || ''}`;
                    if (!seenPlaces.has(key)) {
                        seenPlaces.add(key);
                        places.push({
                            ...place,
                            saintId: saint.id,
                            saintName: saint.name,
                            region: this.extractRegion(place.location)
                        });
                    } else {
                        // Add saint reference to existing place
                        const existing = places.find(p => `${p.name}-${p.location || ''}` === key);
                        if (existing && existing.saintId !== saint.id) {
                            if (!existing.otherSaints) {
                                existing.otherSaints = [];
                            }
                            existing.otherSaints.push({
                                id: saint.id,
                                name: saint.name
                            });
                        }
                    }
                });
            }

            // Also add birthplace/deathplace if available
            if (saint.birthplace) {
                const key = `birthplace-${saint.id}`;
                if (!seenPlaces.has(key)) {
                    seenPlaces.add(key);
                    places.push({
                        name: `Birthplace of ${saint.name}`,
                        location: saint.birthplace,
                        type: 'birthplace',
                        saintId: saint.id,
                        saintName: saint.name,
                        region: this.extractRegion(saint.birthplace)
                    });
                }
            }
        });

        return places.sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * Extract region from location string
     */
    extractRegion(location) {
        if (!location) return 'Other';

        const regions = [
            'Gujarat', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Tamil Nadu',
            'Uttar Pradesh', 'West Bengal', 'Punjab', 'Odisha', 'Andhra Pradesh',
            'Kerala', 'Madhya Pradesh', 'Bihar', 'Assam', 'Kashmir'
        ];

        for (const region of regions) {
            if (location.toLowerCase().includes(region.toLowerCase())) {
                return region;
            }
        }

        return 'Other';
    },

    /**
     * Get unique regions
     */
    getRegions(places) {
        const regions = new Set(places.map(p => p.region));
        return Array.from(regions).sort();
    },

    /**
     * Get filtered places
     */
    getFilteredPlaces(places) {
        if (this.selectedRegion === 'all') {
            return places;
        }
        return places.filter(p => p.region === this.selectedRegion);
    },

    /**
     * Render places list
     */
    renderPlacesList(places) {
        if (places.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-map-marked-alt"></i>
                    <p>No places found in this region</p>
                </div>
            `;
        }

        return places.map(place => this.renderPlaceCard(place)).join('');
    },

    /**
     * Render place card
     */
    renderPlaceCard(place) {
        const typeIcons = {
            temple: 'fa-gopuram',
            samadhi: 'fa-monument',
            ashram: 'fa-home',
            birthplace: 'fa-baby',
            default: 'fa-map-marker-alt'
        };

        const icon = typeIcons[place.type] || typeIcons.default;

        return `
            <div class="place-card" data-saint-id="${escapeHtml(place.saintId)}">
                <div class="place-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="place-info">
                    <h4 class="place-name">${escapeHtml(place.name)}</h4>
                    ${place.location ? `
                        <p class="place-location">
                            <i class="fas fa-map-pin"></i>
                            ${escapeHtml(place.location)}
                        </p>
                    ` : ''}
                    ${place.description ? `
                        <p class="place-description">${escapeHtml(place.description)}</p>
                    ` : ''}
                    <div class="place-saints">
                        <span class="saint-tag" data-saint-id="${escapeHtml(place.saintId)}">
                            <i class="fas fa-user"></i>
                            ${escapeHtml(place.saintName)}
                        </span>
                        ${place.otherSaints ? place.otherSaints.map(s => `
                            <span class="saint-tag" data-saint-id="${escapeHtml(s.id)}">
                                <i class="fas fa-user"></i>
                                ${escapeHtml(s.name)}
                            </span>
                        `).join('') : ''}
                    </div>
                </div>
                <div class="place-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    },

    /**
     * Update places list
     */
    updatePlacesList(places) {
        const list = this.container.querySelector('#places-list');
        const count = this.container.querySelector('.places-count');
        const filtered = this.getFilteredPlaces(places);

        if (list) {
            list.innerHTML = this.renderPlacesList(filtered);
            this.setupPlaceCardListeners();
        }

        if (count) {
            count.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                ${filtered.length} sacred places
            `;
        }
    },

    /**
     * Setup place card listeners
     */
    setupPlaceCardListeners() {
        this.container.querySelectorAll('.saint-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                const saintId = tag.dataset.saintId;
                if (saintId) {
                    closeModal();
                    navigate('saint', { id: saintId });
                }
            });
        });

        this.container.querySelectorAll('.place-card').forEach(card => {
            card.addEventListener('click', () => {
                const saintId = card.dataset.saintId;
                if (saintId) {
                    closeModal();
                    navigate('saint', { id: saintId });
                }
            });
        });
    },

    /**
     * Cleanup
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default PilgrimageModal;
