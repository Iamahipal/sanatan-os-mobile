/**
 * Sant Darshan App - Journal Modal
 * Daily reflection journal
 */

import { clearChildren, createElement, addClass, removeClass } from '../utils/dom.js';
import { escapeHtml, sanitizeInput } from '../utils/sanitize.js';
import journal from '../services/journal.js';
import { formatDate, formatRelativeDate, getDateKey } from '../utils/date.js';
import { closeModal } from '../core/router.js';
import { showToast } from '../components/toast.js';

/**
 * Journal Modal Renderer
 */
const JournalModal = {
    container: null,
    cleanupFns: [],
    currentView: 'list', // 'list' | 'entry' | 'new'
    selectedDate: null,

    /**
     * Render the journal modal
     * @param {HTMLElement} container
     * @param {Object} data
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];
        this.currentView = data.view || 'list';
        this.selectedDate = data.date || null;

        // Build modal structure
        this.buildModal();
        this.renderCurrentView();

        return () => this.cleanup();
    },

    /**
     * Build modal structure
     */
    buildModal() {
        this.container.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container modal-full-height">
                <div class="modal-header">
                    <div class="modal-title-group">
                        <h2 class="modal-title">Journal</h2>
                        <p class="modal-title-hi" lang="hi">आत्म-चिंतन</p>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="journal-content"></div>
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
    },

    /**
     * Render current view
     */
    renderCurrentView() {
        const content = this.container.querySelector('#journal-content');
        if (!content) return;

        switch (this.currentView) {
            case 'list':
                this.renderList(content);
                break;
            case 'entry':
                this.renderEntry(content);
                break;
            case 'new':
                this.renderNewEntry(content);
                break;
        }
    },

    /**
     * Render journal list
     */
    renderList(content) {
        const stats = journal.getStats();
        const entries = journal.getAllEntries();
        const today = getDateKey(new Date());
        const hasToday = entries.some(e => e.date === today);

        content.innerHTML = `
            <!-- Stats -->
            <div class="journal-stats">
                <div class="stat-item">
                    <i class="fas fa-book"></i>
                    <span class="stat-value">${stats.totalEntries}</span>
                    <span class="stat-label">Entries</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-fire"></i>
                    <span class="stat-value">${stats.currentStreak}</span>
                    <span class="stat-label">Day Streak</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-calendar-check"></i>
                    <span class="stat-value">${stats.thisMonthCount}</span>
                    <span class="stat-label">This Month</span>
                </div>
            </div>

            <!-- New Entry Button -->
            <button class="btn btn-primary btn-block" id="new-entry-btn">
                <i class="fas fa-plus"></i>
                ${hasToday ? "Edit Today's Entry" : "Write Today's Entry"}
            </button>

            <!-- Entries List -->
            <div class="journal-entries">
                <h3 class="section-title">Recent Entries</h3>
                ${entries.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-feather-alt"></i>
                        <p>No journal entries yet</p>
                        <p class="text-sm text-tertiary">Start your spiritual reflection journey</p>
                    </div>
                ` : `
                    <div class="entries-list">
                        ${entries.slice(0, 20).map(entry => this.renderEntryCard(entry)).join('')}
                    </div>
                `}
            </div>
        `;

        // New entry button
        const newBtn = content.querySelector('#new-entry-btn');
        if (newBtn) {
            newBtn.addEventListener('click', () => {
                this.selectedDate = today;
                this.currentView = 'new';
                this.renderCurrentView();
            });
        }

        // Entry cards
        content.querySelectorAll('.entry-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectedDate = card.dataset.date;
                this.currentView = 'entry';
                this.renderCurrentView();
            });
        });
    },

    /**
     * Render entry card
     */
    renderEntryCard(entry) {
        const date = new Date(entry.date + 'T00:00:00');
        const moodEmoji = this.getMoodEmoji(entry.mood);

        return `
            <div class="entry-card" data-date="${escapeHtml(entry.date)}">
                <div class="entry-date">
                    <span class="date-day">${date.getDate()}</span>
                    <span class="date-month">${date.toLocaleDateString('en', { month: 'short' })}</span>
                </div>
                <div class="entry-preview">
                    <p class="entry-text">${escapeHtml(entry.reflection.substring(0, 100))}${entry.reflection.length > 100 ? '...' : ''}</p>
                    ${entry.gratitude ? `<span class="entry-tag"><i class="fas fa-heart"></i> Gratitude</span>` : ''}
                </div>
                <div class="entry-mood">${moodEmoji}</div>
            </div>
        `;
    },

    /**
     * Render single entry view
     */
    renderEntry(content) {
        const entry = journal.getEntry(this.selectedDate);
        if (!entry) {
            this.currentView = 'list';
            this.renderCurrentView();
            return;
        }

        const date = new Date(entry.date + 'T00:00:00');
        const moodEmoji = this.getMoodEmoji(entry.mood);

        content.innerHTML = `
            <button class="btn btn-text back-btn" id="back-to-list">
                <i class="fas fa-arrow-left"></i> Back to List
            </button>

            <div class="entry-header">
                <h3 class="entry-date-full">${formatDate(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                <span class="entry-mood-large">${moodEmoji}</span>
            </div>

            ${entry.gratitude ? `
                <div class="entry-section">
                    <h4 class="section-label"><i class="fas fa-heart"></i> Gratitude</h4>
                    <p class="entry-content">${escapeHtml(entry.gratitude)}</p>
                </div>
            ` : ''}

            <div class="entry-section">
                <h4 class="section-label"><i class="fas fa-feather-alt"></i> Reflection</h4>
                <p class="entry-content">${escapeHtml(entry.reflection)}</p>
            </div>

            ${entry.intention ? `
                <div class="entry-section">
                    <h4 class="section-label"><i class="fas fa-star"></i> Intention</h4>
                    <p class="entry-content">${escapeHtml(entry.intention)}</p>
                </div>
            ` : ''}

            ${entry.saintId ? `
                <div class="entry-section">
                    <h4 class="section-label"><i class="fas fa-user"></i> Saint Studied</h4>
                    <p class="entry-content">${escapeHtml(entry.saintName || entry.saintId)}</p>
                </div>
            ` : ''}

            <div class="entry-actions">
                <button class="btn btn-secondary" id="edit-entry-btn">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" id="delete-entry-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        // Back button
        const backBtn = content.querySelector('#back-to-list');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.currentView = 'list';
                this.renderCurrentView();
            });
        }

        // Edit button
        const editBtn = content.querySelector('#edit-entry-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.currentView = 'new';
                this.renderCurrentView();
            });
        }

        // Delete button
        const deleteBtn = content.querySelector('#delete-entry-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Delete this journal entry?')) {
                    journal.deleteEntry(this.selectedDate);
                    showToast('Entry deleted', 'success');
                    this.currentView = 'list';
                    this.renderCurrentView();
                }
            });
        }
    },

    /**
     * Render new/edit entry form
     */
    renderNewEntry(content) {
        const existingEntry = journal.getEntry(this.selectedDate);
        const date = new Date(this.selectedDate + 'T00:00:00');

        content.innerHTML = `
            <button class="btn btn-text back-btn" id="back-to-list">
                <i class="fas fa-arrow-left"></i> Back
            </button>

            <h3 class="form-title">${existingEntry ? 'Edit Entry' : 'New Entry'}</h3>
            <p class="form-date">${formatDate(date, { weekday: 'long', month: 'long', day: 'numeric' })}</p>

            <form id="journal-form" class="journal-form">
                <!-- Mood -->
                <div class="form-group">
                    <label class="form-label">How are you feeling?</label>
                    <div class="mood-selector">
                        ${['great', 'good', 'okay', 'low', 'difficult'].map(mood => `
                            <button type="button" class="mood-btn ${existingEntry?.mood === mood ? 'selected' : ''}" data-mood="${mood}">
                                ${this.getMoodEmoji(mood)}
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" name="mood" value="${existingEntry?.mood || 'okay'}">
                </div>

                <!-- Gratitude -->
                <div class="form-group">
                    <label class="form-label" for="gratitude">
                        <i class="fas fa-heart"></i> What are you grateful for?
                    </label>
                    <textarea id="gratitude" name="gratitude" rows="2"
                        placeholder="Today I'm grateful for...">${escapeHtml(existingEntry?.gratitude || '')}</textarea>
                </div>

                <!-- Reflection -->
                <div class="form-group">
                    <label class="form-label" for="reflection">
                        <i class="fas fa-feather-alt"></i> Daily Reflection *
                    </label>
                    <textarea id="reflection" name="reflection" rows="4" required
                        placeholder="What spiritual insights or experiences did you have today?">${escapeHtml(existingEntry?.reflection || '')}</textarea>
                </div>

                <!-- Intention -->
                <div class="form-group">
                    <label class="form-label" for="intention">
                        <i class="fas fa-star"></i> Tomorrow's Intention
                    </label>
                    <textarea id="intention" name="intention" rows="2"
                        placeholder="What do you intend to focus on?">${escapeHtml(existingEntry?.intention || '')}</textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Entry
                    </button>
                </div>
            </form>
        `;

        // Back button
        const backBtn = content.querySelector('#back-to-list');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.currentView = 'list';
                this.renderCurrentView();
            });
        }

        // Cancel button
        const cancelBtn = content.querySelector('#cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.currentView = 'list';
                this.renderCurrentView();
            });
        }

        // Mood selector
        const moodBtns = content.querySelectorAll('.mood-btn');
        const moodInput = content.querySelector('input[name="mood"]');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                moodBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                if (moodInput) moodInput.value = btn.dataset.mood;
            });
        });

        // Form submission
        const form = content.querySelector('#journal-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEntry(form);
            });
        }
    },

    /**
     * Save journal entry
     */
    saveEntry(form) {
        const formData = new FormData(form);
        const entry = {
            mood: formData.get('mood') || 'okay',
            gratitude: sanitizeInput(formData.get('gratitude') || '', { maxLength: 500 }),
            reflection: sanitizeInput(formData.get('reflection') || '', { maxLength: 2000 }),
            intention: sanitizeInput(formData.get('intention') || '', { maxLength: 500 })
        };

        if (!entry.reflection.trim()) {
            showToast('Please write a reflection', 'error');
            return;
        }

        journal.saveEntry(this.selectedDate, entry);
        showToast('Entry saved', 'success');

        this.currentView = 'list';
        this.renderCurrentView();
    },

    /**
     * Get mood emoji
     */
    getMoodEmoji(mood) {
        const moods = {
            great: '😊',
            good: '🙂',
            okay: '😐',
            low: '😔',
            difficult: '😢'
        };
        return moods[mood] || '😐';
    },

    /**
     * Cleanup
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default JournalModal;
