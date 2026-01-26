/**
 * Event Detail Component
 */
import { store } from '../store.js';
import { Utils } from '../utils.js';

export function EventDetail(event) {
    const isSaved = store.getState().savedEvents.includes(event.id);
    const dateStart = new Date(event.dates.start);
    const dateEnd = new Date(event.dates.end);

    const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Container
    const container = document.createElement('div');
    container.className = 'event-detail-container';

    container.innerHTML = `
        <header class="app-header transparent" id="detailHeader">
            <button class="header-btn" onclick="window.history.back()">
                <i data-lucide="chevron-left"></i>
            </button>
            <div class="header-actions">
                <button class="header-btn">
                    <i data-lucide="share-2"></i>
                </button>
                <button class="header-btn ${isSaved ? 'text-primary' : ''}" id="detailSaveBtn">
                    <i data-lucide="${isSaved ? 'heart' : 'heart'}"></i>
                </button>
            </div>
        </header>

        <div class="event-hero">
            <div class="event-hero-gradient"></div>
            <div class="event-hero-content">
                <span class="event-hero-type">${event.typeName}</span>
                <h1 class="event-hero-title">${event.title}</h1>
                <div class="event-hero-vachak">
                    <span class="vachak-name">${event.vachak ? event.vachak.name : ''}</span>
                </div>
            </div>
        </div>

        <div class="event-content">
            <!-- Key Info Grid -->
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-icon"><i data-lucide="calendar"></i></div>
                    <div>
                        <label>Date</label>
                        <p>${formatDate(dateStart)} - ${formatDate(dateEnd)}</p>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon"><i data-lucide="clock"></i></div>
                    <div>
                        <label>Time</label>
                        <p>${event.dates.timing}</p>
                    </div>
                </div>
                <div class="info-item full-width">
                    <div class="info-icon"><i data-lucide="map-pin"></i></div>
                    <div>
                        <label>Location</label>
                        <p class="font-medium">${event.location.venue}</p>
                        <p class="text-sm text-muted">${event.location.cityName}</p>
                    </div>
                </div>
            </div>

            <!-- Features -->
            <div class="features-scroll">
                ${event.features.isLive ? '<span class="chip red"><i data-lucide="radio"></i> Live Now</span>' : ''}
                ${event.features.hasLiveStream ? '<span class="chip"><i data-lucide="video"></i> Live Stream</span>' : ''}
                ${event.features.hasPrasad ? '<span class="chip"><i data-lucide="utensils"></i> Prasad</span>' : ''}
                ${event.features.hasAccommodation ? '<span class="chip"><i data-lucide="home"></i> Stay</span>' : ''}
            </div>

            <!-- Description -->
            <section class="detail-section">
                <h3>About Event</h3>
                <p class="text-body">${event.description}</p>
            </section>

             <!-- Schedule -->
            ${event.schedule && event.schedule.length > 0 ? `
            <section class="detail-section">
                <h3>Schedule</h3>
                <div class="schedule-timeline">
                    ${event.schedule.map(day => `
                        <div class="timeline-item">
                            <div class="timeline-marker">${day.day}</div>
                            <div class="timeline-content">
                                <h4>${day.title}</h4>
                                <p>${day.time}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Organizer -->
            <section class="detail-section">
                <h3>Organizer</h3>
                <div class="organizer-card">
                    <div class="organizer-info">
                        <h4>${event.organizer.name}</h4>
                        <p>${event.organizer.contact}</p>
                    </div>
                    <button class="btn-outline sm">Contact</button>
                </div>
            </section>
        </div>

        <!-- Sticky Action Bar -->
        <div class="action-bar">
            <button class="btn-secondary flex-1">
                <i data-lucide="share"></i> Share
            </button>
            <button class="btn-primary flex-2">
                <i data-lucide="calendar-plus"></i> Add to Calendar
            </button>
        </div>
    `;

    // Logic
    const saveBtn = container.querySelector('#detailSaveBtn');
    saveBtn.onclick = () => {
        store.toggleSaveEvent(event.id);
        // Optimistic UI update
        const newState = !isSaved; // Current local scope var might be stale, but toggle works
        // Better: check store again or wait for signal. 
        // For simple vanilla:
        const updatedState = store.getState().savedEvents.includes(event.id);
        saveBtn.classList.toggle('text-primary', updatedState);
        saveBtn.innerHTML = `<i data-lucide="${updatedState ? 'heart' : 'heart'}"></i>`;
        lucide.createIcons();
    };

    // Share button
    const shareBtn = container.querySelector('.header-actions .header-btn:first-child');
    shareBtn.onclick = () => {
        Utils.share(
            event.title,
            `Join me at ${event.title} in ${event.location.cityName}`,
            window.location.href
        );
    };

    return container;
}
