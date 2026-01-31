/**
 * Satsang App v2 - Home Screen Renderer
 */

import { store } from '../store.js';
import { formatDateRange, isEventLive, getCountdownText, getCategoryInfo } from '../utils.js';

/**
 * Render the Home Screen
 * @param {Object} state - App state
 */
export function renderHome(state) {
    renderHero();
    renderVachakRail(state);
    renderCategories(state);
    renderEvents(state);
}

/**
 * Render Hero/Featured Event Card
 */
function renderHero() {
    const container = document.getElementById('heroContainer');
    if (!container) return;

    const event = store.getFeaturedEvent();
    if (!event) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="calendar-off" class="empty-state__icon"></i>
                <h3 class="empty-state__title">No Events</h3>
                <p class="empty-state__message">Check back soon for upcoming satsangs.</p>
            </div>
        `;
        return;
    }

    const vachak = store.getVachak(event.vachakId);
    const isLive = isEventLive(event);
    const dateDisplay = isLive ? 'Live Now' : formatDateRange(event.dates.start, event.dates.end);

    // Use vachak image or placeholder gradient
    const backgroundStyle = vachak?.image
        ? `background-image: url('${vachak.image}'); background-size: cover; background-position: center;`
        : `background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);`;

    container.innerHTML = `
        <div class="hero-card card--interactive" data-event-id="${event.id}" style="${backgroundStyle}">
            <div class="hero-card__gradient"></div>
            <div class="hero-card__content">
                <span class="chip ${isLive ? 'chip--live' : 'chip--category'}">${event.typeName || getCategoryInfo(event.type).labelHi}</span>
                <h2 class="hero-card__title">${event.title}</h2>
                <div class="hero-card__meta">
                    <i data-lucide="calendar"></i>
                    <span>${dateDisplay}</span>
                    <span>•</span>
                    <i data-lucide="map-pin"></i>
                    <span>${event.location.cityName}</span>
                </div>
                <button class="hero-card__cta btn ${isLive ? 'btn--live-hero' : 'btn--hero'}">
                    ${isLive ? '🔴 Watch Live' : 'View Event →'}
                </button>
            </div>
        </div>
    `;
}

/**
 * Render Category Pills
 */
function renderCategories(state) {
    const container = document.getElementById('categoryRail');
    if (!container) return;

    // Define available categories
    const categories = [
        { id: 'all', icon: 'infinity', label: 'All', labelHi: 'सभी' },
        { id: 'bhagwat', icon: 'book-open', label: 'Bhagwat', labelHi: 'भागवत' },
        { id: 'ramkatha', icon: 'feather', label: 'Ram Katha', labelHi: 'राम कथा' },
        { id: 'kirtan', icon: 'music', label: 'Kirtan', labelHi: 'कीर्तन' },
        { id: 'darbar', icon: 'sparkles', label: 'Darbar', labelHi: 'दरबार' }
    ];

    const activeCategory = state.selectedCategory;

    container.innerHTML = categories.map(cat => `
        <button class="rail__item category-pill ${cat.id === activeCategory ? 'active' : ''}" 
                data-category="${cat.id}"
                aria-pressed="${cat.id === activeCategory}">
            <div class="category-pill__icon">
                <i data-lucide="${cat.icon}"></i>
            </div>
            <span class="category-pill__label">${cat.labelHi}</span>
        </button>
    `).join('');
}

/**
 * Render Vachak Avatar Rail
 */
function renderVachakRail(state) {
    const container = document.getElementById('vachakRail');
    if (!container) return;

    const allVachaks = state.vachaks;
    const displayVachaks = allVachaks.slice(0, 10); // Show first 10 vachaks
    const hasMore = allVachaks.length > 10;

    let html = displayVachaks.map(vachak => {
        const avatarContent = vachak.image
            ? `<img src="${vachak.image}" alt="${vachak.shortName}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
            + `<span class="vachak-avatar__emoji" style="display:none;">${vachak.emoji || '🙏'}</span>`
            : `<span class="vachak-avatar__emoji">${vachak.emoji || '🙏'}</span>`;

        return `
            <div class="rail__item vachak-avatar-item" data-vachak-id="${vachak.id}">
                <div class="vachak-avatar ${vachak.verified ? 'vachak-avatar--verified' : ''}">
                    ${avatarContent}
                </div>
                <span class="vachak-avatar__name">${vachak.shortName.split(' ')[0]}</span>
            </div>
        `;
    }).join('');

    // Add "See All" item if there are more vachaks
    if (hasMore) {
        html += `
            <div class="rail__item vachak-avatar-item vachak-see-all" id="seeAllVachaksBtn">
                <div class="vachak-avatar vachak-avatar--see-all">
                    <span class="vachak-avatar__count">+${allVachaks.length - 10}</span>
                </div>
                <span class="vachak-avatar__name">See All</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

/**
 * Render Events List
 */
function renderEvents(state) {
    const container = document.getElementById('eventsList');
    if (!container) return;

    const events = store.getFilteredEvents();

    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="search-x" class="empty-state__icon"></i>
                <h3 class="empty-state__title">No Events Found</h3>
                <p class="empty-state__message">
                    We couldn't find any events matching your filters. Try adjusting your location or category.
                </p>
                <button class="btn btn--outline empty-state__cta" data-category="all">
                    <i data-lucide="refresh-cw"></i>
                    Show All Events
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => renderEventCard(event)).join('');
}

/**
 * Render a single Event Card - Compact version with dates
 * @param {Object} event - Event object
 * @returns {string} HTML string
 */
function renderEventCard(event) {
    const vachak = store.getVachak(event.vachakId);
    const countdown = getCountdownText(event);

    // Status chip class
    const statusClass = countdown.isLive ? 'chip--live' : (countdown.isUrgent ? 'chip--urgent' : '');

    // Format date for display
    const startDate = new Date(event.dates.start);
    const endDate = new Date(event.dates.end);
    const dateOptions = { day: 'numeric', month: 'short' };
    const startStr = startDate.toLocaleDateString('en-IN', dateOptions);
    const endStr = endDate.toLocaleDateString('en-IN', dateOptions);
    const dateRange = startDate.getTime() === endDate.getTime()
        ? startStr
        : `${startStr.split(' ')[0]} - ${endStr}`;

    return `
        <div class="card card--interactive event-card event-card--compact" data-event-id="${event.id}" data-type="${event.type}">
            <div class="event-card__date-block">
                <span class="event-card__date-range">${dateRange}</span>
            </div>
            <div class="event-card__info">
                <h3 class="event-card__title">${event.title}</h3>
                <p class="event-card__meta">
                    <span class="event-card__vachak-name">${vachak?.shortName || 'Unknown'}</span>
                    <span class="event-card__separator">•</span>
                    <span class="event-card__city">${event.location.cityName}</span>
                </p>
            </div>
            <div class="event-card__badges">
                <span class="chip chip--sm ${statusClass}">${countdown.text}</span>
            </div>
        </div>
    `;
}
