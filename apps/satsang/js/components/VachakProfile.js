/**
 * Vachak Profile Component
 */
import { store } from '../store.js';
import { EventService } from '../services/events.js';
import { EventCard } from './EventCard.js';

export function VachakProfile(vachak) {
    const vachakEvents = EventService.getEventsByVachak(vachak.id);

    const container = document.createElement('div');
    container.className = 'vachak-profile-container';

    container.innerHTML = `
        <header class="app-header" id="profileHeader">
            <button class="header-btn" onclick="window.history.back()">
                <i data-lucide="chevron-left"></i>
            </button>
            <div class="header-title-center">${vachak.shortName}</div>
            <button class="header-btn">
                <i data-lucide="more-vertical"></i>
            </button>
        </header>

        <main class="profile-scroll">
            <div class="profile-hero">
                <div class="profile-avatar-lg">
                    <span>${vachak.emoji}</span>
                </div>
                <h1 class="profile-name">
                    ${vachak.name}
                    ${vachak.verified ? '<i data-lucide="badge-check" class="verified-badge"></i>' : ''}
                </h1>
                <p class="profile-specialty">${vachak.specialty}</p>
                
                <div class="profile-stats-row">
                    <div class="stat-box">
                        <span class="stat-num">${vachak.followers > 1000 ? (vachak.followers / 1000) + 'k' : vachak.followers}</span>
                        <span class="stat-lbl">Followers</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${vachak.eventsCount}</span>
                        <span class="stat-lbl">Events</span>
                    </div>
                </div>

                <div class="profile-actions">
                    <button class="btn-primary full">Follow</button>
                    <button class="btn-secondary icon-only"><i data-lucide="bell"></i></button>
                </div>

                <p class="profile-bio">${vachak.bio}</p>
            </div>

            <div class="profile-section">
                <h3>Upcoming Events</h3>
                <div id="vachak-events-list" class="events-list">
                    <!-- Events injected below -->
                </div>
            </div>
        </main>
    `;

    // Inject events
    const listContainer = container.querySelector('#vachak-events-list');
    if (vachakEvents.length === 0) {
        listContainer.innerHTML = '<div class="empty-state">No upcoming events scheduled.</div>';
    } else {
        vachakEvents.forEach(event => {
            listContainer.appendChild(EventCard(event));
        });
    }

    return container;
}
