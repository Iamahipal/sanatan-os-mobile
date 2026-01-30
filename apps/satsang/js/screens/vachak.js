/**
 * Satsang App v2 - Vachak Profile Screen Renderer
 */

import { store } from '../store.js';
import { formatNumber, formatDateRange, isEventLive } from '../utils.js';

/**
 * Render Vachak Profile Screen
 * @param {string} vachakId - Vachak ID
 */
export function renderVachak(vachakId) {
    const container = document.getElementById('vachakProfileContainer');
    if (!container) return;

    const vachak = store.getVachak(vachakId);
    if (!vachak) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="user-x" class="empty-state__icon"></i>
                <h3 class="empty-state__title">Profile Not Found</h3>
                <p class="empty-state__message">This sant profile is not available.</p>
                <button class="btn btn--primary" data-back>Go Back</button>
            </div>
        `;
        return;
    }

    const events = store.getEventsByVachak(vachakId);

    // Avatar
    const avatar = vachak.image
        ? `<img src="${vachak.image}" alt="${vachak.shortName}">`
        : `<span>${vachak.emoji || '🙏'}</span>`;

    container.innerHTML = `
        <div class="vachak-profile">
            <!-- Header with back button -->
            <header class="header" style="background: transparent; position: absolute; z-index: 10;">
                <div class="header__left">
                    <button class="btn-icon" data-back aria-label="Go back" style="background: rgba(255,255,255,0.9);">
                        <i data-lucide="arrow-left"></i>
                    </button>
                </div>
                <div class="header__right">
                    <button class="btn-icon" aria-label="Share" style="background: rgba(255,255,255,0.9);">
                        <i data-lucide="share-2"></i>
                    </button>
                </div>
            </header>
            
            <!-- Profile Hero -->
            <div class="profile-hero">
                <div class="avatar avatar--xl profile-hero__avatar">
                    ${avatar}
                </div>
                <h1 class="profile-hero__name">${vachak.shortName}</h1>
                <p class="profile-hero__specialty">${vachak.specialty}</p>
                
                <!-- Stats -->
                <div class="stats-row">
                    <div class="stat">
                        <span class="stat__value">${formatNumber(vachak.followers || 0)}</span>
                        <span class="stat__label">Followers</span>
                    </div>
                    <div class="stat">
                        <span class="stat__value">${formatNumber(vachak.eventsCount || events.length)}</span>
                        <span class="stat__label">Events</span>
                    </div>
                </div>
            </div>
            
            <!-- Body -->
            <div class="profile-body">
                <!-- Bio -->
                ${vachak.bio || vachak.fullBio ? `
                    <div class="bio-section">
                        <h3 class="bio-section__title">About</h3>
                        <p class="bio-section__text">${vachak.fullBio || vachak.bio}</p>
                        ${vachak.lineage ? `
                            <p class="bio-section__text" style="margin-top: var(--space-3); font-weight: 500;">
                                <i data-lucide="git-branch" style="width: 16px; height: 16px; display: inline; vertical-align: middle;"></i>
                                ${vachak.lineage}
                            </p>
                        ` : ''}
                    </div>
                ` : ''}
                
                <!-- Socials -->
                ${vachak.socials ? `
                    <div class="bio-section">
                        <h3 class="bio-section__title">Connect</h3>
                        <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                            ${vachak.socials.youtube ? `
                                <a href="${vachak.socials.youtube}" target="_blank" rel="noopener" class="btn btn--outline" style="height: 40px; padding: 0 16px;">
                                    <i data-lucide="youtube" style="width: 18px; height: 18px; color: #FF0000;"></i>
                                    YouTube
                                </a>
                            ` : ''}
                            ${vachak.socials.instagram ? `
                                <a href="${vachak.socials.instagram}" target="_blank" rel="noopener" class="btn btn--outline" style="height: 40px; padding: 0 16px;">
                                    <i data-lucide="instagram" style="width: 18px; height: 18px; color: #E4405F;"></i>
                                    Instagram
                                </a>
                            ` : ''}
                            ${vachak.socials.website ? `
                                <a href="${vachak.socials.website}" target="_blank" rel="noopener" class="btn btn--outline" style="height: 40px; padding: 0 16px;">
                                    <i data-lucide="globe" style="width: 18px; height: 18px;"></i>
                                    Website
                                </a>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Upcoming Events -->
                ${events.length > 0 ? `
                    <div class="section" style="padding: 0; margin-top: var(--space-4);">
                        <div class="section__header" style="padding: 0;">
                            <h2 class="section__title">Upcoming Events</h2>
                        </div>
                        <div style="margin-top: var(--space-3);">
                            ${events.map(event => {
        const isLive = isEventLive(event);
        const dateDisplay = isLive ? 'Live Now' : formatDateRange(event.dates.start, event.dates.end);
        return `
                                    <div class="card card--interactive event-card" data-event-id="${event.id}" style="margin-bottom: var(--space-3);">
                                        <div class="event-card__content">
                                            <span class="chip ${isLive ? 'chip--live' : ''} event-card__status">
                                                ${dateDisplay}
                                            </span>
                                            <h3 class="event-card__title">${event.title}</h3>
                                            <p class="event-card__subtitle">${event.location.cityName}</p>
                                        </div>
                                    </div>
                                `;
    }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}
