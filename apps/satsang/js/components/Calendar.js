/**
 * Calendar Component
 */
import { store } from '../store.js';
import { Utils } from '../utils.js';
import { EventService } from '../services/events.js';

export function Calendar() {
    const container = document.createElement('div');
    container.className = 'calendar-container';

    // State for local navigation
    let { month: currentMonth, year: currentYear } = store.getState().calendar;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Render Function
    const render = () => {
        // Sync local vars if needed, but we used let above. 
        // Better: always read from let, and update store on change.

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        container.innerHTML = `
            <div class="calendar-header">
                <button id="prevMonth"><i data-lucide="chevron-left"></i></button>
                <h3>${monthNames[currentMonth]} ${currentYear}</h3>
                <button id="nextMonth"><i data-lucide="chevron-right"></i></button>
            </div>
            
            <div class="calendar-grid">
                <div class="day-label">S</div>
                <div class="day-label">M</div>
                <div class="day-label">T</div>
                <div class="day-label">W</div>
                <div class="day-label">T</div>
                <div class="day-label">F</div>
                <div class="day-label">S</div>
                ${generateDays(firstDay, lastDay)}
            </div>

            <div class="calendar-legend">
                <div class="legend-item"><span class="dot has-event"></span> Event</div>
                <div class="legend-item"><span class="dot today"></span> Today</div>
            </div>
            
            <div class="calendar-events-list">
                <!-- Events for selected day (future feature) -->
                <p style="text-align: center; color: var(--md-sys-color-outline); padding: 20px;">
                    Select a date to view full schedule
                </p>
            </div>
        `;

        // Bind Nav
        container.querySelector('#prevMonth').onclick = () => {
            if (currentMonth === 0) { currentMonth = 11; currentYear--; }
            else { currentMonth--; }
            store.updateCalendar(currentMonth, currentYear);
            render();
            lucide.createIcons();
        };
        container.querySelector('#nextMonth').onclick = () => {
            if (currentMonth === 11) { currentMonth = 0; currentYear++; }
            else { currentMonth++; }
            store.updateCalendar(currentMonth, currentYear);
            render();
            lucide.createIcons();
        };
    };

    const generateDays = (firstDay, lastDay) => {
        let html = '';
        const startingDay = firstDay.getDay(); // 0 is Sunday
        const totalDays = lastDay.getDate();

        // Empty cells
        for (let i = 0; i < startingDay; i++) {
            html += `<div class="day-cell empty"></div>`;
        }

        // Days
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = date.toDateString() === new Date().toDateString();

            // Check for events
            const events = EventService.getEventsByDate(date);
            const hasEvent = events.length > 0;

            html += `
                <div class="day-cell ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}" onclick="alert('Event list for date: ${day}')">
                    <span>${day}</span>
                </div>
            `;
        }
        return html;
    };

    // Styles removed - moved to style.css

    render();
    return container;
}
