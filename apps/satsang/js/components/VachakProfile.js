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
        <header class="app-header transparent">
            <button class="header-btn" onclick="window.history.back()">
                <i data-lucide="chevron-left"></i>
            </button>
            <div class="header-actions">
                <button class="header-btn"><i data-lucide="share-2"></i></button>
            </div>
        </header>

        <div class="vachak-hero">
            <div class="vachak-avatar-lg">
                ${vachak.image
            ? `<img src="${vachak.image}" class="vachak-image-lg" alt="${vachak.name}">`
            : vachak.emoji
        }
            </div>
            <h1>${vachak.name}</h1>
            <p class="specialty">${vachak.specialty}</p>
            <div class="vachak-stats">
                <div class="stat">
                    <span class="num">${vachak.followers > 1000 ? (vachak.followers / 1000) + 'k' : vachak.followers}</span>
                    <span class="lbl">Followers</span>
                </div>
                <div class="stat">
                    <span class="num">${vachak.eventsCount}</span>
                    <span class="lbl">Events</span>
                </div>
            </div>
            <button class="btn-primary" id="followBtn">Follow</button>
        </div>

        <main class="profile-scroll">
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
