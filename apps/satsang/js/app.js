/**
 * Satsang App v2 - Application Entry Point
 * Initializes store, router, and renders screens
 */

import { store } from './store.js';
import { router } from './router.js';
import { vachaks, events, cities } from './data.js';
import { refreshIcons, showScreen, modal, showToast, debounce } from './utils.js';
import { renderHome } from './screens/home.js';
import { renderEvent } from './screens/event.js';
import { renderVachak } from './screens/vachak.js';
import { renderSaved } from './screens/saved.js';
import { renderProfile } from './screens/profile.js';
import { renderCalendar, prevMonth, nextMonth, selectDate } from './screens/calendar.js';
import { showSearchModal } from './components/search.js';
import { initYouTubeAPI, openYouTubePlayer, extractYouTubeId } from './components/youtube-player.js';
import { showCalendarExportModal } from './services/calendar-export.js';
import { startReminderService, requestNotificationPermission } from './services/notifications.js';

/**
 * App Controller
 */
const App = {
    /**
     * Initialize the application
     */
    init() {
        console.log('🕉️ Satsang App v3 Initializing...');

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

            // 6. Start reminder service for notifications
            startReminderService();

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

        // Search button - opens full-screen search modal
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            showSearchModal();
        });

        // Initialize YouTube API for live streams
        initYouTubeAPI().catch(err => console.log('YouTube API will load on demand'));

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
                // Show toast feedback
                showToast(isSaved ? '❤️ Event saved!' : 'Event removed from saved');
                return;
            }

            // Share button (Web Share API)
            const shareBtn = e.target.closest('[data-share]');
            if (shareBtn) {
                const eventId = shareBtn.dataset.share;
                const event = store.getEvent(eventId);
                if (event) {
                    const shareData = {
                        title: event.title,
                        text: `Check out ${event.title} at ${event.location.cityName}`,
                        url: window.location.href
                    };
                    if (navigator.share) {
                        navigator.share(shareData).catch(() => { });
                    } else {
                        // Fallback: copy URL
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Link copied to clipboard!');
                    }
                }
                return;
            }

            // Register button
            const registerBtn = e.target.closest('[data-register]');
            if (registerBtn) {
                const eventId = registerBtn.dataset.register;
                const event = store.getEvent(eventId);
                if (event?.organizer?.contact) {
                    window.open(`mailto:${event.organizer.contact}?subject=Registration for ${event.title}`, '_blank');
                } else {
                    showToast('📋 Registration info coming soon!');
                }
                return;
            }

            // Add to Calendar button
            const calendarBtn = e.target.closest('[data-add-calendar]');
            if (calendarBtn) {
                const eventId = calendarBtn.dataset.addCalendar;
                const event = store.getEvent(eventId);
                const vachak = store.getVachak(event?.vachakId);
                if (event) {
                    showCalendarExportModal(event, vachak);
                }
                return;
            }

            // Watch YouTube button (in-app player)
            const youtubeBtn = e.target.closest('[data-watch-youtube]');
            if (youtubeBtn) {
                const eventId = youtubeBtn.dataset.watchYoutube;
                const event = store.getEvent(eventId);
                const vachak = store.getVachak(event?.vachakId);
                const youtubeUrl = event?.liveYoutubeUrl || vachak?.socials?.youtube;
                if (youtubeUrl) {
                    const videoId = extractYouTubeId(youtubeUrl);
                    if (videoId) {
                        openYouTubePlayer(videoId, event?.title || 'Live Katha', true);
                    } else {
                        window.open(youtubeUrl, '_blank');
                    }
                }
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

        // Install App button (from profile)
        document.addEventListener('click', (e) => {
            if (e.target.closest('#installAppBtn')) {
                if (window.installApp) window.installApp();
            }
            if (e.target.closest('#enableNotificationsBtn')) {
                requestNotificationPermission().then((permission) => {
                    if (permission === 'granted') {
                        showToast('🔔 Notifications enabled!');
                    } else if (permission === 'denied') {
                        showToast('❌ Notifications blocked. Enable in browser settings.');
                    }
                    // Re-render profile to update status
                    const state = store.getState();
                    if (state.currentScreen === 'profile') {
                        renderProfile(state);
                        refreshIcons();
                    }
                });
            }
        });
    },

    /**
     * Render location modal content
     */
    renderLocationModal() {
        const state = store.getState();
        const container = document.getElementById('locationModalBody');
        if (!container) return;

        // Use cities directly (already includes 'all')
        const cityEntries = Object.entries(state.cities);

        container.innerHTML = cityEntries.map(([id, city]) => `
            <button class="location-item ${state.selectedCity === id ? 'location-item--active' : ''}" data-city="${id}">
                <div class="location-item__icon">
                    <i data-lucide="${city.icon || 'map-pin'}"></i>
                </div>
                <span class="location-item__name">${city.name}</span>
                ${state.selectedCity === id ? '<i data-lucide="check" class="location-item__check"></i>' : ''}
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
    },

    /**
     * Render search results
     */
    renderSearchResults(query, container) {
        const state = store.getState();

        // Search events
        const matchedEvents = state.events.filter(e =>
            e.title.toLowerCase().includes(query) ||
            e.location.cityName.toLowerCase().includes(query)
        ).slice(0, 5);

        // Search vachaks
        const matchedVachaks = state.vachaks.filter(v =>
            v.name.toLowerCase().includes(query) ||
            v.shortName.toLowerCase().includes(query)
        ).slice(0, 3);

        if (matchedEvents.length === 0 && matchedVachaks.length === 0) {
            container.innerHTML = `
                <div class="search-empty">
                    <i data-lucide="search-x"></i>
                    <p>No results for "${query}"</p>
                </div>
            `;
            refreshIcons(container);
            return;
        }

        let html = '';

        // Vachaks section
        if (matchedVachaks.length > 0) {
            html += `<div class="search-section">
                <h4 class="search-section__title">Vachaks</h4>
                ${matchedVachaks.map(v => `
                    <div class="search-result" data-vachak-id="${v.id}">
                        <div class="avatar avatar--sm">
                            ${v.image ? `<img src="${v.image}" alt="${v.shortName}">` : `<span>${v.emoji || '🙏'}</span>`}
                        </div>
                        <div class="search-result__info">
                            <span class="search-result__title">${v.shortName}</span>
                            <span class="search-result__subtitle">${v.specialty}</span>
                        </div>
                    </div>
                `).join('')}
            </div>`;
        }

        // Events section
        if (matchedEvents.length > 0) {
            html += `<div class="search-section">
                <h4 class="search-section__title">Events</h4>
                ${matchedEvents.map(e => `
                    <div class="search-result" data-event-id="${e.id}">
                        <div class="search-result__icon">
                            <i data-lucide="calendar"></i>
                        </div>
                        <div class="search-result__info">
                            <span class="search-result__title">${e.title}</span>
                            <span class="search-result__subtitle">${e.location.cityName}</span>
                        </div>
                    </div>
                `).join('')}
            </div>`;
        }

        container.innerHTML = html;
        refreshIcons(container);
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
