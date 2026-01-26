/**
 * Event Service
 * Handles business logic for fetching and filtering events
 */

import { store } from '../store.js';

export const EventService = {

    getFilteredEvents() {
        const { events, filters } = store.getState();

        return events.filter(event => {
            // City Filter
            if (filters.city !== 'all' && event.location.city !== filters.city) {
                return false;
            }

            // Type Filter
            if (filters.type !== 'all' && event.type !== filters.type) {
                return false;
            }

            // Search Filter
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const match =
                    event.title.toLowerCase().includes(q) ||
                    event.typeName.toLowerCase().includes(q) ||
                    (event.location.cityName && event.location.cityName.toLowerCase().includes(q));
                if (!match) return false;
            }

            return true;
        }).sort((a, b) => new Date(a.dates.start) - new Date(b.dates.start));
    },

    getUpcomingEvents(limit = 4) {
        const events = this.getFilteredEvents();
        const now = new Date();
        return events
            .filter(e => new Date(e.dates.end) >= now)
            .slice(0, limit);
    },

    getNearbyEvents(limit = 2) {
        // Mock "Nearby" logic - returns random events for now
        // In real app, would use Geolocation API
        const events = this.getFilteredEvents();
        return events.slice(0, limit); // Just return top ones for now
    },

    getEventById(id) {
        return store.getState().events.find(e => e.id === id);
    },

    getEventsByVachak(vachakId) {
        return store.getState().events.filter(e => e.vachakId === vachakId);
    },

    getEventsByDate(date) {
        return store.getState().events.filter(e => {
            const start = new Date(e.dates.start);
            const end = new Date(e.dates.end);
            return date >= start && date <= end;
        });
    }
};
