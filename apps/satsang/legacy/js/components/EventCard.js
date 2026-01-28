/**
 * Event Card Component
 */
import { store } from '../store.js';

export function EventCard(event) {
    const isSaved = store.getState().savedEvents.includes(event.id);
    const date = new Date(event.dates.start);
    const month = date.toLocaleString('en', { month: 'short' });
    const day = date.getDate();

    // Create element
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-date-box">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
        </div>
        <div class="event-info">
            <span class="event-type">${event.typeName}</span>
            <h4>${event.title}</h4>
            <div class="vachak-name">${event.vachak ? event.vachak.name : 'Unknown Vachak'}</div>
            <div class="event-location">
                <i data-lucide="map-pin"></i>
                ${event.location.cityName}
            </div>
        </div>
        <button class="save-btn ${isSaved ? 'saved' : ''}" data-id="${event.id}">
            <i data-lucide="${isSaved ? 'heart' : 'heart'}"></i>
        </button>
    `;

    // Bind events
    // Bind events
    card.style.cursor = 'pointer'; // Ensure visual feedback

    card.onclick = (e) => {
        // Prevent if clicking on save button (handled separately, but good safety)
        if (e.target.closest('.save-btn')) return;

        console.log('Event Card Clicked:', event.id);
        window.location.hash = `event/${event.id}`;
    };

    const saveBtn = card.querySelector('.save-btn');
    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.toggleSaveEvent(event.id);
        // UI update happens via store listener, but for instant feedback:
        const newSavedState = store.getState().savedEvents.includes(event.id);
        saveBtn.classList.toggle('saved', newSavedState);
    });

    return card;
}
