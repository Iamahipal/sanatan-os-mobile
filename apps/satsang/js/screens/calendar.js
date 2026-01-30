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
    renderEventsForDate(selectedDate);
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

    // Get events for this month
    const events = store.getFilteredEvents();
    const eventDates = new Set(
        events
            .filter(e => {
                const start = new Date(e.dates.start);
                return start.getMonth() === month && start.getFullYear() === year;
            })
            .map(e => new Date(e.dates.start).getDate())
    );

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
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
        const isSelected = selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;
        const hasEvent = eventDates.has(day);

        const classes = [
            'calendar-grid__day',
            isToday ? 'calendar-grid__day--today' : '',
            isSelected ? 'calendar-grid__day--selected' : '',
            hasEvent ? 'calendar-grid__day--has-event' : ''
        ].filter(Boolean).join(' ');

        html += `
            <button class="${classes}" data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">
                ${day}
                ${hasEvent ? '<span class="calendar-grid__dot"></span>' : ''}
            </button>
        `;
    }

    html += `</div>`;
    grid.innerHTML = html;
}

/**
 * Render Events for Selected Date
 * @param {Date} date - Selected date
 */
function renderEventsForDate(date) {
    const container = document.getElementById('calendarEventsList');
    const label = document.getElementById('selectedDateLabel');
    if (!container || !label) return;

    // Update label
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    label.textContent = isToday ? "Today's Events" : date.toLocaleDateString('en-IN', options);

    // Get events for this date
    const events = store.getFilteredEvents().filter(event => {
        const start = new Date(event.dates.start);
        const end = new Date(event.dates.end);
        return date >= start && date <= end;
    });

    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state empty-state--compact">
                <i data-lucide="calendar-x" class="empty-state__icon"></i>
                <h3 class="empty-state__title">No Events</h3>
                <p class="empty-state__message">No events scheduled for this date.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => {
        const vachak = store.getVachak(event.vachakId);
        const countdown = getCountdownText(event);

        return `
            <div class="card card--interactive calendar-event-card" data-event-id="${event.id}">
                <div class="calendar-event-card__content">
                    <span class="chip ${countdown.isLive ? 'chip--live' : ''} calendar-event-card__status">
                        ${countdown.text}
                    </span>
                    <h4 class="calendar-event-card__title">${event.title}</h4>
                    <p class="calendar-event-card__meta">
                        ${vachak?.shortName || 'Unknown'} • ${event.location.cityName}
                    </p>
                </div>
            </div>
        `;
    }).join('');
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
    renderEventsForDate(selectedDate);
}
