/**
 * Sant Darshan App - Saint Detail Screen
 * Displays full information about a saint
 */

import { $, clearChildren, delegate, addClass, removeClass } from '../utils/dom.js';
import { escapeHtml, sanitizeInput } from '../utils/sanitize.js';
import { getInitials, formatRelative } from '../utils/helpers.js';
import { now } from '../utils/date.js';
import state from '../core/state.js';
import eventBus, { Events } from '../core/events.js';
import { openModal } from '../core/router.js';
import { MODALS } from '../data/constants.js';
import { TRADITIONS } from '../data/traditions.js';
import {
    getSaint,
    getSaintStories,
    getSaintConnections,
    getSaintPlaces,
    getSaintGuru,
    getSaintDisciples,
    hasSaintStories,
    hasSaintPlaces
} from '../services/saints.js';
import storage from '../services/storage.js';

/**
 * Saint Detail Screen Renderer
 */
const SaintDetailScreen = {
    container: null,
    cleanupFns: [],
    currentSaint: null,
    viewStartTime: null,

    /**
     * Render the saint detail screen
     * @param {HTMLElement} container
     * @param {Object} data - Screen data with saint info
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];
        this.viewStartTime = now();

        // Get saint data
        const saintId = data.saintId || data.saint?.id || state.get('currentSaint');
        this.currentSaint = getSaint(saintId) || data.saint;

        if (!this.currentSaint) {
            this.renderError();
            return () => this.cleanup();
        }

        // Mark as explored
        storage.markExplored(this.currentSaint.id);

        // Build the screen content
        this.buildContent();

        // Setup event handlers
        this.setupEventHandlers();

        // Return cleanup function
        return () => this.cleanup();
    },

    /**
     * Render error state
     */
    renderError() {
        const content = this.container.querySelector('.screen-content') || this.container;
        content.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle error-icon"></i>
                <p>Saint not found</p>
            </div>
        `;
    },

    /**
     * Build the saint detail content
     */
    buildContent() {
        const content = this.container.querySelector('.screen-content') || this.container;
        clearChildren(content);

        const saint = this.currentSaint;
        const tradition = TRADITIONS[saint.tradition] || {};
        const isFavorite = storage.isFavorite(saint.id);

        // Hero section
        content.appendChild(this.createHeroSection(saint, tradition, isFavorite));

        // Quote block
        if (saint.quotes?.length > 0) {
            content.appendChild(this.createQuoteSection(saint));
        }

        // Biography
        content.appendChild(this.createBiographySection(saint));

        // Teachings
        if (saint.teachings?.length > 0) {
            content.appendChild(this.createTeachingsSection(saint));
        }

        // Works
        if (saint.works?.length > 0) {
            content.appendChild(this.createWorksSection(saint));
        }

        // Stories (if available)
        const stories = getSaintStories(saint.id);
        if (stories?.length > 0) {
            content.appendChild(this.createStoriesSection(stories));
        }

        // Spiritual connections
        const connections = getSaintConnections(saint.id);
        if (connections) {
            content.appendChild(this.createConnectionsSection(connections));
        }

        // More quotes
        if (saint.quotes?.length > 1) {
            content.appendChild(this.createMoreQuotesSection(saint));
        }

        // Places (if available)
        const places = getSaintPlaces(saint.id);
        if (places?.length > 0) {
            content.appendChild(this.createPlacesSection(places));
        }

        // Reflections/Notes
        content.appendChild(this.createReflectionsSection(saint));

        // Actions section
        content.appendChild(this.createActionsSection(saint));
    },

    /**
     * Create hero section with avatar and basic info
     */
    createHeroSection(saint, tradition, isFavorite) {
        const initials = getInitials(saint.name);

        const section = document.createElement('section');
        section.className = 'saint-hero';
        section.innerHTML = `
            <div class="saint-hero-avatar" style="background: ${tradition.gradient || 'var(--primary-gradient)'}">
                <span class="saint-hero-initials">${initials}</span>
            </div>
            <div class="saint-hero-info">
                <h1 class="saint-hero-name">${escapeHtml(saint.name)}</h1>
                ${saint.nameLocal ? `<p class="saint-hero-name-local">${escapeHtml(saint.nameLocal)}</p>` : ''}
                ${saint.nameHi ? `<p class="saint-hero-name-hi" lang="hi">${escapeHtml(saint.nameHi)}</p>` : ''}
            </div>
            <div class="saint-hero-tags">
                <span class="tag tag-tradition" style="background: ${tradition.color}20; color: ${tradition.color}">
                    ${tradition.icon} ${escapeHtml(saint.sampradaya || tradition.name)}
                </span>
                ${saint.period ? `<span class="tag tag-period"><i class="fas fa-clock"></i> ${escapeHtml(saint.period)}</span>` : ''}
                ${saint.birthPlace ? `<span class="tag tag-place"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(saint.birthPlace)}</span>` : ''}
            </div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-action="toggle-favorite" aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                <i class="fas fa-heart"></i>
            </button>
        `;

        return section;
    },

    /**
     * Create featured quote section
     */
    createQuoteSection(saint) {
        const section = document.createElement('section');
        section.className = 'saint-quote-section';
        section.innerHTML = `
            <blockquote class="saint-quote">
                <i class="fas fa-quote-left quote-icon"></i>
                <p class="quote-text">${escapeHtml(saint.quotes[0])}</p>
            </blockquote>
        `;
        return section;
    },

    /**
     * Create biography section
     */
    createBiographySection(saint) {
        const section = document.createElement('section');
        section.className = 'saint-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-book-open"></i> Biography</h3>
            <div class="section-content">
                <p class="biography-text">${escapeHtml(saint.biography || 'Biography not available.')}</p>
            </div>
        `;
        return section;
    },

    /**
     * Create teachings section
     */
    createTeachingsSection(saint) {
        const section = document.createElement('section');
        section.className = 'saint-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-lightbulb"></i> Teachings</h3>
            <div class="section-content teachings-list">
                ${saint.teachings.map(t => `
                    <div class="teaching-tag">${escapeHtml(t)}</div>
                `).join('')}
            </div>
        `;
        return section;
    },

    /**
     * Create works section
     */
    createWorksSection(saint) {
        const section = document.createElement('section');
        section.className = 'saint-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-scroll"></i> Major Works</h3>
            <ul class="works-list">
                ${saint.works.map(w => `<li class="work-item">${escapeHtml(w)}</li>`).join('')}
            </ul>
        `;
        return section;
    },

    /**
     * Create stories section (expandable)
     */
    createStoriesSection(stories) {
        const section = document.createElement('section');
        section.className = 'saint-section stories-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-feather-alt"></i> Life Stories</h3>
            <div class="stories-list">
                ${stories.map((story, index) => `
                    <div class="story-card" data-story-index="${index}">
                        <div class="story-header">
                            <span class="story-type story-type-${story.type}">${escapeHtml(story.type)}</span>
                            <h4 class="story-title">${escapeHtml(story.title)}</h4>
                            ${story.titleHi ? `<p class="story-title-hi" lang="hi">${escapeHtml(story.titleHi)}</p>` : ''}
                            <i class="fas fa-chevron-down story-toggle"></i>
                        </div>
                        <div class="story-content">
                            <p class="story-text">${escapeHtml(story.content)}</p>
                            ${story.lesson ? `<p class="story-lesson"><strong>Lesson:</strong> ${escapeHtml(story.lesson)}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return section;
    },

    /**
     * Create spiritual connections section
     */
    createConnectionsSection(connections) {
        const guru = connections.guru ? getSaint(connections.guru) : null;
        const disciples = (connections.shishyas || []).map(id => getSaint(id)).filter(s => s);
        const influenced = (connections.influenced || []).map(id => getSaint(id)).filter(s => s);

        if (!guru && disciples.length === 0 && influenced.length === 0) {
            return document.createDocumentFragment();
        }

        const section = document.createElement('section');
        section.className = 'saint-section connections-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-sitemap"></i> Spiritual Lineage</h3>
            <div class="connections-content">
                ${guru ? `
                    <div class="connection-group">
                        <h4 class="connection-label">Guru</h4>
                        <div class="connection-card" data-saint-id="${guru.id}">
                            <div class="connection-avatar">${getInitials(guru.name)}</div>
                            <span class="connection-name">${escapeHtml(guru.name)}</span>
                        </div>
                    </div>
                ` : ''}
                ${disciples.length > 0 ? `
                    <div class="connection-group">
                        <h4 class="connection-label">Disciples</h4>
                        <div class="connections-list">
                            ${disciples.map(d => `
                                <div class="connection-card" data-saint-id="${d.id}">
                                    <div class="connection-avatar">${getInitials(d.name)}</div>
                                    <span class="connection-name">${escapeHtml(d.name)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${influenced.length > 0 ? `
                    <div class="connection-group">
                        <h4 class="connection-label">Influenced</h4>
                        <div class="connections-list">
                            ${influenced.map(i => `
                                <div class="connection-card" data-saint-id="${i.id}">
                                    <div class="connection-avatar">${getInitials(i.name)}</div>
                                    <span class="connection-name">${escapeHtml(i.name)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        return section;
    },

    /**
     * Create more quotes section
     */
    createMoreQuotesSection(saint) {
        const section = document.createElement('section');
        section.className = 'saint-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-quote-right"></i> More Quotes</h3>
            <div class="quotes-list">
                ${saint.quotes.slice(1).map(q => `
                    <blockquote class="quote-item">
                        <p>${escapeHtml(q)}</p>
                    </blockquote>
                `).join('')}
            </div>
        `;
        return section;
    },

    /**
     * Create places section
     */
    createPlacesSection(places) {
        const section = document.createElement('section');
        section.className = 'saint-section places-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-map-marked-alt"></i> Sacred Places</h3>
            <div class="places-list">
                ${places.map(p => `
                    <div class="place-card">
                        <div class="place-icon">
                            <i class="fas fa-${this.getPlaceIcon(p.type)}"></i>
                        </div>
                        <div class="place-info">
                            <h4 class="place-name">${escapeHtml(p.name)}</h4>
                            <p class="place-location">${escapeHtml(p.city)}, ${escapeHtml(p.state)}</p>
                            ${p.description ? `<p class="place-description">${escapeHtml(p.description)}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return section;
    },

    /**
     * Get icon for place type
     */
    getPlaceIcon(type) {
        const icons = {
            birthplace: 'baby',
            samadhi: 'pray',
            sadhana: 'om',
            temple: 'gopuram',
            residence: 'home',
            miracle: 'star',
            nirvan: 'infinity',
            creation: 'landmark',
            marriage: 'heart'
        };
        return icons[type] || 'map-marker-alt';
    },

    /**
     * Create reflections/notes section
     */
    createReflectionsSection(saint) {
        const notes = storage.getNotes(saint.id);

        const section = document.createElement('section');
        section.className = 'saint-section reflections-section';
        section.innerHTML = `
            <h3 class="section-title"><i class="fas fa-pen"></i> Your Reflections</h3>
            <div class="add-note-form">
                <textarea class="note-input" placeholder="Write your thoughts..." rows="3" maxlength="5000"></textarea>
                <button class="btn btn-primary add-note-btn" data-action="add-note">
                    <i class="fas fa-plus"></i> Add Reflection
                </button>
            </div>
            <div class="notes-list">
                ${notes.length === 0 ? '<p class="notes-empty">No reflections yet. Share your thoughts about this saint.</p>' : ''}
                ${notes.map(n => `
                    <div class="note-card" data-note-id="${n.id}">
                        <p class="note-text">${escapeHtml(n.text)}</p>
                        <div class="note-footer">
                            <span class="note-date">${formatRelative(n.createdAt)}</span>
                            <button class="note-delete" data-action="delete-note" data-note-id="${n.id}" aria-label="Delete note">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return section;
    },

    /**
     * Create actions section
     */
    createActionsSection(saint) {
        const section = document.createElement('section');
        section.className = 'saint-actions';
        section.innerHTML = `
            <button class="btn btn-outline" data-action="share-quote">
                <i class="fas fa-share-alt"></i> Share Quote
            </button>
        `;
        return section;
    },

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Favorite toggle
        const favoriteBtn = this.container.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Add note
        const addNoteBtn = this.container.querySelector('.add-note-btn');
        if (addNoteBtn) {
            addNoteBtn.addEventListener('click', () => this.addNote());
        }

        // Delete note (delegated)
        const notesList = this.container.querySelector('.notes-list');
        if (notesList) {
            const cleanup = delegate(notesList, 'click', '.note-delete', (e, target) => {
                const noteId = target.dataset.noteId;
                this.deleteNote(noteId);
            });
            this.cleanupFns.push(cleanup);
        }

        // Story toggle (delegated)
        const storiesSection = this.container.querySelector('.stories-section');
        if (storiesSection) {
            const cleanup = delegate(storiesSection, 'click', '.story-header', (e, target) => {
                const card = target.closest('.story-card');
                if (card) {
                    card.classList.toggle('expanded');
                }
            });
            this.cleanupFns.push(cleanup);
        }

        // Connection card clicks (delegated)
        const connectionsSection = this.container.querySelector('.connections-section');
        if (connectionsSection) {
            const cleanup = delegate(connectionsSection, 'click', '.connection-card', (e, target) => {
                const saintId = target.dataset.saintId;
                if (saintId) {
                    this.navigateToSaint(saintId);
                }
            });
            this.cleanupFns.push(cleanup);
        }

        // Share quote
        const shareBtn = this.container.querySelector('[data-action="share-quote"]');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareQuote());
        }
    },

    /**
     * Toggle favorite status
     */
    toggleFavorite() {
        const isFavorite = storage.toggleFavorite(this.currentSaint.id);
        const btn = this.container.querySelector('.favorite-btn');
        if (btn) {
            btn.classList.toggle('active', isFavorite);
            btn.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
        }
    },

    /**
     * Add a note
     */
    addNote() {
        const input = this.container.querySelector('.note-input');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        storage.addNote(this.currentSaint.id, text);
        input.value = '';

        // Refresh notes list
        const section = this.container.querySelector('.reflections-section');
        if (section) {
            const newSection = this.createReflectionsSection(this.currentSaint);
            section.parentNode.replaceChild(newSection, section);
            this.setupEventHandlers();
        }
    },

    /**
     * Delete a note
     */
    deleteNote(noteId) {
        storage.deleteNote(this.currentSaint.id, noteId);

        // Refresh notes list
        const section = this.container.querySelector('.reflections-section');
        if (section) {
            const newSection = this.createReflectionsSection(this.currentSaint);
            section.parentNode.replaceChild(newSection, section);
            this.setupEventHandlers();
        }
    },

    /**
     * Navigate to another saint
     */
    navigateToSaint(saintId) {
        const saint = getSaint(saintId);
        if (saint) {
            // Update current saint and rebuild
            this.currentSaint = saint;
            storage.markExplored(saint.id);
            state.set('currentSaint', saint.id, { persist: false });

            // Update header
            eventBus.emit(Events.SCREEN_CHANGED, {
                screenId: 'saint-detail',
                data: { saintName: saint.name }
            });

            // Rebuild content
            this.buildContent();
            this.setupEventHandlers();

            // Scroll to top
            window.scrollTo(0, 0);
        }
    },

    /**
     * Share quote
     */
    shareQuote() {
        openModal(MODALS.SHARE_CARD, { saint: this.currentSaint });
    },

    /**
     * Cleanup function
     */
    cleanup() {
        // Track time spent
        if (this.viewStartTime && this.currentSaint) {
            const timeSpent = now() - this.viewStartTime;
            storage.updateTimeSpent(this.currentSaint.id, timeSpent);
        }

        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default SaintDetailScreen;
