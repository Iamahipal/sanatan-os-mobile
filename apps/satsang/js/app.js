/**
 * Satsang App v2 - Application Entry Point
 * Initializes store, router, and renders screens
 */

import { store } from './store.js';
import { router } from './router.js';
import { vachaks, events, cities } from './data.js';
import { refreshIcons, showScreen, modal } from './utils.js';
import { renderHome } from './screens/home.js';
import { renderEvent } from './screens/event.js';
import { renderVachak } from './screens/vachak.js';
import { renderSaved } from './screens/saved.js';
import { renderProfile } from './screens/profile.js';
import { renderCalendar, prevMonth, nextMonth, selectDate } from './screens/calendar.js';

/**
 * App Controller
 */
const App = {
    /**
     * Initialize the application
     */
    init() {
        console.log('🕉️ Satsang App v2 Initializing...');

        try {
            // 1. Initialize store with data
            store.init({
                vachaks,
                events,
                cities
            });

            // 2. Subscribe to screen changes
            store.subscribe('currentScreen', this.handleScreenChange.bind(this));

            // 3. Setup global event listeners
            this.setupEventListeners();

            // 4. Initialize router (handles initial route)
            router.init();

            // 5. Refresh icons
            refreshIcons();

            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showError('Failed to load app. Please refresh.');
        }
    },

    /**
     * Handle screen changes
     */
    handleScreenChange(state) {
        const { currentScreen, currentId } = state;

        // Show correct screen
        showScreen(currentScreen);

        // Render screen content
        switch (currentScreen) {
            case 'home':
                renderHome(state);
                break;
            case 'event':
                renderEvent(currentId);
                break;
            case 'vachak':
                renderVachak(currentId);
                break;
            case 'saved':
                renderSaved(state);
                break;
            case 'profile':
                renderProfile(state);
                break;
            case 'calendar':
                renderCalendar(state);
                break;
        }

        // Refresh icons after render
        setTimeout(() => refreshIcons(), 0);

        // Scroll to top
        document.getElementById('mainContent')?.scrollTo(0, 0);
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Navigation clicks
        document.getElementById('bottomNav')?.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav__item');
            if (navItem) {
                e.preventDefault();
                const screen = navItem.dataset.screen;
                router.push(screen);
            }
        });

        // Location button
        document.getElementById('locationBtn')?.addEventListener('click', () => {
            this.renderLocationModal();
            modal.open('locationModal');
        });

        // Search button
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            modal.open('searchModal');
            document.getElementById('searchInput')?.focus();
        });

        // Modal backdrop click
        document.getElementById('modalBackdrop')?.addEventListener('click', () => {
            modal.closeAll();
        });

        // Modal close buttons
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => modal.closeAll());
        });

        // Escape key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.closeAll();
            }
        });

        // Event delegation for dynamic content
        document.addEventListener('click', (e) => {
            // Event card click
            const eventCard = e.target.closest('[data-event-id]');
            if (eventCard) {
                const eventId = eventCard.dataset.eventId;
                router.push('event', eventId);
                return;
            }

            // Vachak avatar click
            const vachakEl = e.target.closest('[data-vachak-id]');
            if (vachakEl) {
                const vachakId = vachakEl.dataset.vachakId;
                router.push('vachak', vachakId);
                return;
            }

            // Category pill click
            const categoryPill = e.target.closest('[data-category]');
            if (categoryPill) {
                const category = categoryPill.dataset.category;
                store.setCategory(category);
                return;
            }

            // Back button
            const backBtn = e.target.closest('[data-back]');
            if (backBtn) {
                router.back();
                return;
            }

            // Save button
            const saveBtn = e.target.closest('[data-save-event]');
            if (saveBtn) {
                const eventId = saveBtn.dataset.saveEvent;
                store.toggleSaveEvent(eventId);
                // Update button state
                const isSaved = store.isEventSaved(eventId);
                saveBtn.classList.toggle('active', isSaved);
                return;
            }

            // City selection
            const cityBtn = e.target.closest('[data-city]');
            if (cityBtn) {
                const city = cityBtn.dataset.city;
                store.setCity(city);
                document.getElementById('currentLocation').textContent = store.getState().userLocation;
                modal.close('locationModal');
                return;
            }

            // Calendar date selection
            const dateBtn = e.target.closest('.calendar-grid__day[data-date]');
            if (dateBtn) {
                selectDate(dateBtn.dataset.date);
                return;
            }

            // Nav to home from empty state
            const navHomeBtn = e.target.closest('[data-nav="home"]');
            if (navHomeBtn) {
                router.push('home');
                return;
            }
        });

        // Calendar month navigation
        document.getElementById('prevMonthBtn')?.addEventListener('click', () => prevMonth());
        document.getElementById('nextMonthBtn')?.addEventListener('click', () => nextMonth());
    },

    /**
     * Render location modal content
     */
    renderLocationModal() {
        const state = store.getState();
        const container = document.getElementById('locationModalBody');
        if (!container) return;

        // All cities option plus city list
        const cityEntries = [
            ['all', { name: 'All India', emoji: '🇮🇳' }],
            ...Object.entries(state.cities)
        ];

        container.innerHTML = cityEntries.map(([id, city]) => `
            <button class="menu-item ${state.selectedCity === id ? 'active' : ''}" data-city="${id}">
                <span class="menu-item__icon">${city.emoji || '📍'}</span>
                <span class="menu-item__label">${city.name}</span>
                ${state.selectedCity === id ? '<i data-lucide="check" class="menu-item__arrow"></i>' : ''}
            </button>
        `).join('');

        refreshIcons(container);
    },

    /**
     * Show error state
     */
    showError(message) {
        const main = document.getElementById('mainContent');
        if (main) {
            main.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="alert-circle" class="empty-state__icon"></i>
                    <h3 class="empty-state__title">Something went wrong</h3>
                    <p class="empty-state__message">${message}</p>
                </div>
            `;
            refreshIcons();
        }
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
