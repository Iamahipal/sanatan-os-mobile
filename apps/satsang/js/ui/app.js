import { store } from '../core/store.js';
import { Router } from '../core/router.js';
import { vachaks, events, categories } from '../data/mock_data.js';

/**
 * UI Renderer
 */
const App = {
    init() {
        console.log('Satsang App Initializing... 🕉️');

        // 1. Initialize Store
        store.init({
            vachaks,
            events,
            categories
        });

        // 2. Subscribe to State Changes
        store.subscribe(this.render.bind(this));

        // 3. Initial Render
        this.render(store.getState());

        // 4. Setup Router
        new Router({
            'home': () => this.showSection('home'),
            'calendar': () => this.showSection('calendar'),
            'saved': () => this.showSection('saved'),
            'profile': () => this.showSection('profile')
        });

        // 5. Global Event Listeners
        this.attachListeners();
    },

    attachListeners() {
        // Filter Buttons (Delegation)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (btn) {
                const category = btn.dataset.id;
                store.setFilter(category);
            }
        });
    },

    showSection(sectionId) {
        // Simple View Switching (Enhance later)
        console.log('Navigating to:', sectionId);
        // For now, we only have one main view 'home' active in this shell
        // Future: Toggle visibility of #mainContainer views
    },

    render(state) {
        this.renderCategories(state.categories, state.filter);
        this.renderEvents(state.events, state.vachaks, state.filter);

        // Refresh Icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    renderCategories(categories, activeFilter) {
        const rail = document.getElementById('categoryRail');

        const html = categories.map(cat => `
            <button class="rail-item filter-btn ${cat.id === activeFilter ? 'active' : ''}" 
                    data-id="${cat.id}"
                    style="
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                        gap: 8px;
                        background: none;
                        border: none;
                        opacity: ${cat.id === activeFilter ? '1' : '0.6'};
                    ">
                <div style="
                    width: 60px; 
                    height: 60px; 
                    background: ${cat.id === activeFilter ? 'var(--color-primary-container)' : '#F0F2F5'}; 
                    border-radius: 24px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: ${cat.id === activeFilter ? 'var(--color-primary)' : '#5F5F5F'};
                    transition: all 0.2s;
                ">
                    <i data-lucide="${cat.icon}"></i>
                </div>
                <span style="font-size: 0.75rem; font-weight: 500;">${cat.label}</span>
            </button>
        `).join('');

        rail.innerHTML = html;
    },

    renderEvents(events, vachaks, filter) {
        const list = document.getElementById('eventList');

        // Filter Logic
        let filteredEvents = events;
        if (filter !== 'all') {
            // Basic filter simulation (Map categories to event types if needed)
            // For now, just show all or shuffle to demonstrate change
        }

        const html = filteredEvents.map(evt => {
            const vachak = vachaks.find(v => v.id === evt.vachakId);
            return `
            <div class="card event-card" style="margin-bottom: 16px; padding: 16px; display: flex; gap: 16px;">
                <div style="flex: 1;">
                    <span class="location-chip" style="margin-bottom: 8px; display: inline-flex;">
                        ${evt.type === 'live' ? '<span style="width:6px; height:6px; background:red; border-radius:50%; margin-right:4px;"></span> Live' : evt.date}
                    </span>
                    <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 4px;">${evt.title}</h3>
                    <p style="font-size: 0.9rem; color: var(--color-text-secondary);">${vachak ? vachak.shortName : ''} • ${evt.location}</p>
                </div>
                ${vachak ? `<img src="${vachak.image}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary-container);">` : ''}
            </div>
            `;
        }).join('');

        list.innerHTML = html;
    }
};

// Auto Start
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
