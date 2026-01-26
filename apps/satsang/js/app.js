/**
 * Satsang App - Main Entry
 */

import { store } from './store.js';
import { Router } from './router.js';
import { events, vachaks, cities } from './data/mock_data.js';
import { EventService } from './services/events.js';
import { EventCard } from './components/EventCard.js';
import { EventDetail } from './components/EventDetail.js';
import { VachakProfile } from './components/VachakProfile.js';
import { SearchModal } from './components/SearchModal.js';
import { Calendar } from './components/Calendar.js';
import { Profile } from './components/Profile.js';

// Initialize
// Initialize
const initApp = () => {
    console.log('Satsang App Initializing...');

    // 1. Hydrate Store
    // Associate vachak objects to events for easier rendering
    const enrichedEvents = events.map(e => ({
        ...e,
        vachak: vachaks.find(v => v.id === e.vachakId)
    }));

    store.init(enrichedEvents, vachaks, cities);

    // 2. Setup Router
    const router = new Router({
        'home': renderHome,
        'calendar': renderCalendar,
        'saved': renderSaved,
        'profile': renderProfile,
        'event': renderEventDetail,
        'vachak': renderVachakProfile
    });

    // 3. Global Listeners
    setupGlobalListeners();

    // Initial Render handled by Router
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


// ===== RENDERERS =====

function renderHome() {
    showScreen('homeScreen');

    const container = document.getElementById('eventsList');
    container.innerHTML = '';

    const upcoming = EventService.getUpcomingEvents();
    upcoming.forEach(event => {
        container.appendChild(EventCard(event));
    });

    // Update Lucide icons
    lucide.createIcons();
}

function renderEventDetail(id) {
    console.log('[App] renderEventDetail called with:', id); // DEBUG
    if (!id) return;
    const event = EventService.getEventById(id);
    console.log('[App] Event found:', event); // DEBUG
    if (!event) {
        console.error('[App] Event ID not found in store:', id);
        return;
    }

    const container = document.getElementById('eventMain');
    container.innerHTML = '';

    try {
        container.appendChild(EventDetail(event));
    } catch (e) {
        console.error('[App] Error rendering EventDetail component:', e);
        return;
    }

    showScreen('eventScreen');
    lucide.createIcons();
}

function renderSaved() {
    showScreen('savedScreen');
    const container = document.getElementById('savedList');
    container.innerHTML = '';

    const savedIds = store.getState().savedEvents;
    if (savedIds.length === 0) {
        document.getElementById('noSavedEvents').style.display = 'block';
    } else {
        document.getElementById('noSavedEvents').style.display = 'none';
        savedIds.forEach(id => {
            const event = EventService.getEventById(id);
            if (event) container.appendChild(EventCard(event));
        });
    }
    lucide.createIcons();
}

function renderCalendar() {
    showScreen('calendarScreen');
    const container = document.querySelector('#calendarScreen .main-content') || document.getElementById('calendarScreen');

    // Clear previous or reuse if we want to keep state (here we rebuild for simplicity)
    const existing = container.querySelector('.calendar-container');
    if (existing) existing.remove(); // Force refresh to update dates

    // Find a proper place to inject. 
    // Ideally we should have a <main> in the HTML structure for calendar too.
    // Let's assume we append to the screen directly for now or clear it.

    // Cleanup simple placeholder approach:
    // We need to preserve the header.
    const header = container.querySelector('header');

    // Clear everything EXCEPT header
    Array.from(container.children).forEach(child => {
        if (child !== header) child.remove();
    });

    container.appendChild(Calendar());
    lucide.createIcons();
}

function renderProfile() {
    showScreen('profileScreen');
    const container = document.querySelector('#profileScreen') || document.getElementById('profileScreen');

    // Clear content (keep header if separate, but likely full re-render is safer here)
    const header = container.querySelector('header');
    Array.from(container.children).forEach(child => {
        if (child !== header) child.remove();
    });

    container.appendChild(Profile());
    lucide.createIcons();
}

function renderVachakProfile(id) {
    if (!id) return;
    const vachak = vachaks.find(v => v.id === id);
    if (!vachak) return;

    const container = document.getElementById('vachakMain');
    container.innerHTML = '';
    container.appendChild(VachakProfile(vachak));

    showScreen('vachakScreen');
    lucide.createIcons();
}


// ===== HELPERS =====

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
}

function setupGlobalListeners() {
    // Bottom Nav
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            window.location.hash = tab;
        });
    });

    // Subscribe to store changes to re-render parts of UI if needed
    store.subscribe((state) => {
        // Update "Saved" buttons across the app
        document.querySelectorAll('.save-btn').forEach(btn => {
            const id = btn.dataset.id;
            if (state.savedEvents.includes(id)) {
                btn.classList.add('saved');
                btn.innerHTML = '<i data-lucide="heart"></i>'; // Solid heart logic handled by CSS usually, but here we ensure
            } else {
                btn.classList.remove('saved');
                btn.innerHTML = '<i data-lucide="heart"></i>';
            }
        });

        lucide.createIcons();
    });

    // Wire Search Button Global
    const searchBtn = document.querySelector('#homeScreen .header-btn:last-child');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            document.body.appendChild(SearchModal());
            lucide.createIcons();
        });
    }
}
