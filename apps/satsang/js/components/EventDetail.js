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
    // Vachak details for header
    const vachak = event.vachak;

    container.innerHTML = `
        <header class="app-header transparent">
            <button class="header-btn" onclick="window.history.back()">
                <i data-lucide="chevron-left"></i>
            </button>
            <div class="header-actions">
                <button class="header-btn"><i data-lucide="share-2"></i></button>
                <button class="header-btn save-btn ${isSaved ? 'text-primary' : ''}" data-id="${event.id}"><i data-lucide="heart"></i></button>
            </div>
        </header>

        <div class="event-hero">
            ${vachak && vachak.image
            ? `<img src="${vachak.image}" class="hero-image" alt="${vachak.name}">`
            : `<div class="hero-placeholder">${event.emoji || '🕉️'}</div>`
        }
            <div class="hero-overlay">
                <div class="hero-content">
                    <span class="chip ${event.type}">${event.typeName}</span>
                    <h1>${event.title}</h1>
                    <p class="hero-subtitle">by ${vachak ? vachak.name : 'Unknown'}</p>
                </div>
            </div>
        </div>

        <div class="event-body">
            <div class="info-grid">
                <div class="info-item">
                    <i data-lucide="calendar"></i>
                    <div>
                        <label>Dates</label>
                        <p>${formatDate(dateStart)} - ${formatDate(dateEnd)}</p>
                    </div>
                </div>
                <div class="info-item">
                     <i data-lucide="clock"></i>
                    <div>
                        <label>Time</label>
                        <p>${event.dates.timing}</p>
                    </div>
                </div>
                <div class="info-item full-width">
                     <i data-lucide="map-pin"></i>
                    <div>
                        <label>Venue</label>
                        <p style="font-weight: 500;">${event.location.venue}</p>
                        <p class="sub-text">${event.location.cityName}</p>
                    </div>
                </div>
            </div>

            <!-- Social Verification -->
            ${event.sourceLink ? `
            <div class="social-verification-card">
                <div class="svc-header">
                    <i data-lucide="instagram" style="color: #E1306C;"></i>
                    <span>Verified via Instagram</span>
                </div>
                <div class="svc-preview">
                    <p>Source: Official Channel Post</p>
                    <a href="${event.sourceLink}" target="_blank" class="btn-text">View Original Post <i data-lucide="external-link" style="width:14px;"></i></a>
                </div>
            </div>
            ` : ''}

            <div class="section">
                <h3>About Event</h3>
                <p class="description">${event.description}</p>
            </div>
            <div class="features-scroll">
                ${event.features.isLive ? '<span class="chip red"><i data-lucide="radio"></i> Live Now</span>' : ''}
                ${event.features.hasLiveStream ? '<span class="chip"><i data-lucide="video"></i> Live Stream</span>' : ''}
                ${event.features.hasPrasad ? '<span class="chip"><i data-lucide="utensils"></i> Prasad</span>' : ''}
                ${event.features.hasAccommodation ? '<span class="chip"><i data-lucide="home"></i> Stay</span>' : ''}
            </div>

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
