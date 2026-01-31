/**
 * Satsang App - Calendar Export Utility
 * Export events to ICS format for Google/Apple Calendar
 */

/**
 * Format date to ICS format (YYYYMMDDTHHMMSSZ)
 * @param {Date|string} date 
 * @returns {string}
 */
function formatICSDate(date) {
    const d = new Date(date);
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Generate ICS file content for an event
 * @param {Object} event - Event object
 * @param {Object} vachak - Vachak object (optional)
 * @returns {string} ICS file content
 */
export function generateICS(event, vachak = null) {
    const uid = `${event.id}@satsang.app`;
    const now = formatICSDate(new Date());
    const start = formatICSDate(event.dates.start);
    const end = formatICSDate(event.dates.end);

    const description = [
        event.description || '',
        vachak ? `Vachak: ${vachak.name}` : '',
        event.features?.length ? `Features: ${event.features.map(f => f.label).join(', ')}` : '',
        event.organizer?.phone ? `Contact: ${event.organizer.phone}` : ''
    ].filter(Boolean).join('\\n');

    const location = event.location?.address || event.location?.cityName || '';

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Satsang App//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}

/**
 * Download ICS file
 * @param {Object} event - Event object
 * @param {Object} vachak - Vachak object (optional) 
 */
export function downloadICS(event, vachak = null) {
    const icsContent = generateICS(event, vachak);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Open Google Calendar with event pre-filled
 * @param {Object} event - Event object
 */
export function openGoogleCalendar(event) {
    const start = new Date(event.dates.start).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = new Date(event.dates.end).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const location = encodeURIComponent(event.location?.address || event.location?.cityName || '');
    const details = encodeURIComponent(event.description || '');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;

    window.open(url, '_blank');
}

/**
 * Open Apple Calendar (uses ICS download on iOS/macOS)
 * @param {Object} event - Event object
 * @param {Object} vachak - Vachak object (optional)
 */
export function openAppleCalendar(event, vachak = null) {
    // On Apple devices, downloading ICS automatically opens Calendar app
    downloadICS(event, vachak);
}

/**
 * Show calendar export options modal
 * @param {Object} event - Event object
 * @param {Object} vachak - Vachak object (optional)
 */
export function showCalendarExportModal(event, vachak = null) {
    const existingModal = document.getElementById('calendarExportModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'calendarExportModal';
    modal.className = 'modal modal--bottom active';
    modal.innerHTML = `
        <div class="modal__backdrop"></div>
        <div class="modal__content">
            <div class="modal__header">
                <h3 class="modal__title">Add to Calendar</h3>
                <button class="modal__close" aria-label="Close">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="modal__body">
                <div class="calendar-export-options">
                    <button class="calendar-export-btn" id="exportGoogleCal">
                        <i data-lucide="calendar"></i>
                        <span>Google Calendar</span>
                    </button>
                    <button class="calendar-export-btn" id="exportAppleCal">
                        <i data-lucide="smartphone"></i>
                        <span>Apple Calendar</span>
                    </button>
                    <button class="calendar-export-btn" id="exportDownloadICS">
                        <i data-lucide="download"></i>
                        <span>Download .ics File</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Event handlers
    modal.querySelector('.modal__backdrop').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal__close').addEventListener('click', () => modal.remove());

    modal.querySelector('#exportGoogleCal').addEventListener('click', () => {
        openGoogleCalendar(event);
        modal.remove();
    });

    modal.querySelector('#exportAppleCal').addEventListener('click', () => {
        openAppleCalendar(event, vachak);
        modal.remove();
    });

    modal.querySelector('#exportDownloadICS').addEventListener('click', () => {
        downloadICS(event, vachak);
        modal.remove();
    });
}
