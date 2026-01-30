/**
 * Satsang App v2 - Calendar Screen Renderer
 */

import { store } from '../store.js';
import { formatDateRange, isEventLive, getCountdownText } from '../utils.js';

// Calendar state
let currentDate = new Date();
let selectedDate = new Date();

/**
 * Render Calendar Screen
 * @param {Object} state - App state
 */
export function renderCalendar(state) {
    renderMonthNav();
    renderCalendarGrid();
    renderEventSections();
}

/**
 * Render Month Navigation
 */
function renderMonthNav() {
    const label = document.getElementById('currentMonthLabel');
    if (!label) return;

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    label.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

/**
 * Get events count for a specific date
 */
function getEventCountForDate(date, events) {
    return events.filter(event => {
        const start = new Date(event.dates.start);
        const end = new Date(event.dates.end);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
    }).length;
}

/**
 * Render Calendar Grid
 */
function renderCalendarGrid() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get all events
    const events = store.getFilteredEvents();

    // Day names header
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    let html = `
        <div class="calendar-grid__header">
            ${dayNames.map(d => `<span class="calendar-grid__day-name">${d}</span>`).join('')}
        </div>
        <div class="calendar-grid__days">
    `;

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-grid__day calendar-grid__day--empty"></div>`;
    }

    // Days of month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const thisDate = new Date(year, month, day);
        thisDate.setHours(0, 0, 0, 0);

        const isToday = thisDate.getTime() === today.getTime();
        const isPast = thisDate < today;
        const isSelected = selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;
        const eventCount = getEventCountForDate(thisDate, events);
        const hasEvent = eventCount > 0;

        const classes = [
            'calendar-grid__day',
            isToday ? 'calendar-grid__day--today' : '',
            isPast ? 'calendar-grid__day--past' : '',
            isSelected ? 'calendar-grid__day--selected' : '',
            hasEvent ? 'calendar-grid__day--has-event' : ''
        ].filter(Boolean).join(' ');

        html += `
            <button class="${classes}" data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">
                ${day}
                ${hasEvent ? `<span class="calendar-grid__dot">${eventCount > 1 ? eventCount : ''}</span>` : ''}
            </button>
        `;
    }

    html += `</div>`;
    grid.innerHTML = html;
}

/**
 * Render Event Sections - This Week & Upcoming
 */
function renderEventSections() {
    const container = document.getElementById('calendarEventsList');
    const label = document.getElementById('selectedDateLabel');
    if (!container || !label) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate end of this week (Sunday)
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    // Get all events
    const allEvents = store.getFilteredEvents();

    // This week's events (ongoing or starting this week)
    const thisWeekEvents = allEvents.filter(event => {
        const start = new Date(event.dates.start);
        const end = new Date(event.dates.end);
        return end >= today && start <= endOfWeek;
    });

    // Upcoming events (starting after this week)
    const upcomingEvents = allEvents.filter(event => {
        const start = new Date(event.dates.start);
        return start > endOfWeek;
    }).slice(0, 5); // Limit to 5

    label.textContent = "Events";

    let html = '';

    // This Week Section
    if (thisWeekEvents.length > 0) {
        html += `
            <div class="calendar-section">
                <h4 class="calendar-section__title">This Week</h4>
                ${thisWeekEvents.map(event => renderCalendarEventCard(event)).join('')}
            </div>
        `;
    }

    // Upcoming Section
    if (upcomingEvents.length > 0) {
        html += `
            <div class="calendar-section">
                <h4 class="calendar-section__title">Upcoming</h4>
                ${upcomingEvents.map(event => renderCalendarEventCard(event)).join('')}
            </div>
        `;
    }

    // Empty state
    if (thisWeekEvents.length === 0 && upcomingEvents.length === 0) {
        html = `
            <div class="empty-state empty-state--compact">
                <i data-lucide="calendar-x" class="empty-state__icon"></i>
                <h3 class="empty-state__title">No Upcoming Events</h3>
                <p class="empty-state__message">Check back soon for new satsangs!</p>
            </div>
        `;
    }

    container.innerHTML = html;
}

/**
 * Render a calendar event card
 */
function renderCalendarEventCard(event) {
    const vachak = store.getVachak(event.vachakId);
    const countdown = getCountdownText(event);
    const startDate = new Date(event.dates.start);
    const dateStr = startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    return `
        <div class="card card--interactive calendar-event-card" data-event-id="${event.id}">
            <div class="calendar-event-card__date">${dateStr}</div>
            <div class="calendar-event-card__content">
                <h4 class="calendar-event-card__title">${event.title}</h4>
                <p class="calendar-event-card__meta">
                    ${vachak?.shortName || 'Unknown'} • ${event.location.cityName}
                </p>
            </div>
            <span class="chip chip--sm ${countdown.isLive ? 'chip--live' : ''}">${countdown.text}</span>
        </div>
    `;
}

/**
 * Navigate to previous month
 */
export function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar({});
}

/**
 * Navigate to next month
 */
export function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar({});
}

/**
 * Select a date
 * @param {string} dateStr - Date string YYYY-MM-DD
 */
export function selectDate(dateStr) {
    selectedDate = new Date(dateStr);
    renderCalendarGrid();
    // Don't change section view on date select - keep This Week/Upcoming
}

