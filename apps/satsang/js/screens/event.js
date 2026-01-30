/**
 * Satsang App v2 - Event Detail Screen Renderer
 */

import { store } from '../store.js';
import { router } from '../router.js';
import { formatDateRange, isEventLive, getCategoryInfo } from '../utils.js';

/**
 * Render Event Detail Screen
 * @param {string} eventId - Event ID
 */
export function renderEvent(eventId) {
    const container = document.getElementById('eventDetailContainer');
    if (!container) return;

    const event = store.getEvent(eventId);
    if (!event) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="alert-circle" class="empty-state__icon"></i>
                <h3 class="empty-state__title">Event Not Found</h3>
                <p class="empty-state__message">This event may have been removed.</p>
                <button class="btn btn--primary" data-back>Go Back</button>
            </div>
        `;
        return;
    }

    const vachak = store.getVachak(event.vachakId);
    const isLive = isEventLive(event);
    const isSaved = store.isEventSaved(eventId);
    const dateDisplay = isLive ? 'Live Now' : formatDateRange(event.dates.start, event.dates.end);

    // Hero background
    const heroStyle = vachak?.image
        ? `background-image: url('${vachak.image}'); background-size: cover; background-position: center top;`
        : `background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);`;

    // Feature tags
    const features = [];
    if (event.features?.isFree) features.push({ icon: 'badge-check', label: 'Free Entry' });
    if (event.features?.hasLiveStream) features.push({ icon: 'video', label: 'Livestream' });
    if (event.features?.hasPrasad) features.push({ icon: 'utensils', label: 'Prasad' });
    if (event.features?.hasAccommodation) features.push({ icon: 'bed', label: 'Stay' });

    container.innerHTML = `
        <div class="event-detail">
            <!-- Hero -->
            <div class="event-hero" style="${heroStyle}">
                <div class="event-hero__overlay"></div>
                <div class="event-hero__header">
                    <button class="btn-icon" data-back aria-label="Go back">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <button class="btn-icon" aria-label="Share">
                        <i data-lucide="share-2"></i>
                    </button>
                </div>
                <div class="event-hero__info">
                    <span class="chip ${isLive ? 'chip--live' : 'chip--category'} event-hero__type">
                        ${event.typeName || getCategoryInfo(event.type).labelHi}
                    </span>
                    <h1 class="event-hero__title">${event.title}</h1>
                </div>
            </div>
            
            <!-- Body -->
            <div class="event-body">
                <!-- Info List -->
                <div class="info-list">
                    <div class="info-item">
                        <div class="info-item__icon">
                            <i data-lucide="calendar"></i>
                        </div>
                        <div class="info-item__content">
                            <span class="info-item__label">Date</span>
                            <span class="info-item__value">${dateDisplay}</span>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-item__icon">
                            <i data-lucide="clock"></i>
                        </div>
                        <div class="info-item__content">
                            <span class="info-item__label">Time</span>
                            <span class="info-item__value">${event.dates.timing || 'To be announced'}</span>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-item__icon">
                            <i data-lucide="map-pin"></i>
                        </div>
                        <div class="info-item__content">
                            <span class="info-item__label">Venue</span>
                            <span class="info-item__value">${event.location.venue}<br>${event.location.cityName}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Features -->
                ${features.length > 0 ? `
                    <div class="feature-tags">
                        ${features.map(f => `
                            <span class="chip">
                                <i data-lucide="${f.icon}" style="width:14px; height:14px;"></i>
                                ${f.label}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Description -->
                ${event.description ? `
                    <div class="bio-section">
                        <h3 class="bio-section__title">About</h3>
                        <p class="bio-section__text">${event.description}</p>
                    </div>
                ` : ''}
                
                <!-- Organizer -->
                ${event.organizer?.name ? `
                    <div class="organizer-card">
                        <div class="avatar avatar--md" style="background: var(--color-primary-container); color: var(--color-primary);">
                            <i data-lucide="building"></i>
                        </div>
                        <div class="organizer-card__info">
                            <span class="organizer-card__name">${event.organizer.name}</span>
                            <span class="organizer-card__role">Organizer</span>
                        </div>
                        ${event.organizer.contact ? `
                            <a href="mailto:${event.organizer.contact}" class="btn btn--outline" style="padding: 0 16px; height: 40px; font-size: 0.875rem;">
                                Contact
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
            
            <!-- Action Bar -->
            <div class="action-bar">
                <button class="btn btn--outline ${isSaved ? 'active' : ''}" data-save-event="${eventId}">
                    <i data-lucide="${isSaved ? 'heart' : 'heart'}"></i>
                    ${isSaved ? 'Saved' : 'Save'}
                </button>
                <button class="btn btn--primary ${isLive ? 'btn--live' : ''}">
                    <i data-lucide="${isLive ? 'video' : 'ticket'}"></i>
                    ${isLive ? 'Watch Live 🔴' : 'Register Now'}
                </button>
            </div>
        </div>
    `;
}
