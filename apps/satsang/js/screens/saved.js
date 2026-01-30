/**
 * Satsang App v2 - Saved Screen Renderer
 */

import { store } from '../store.js';
import { formatDateRange, isEventLive } from '../utils.js';

/**
 * Render Saved Events Screen
 * @param {Object} state - App state
 */
export function renderSaved(state) {
    const container = document.getElementById('savedEventsList');
    if (!container) return;

    const events = store.getSavedEvents();

    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="heart" class="empty-state__icon"></i>
                <h3 class="empty-state__title">No Saved Events</h3>
                <p class="empty-state__message">Events you save will appear here for quick access.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => {
        const vachak = store.getVachak(event.vachakId);
        const isLive = isEventLive(event);
        const dateDisplay = isLive ? 'Live Now' : formatDateRange(event.dates.start, event.dates.end);

        const avatar = vachak?.image
            ? `<img src="${vachak.image}" alt="${vachak.shortName}" loading="lazy">`
            : `<span style="font-size: 1.5rem;">${vachak?.emoji || '🙏'}</span>`;

        return `
            <div class="card card--interactive event-card" data-event-id="${event.id}" style="margin-bottom: var(--space-3);">
                <div class="event-card__content">
                    <span class="chip ${isLive ? 'chip--live' : ''} event-card__status">
                        ${dateDisplay}
                    </span>
                    <h3 class="event-card__title">${event.title}</h3>
                    <p class="event-card__subtitle">
                        ${vachak?.shortName || 'Unknown'} • ${event.location.cityName}
                    </p>
                </div>
                <div class="event-card__avatar avatar avatar--lg">
                    ${avatar}
                </div>
            </div>
        `;
    }).join('');
}
