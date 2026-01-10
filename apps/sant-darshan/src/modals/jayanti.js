/**
 * Sant Darshan App - Jayanti Modal
 * Saint anniversaries and special days
 */

import { escapeHtml } from '../utils/sanitize.js';
import { getAllSaints } from '../services/saints.js';
import { TRADITIONS } from '../data/traditions.js';
import { closeModal, navigate } from '../core/router.js';

/**
 * Jayanti Modal Renderer
 */
const JayantiModal = {
    container: null,
    cleanupFns: [],
    currentView: 'upcoming', // 'upcoming' | 'calendar' | 'month'
    selectedMonth: new Date().getMonth(),

    /**
     * Render the jayanti modal
     * @param {HTMLElement} container
     * @param {Object} data
     * @returns {Function} Cleanup function
     */
    render(container, data = {}) {
        this.container = container;
        this.cleanupFns = [];
        this.currentView = data.view || 'upcoming';

        this.buildModal();

        return () => this.cleanup();
    },

    /**
     * Build modal structure
     */
    buildModal() {
        const events = this.gatherEvents();
        const upcoming = this.getUpcomingEvents(events);

        this.container.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container modal-full-height">
                <div class="modal-header">
                    <div class="modal-title-group">
                        <h2 class="modal-title">Saint Jayantis</h2>
                        <p class="modal-title-hi" lang="hi">संत जयंती</p>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- View Tabs -->
                    <div class="view-tabs">
                        <button class="tab-btn ${this.currentView === 'upcoming' ? 'active' : ''}" data-view="upcoming">
                            <i class="fas fa-clock"></i> Upcoming
                        </button>
                        <button class="tab-btn ${this.currentView === 'calendar' ? 'active' : ''}" data-view="calendar">
                            <i class="fas fa-calendar"></i> Calendar
                        </button>
                    </div>

                    <div id="jayanti-content">
                        ${this.currentView === 'upcoming'
                            ? this.renderUpcoming(upcoming)
                            : this.renderCalendar(events)}
                    </div>
                </div>
            </div>
        `;

        // Setup close button
        const closeBtn = this.container.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal());
        }

        // Backdrop click
        const backdrop = this.container.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => closeModal());
        }

        // View tabs
        this.container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentView = btn.dataset.view;
                this.container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateContent(events);
            });
        });

        // Setup event listeners
        this.setupEventListeners();
    },

    /**
     * Gather all jayanti events from saints
     */
    gatherEvents() {
        const saints = getAllSaints();
        const events = [];

        saints.forEach(saint => {
            // Jayanti (birthday)
            if (saint.jayanti) {
                const parsed = this.parseDate(saint.jayanti);
                if (parsed) {
                    events.push({
                        type: 'jayanti',
                        title: `${saint.name} Jayanti`,
                        titleHi: saint.nameHi ? `${saint.nameHi} जयंती` : null,
                        ...parsed,
                        saintId: saint.id,
                        saintName: saint.name,
                        tradition: saint.tradition
                    });
                }
            }

            // Punyatithi (death anniversary)
            if (saint.punyatithi) {
                const parsed = this.parseDate(saint.punyatithi);
                if (parsed) {
                    events.push({
                        type: 'punyatithi',
                        title: `${saint.name} Punyatithi`,
                        titleHi: saint.nameHi ? `${saint.nameHi} पुण्यतिथि` : null,
                        ...parsed,
                        saintId: saint.id,
                        saintName: saint.name,
                        tradition: saint.tradition
                    });
                }
            }

            // Special days
            if (saint.specialDays && Array.isArray(saint.specialDays)) {
                saint.specialDays.forEach(day => {
                    const parsed = this.parseDate(day.date);
                    if (parsed) {
                        events.push({
                            type: 'special',
                            title: day.name,
                            description: day.description,
                            ...parsed,
                            saintId: saint.id,
                            saintName: saint.name,
                            tradition: saint.tradition
                        });
                    }
                });
            }
        });

        // Sort by month/day
        return events.sort((a, b) => {
            if (a.month !== b.month) return a.month - b.month;
            return a.day - b.day;
        });
    },

    /**
     * Parse date string to month/day
     * Supports formats like "15 January", "Magh Shukla 5"
     */
    parseDate(dateStr) {
        if (!dateStr) return null;

        const months = {
            january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
            july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
        };

        // Try "15 January" or "January 15" format
        const gregorianMatch = dateStr.match(/(\d{1,2})\s+(\w+)|(\w+)\s+(\d{1,2})/i);
        if (gregorianMatch) {
            const day = parseInt(gregorianMatch[1] || gregorianMatch[4], 10);
            const monthStr = (gregorianMatch[2] || gregorianMatch[3]).toLowerCase();
            const month = months[monthStr];

            if (month !== undefined && day >= 1 && day <= 31) {
                return {
                    month,
                    day,
                    isGregorian: true,
                    dateStr
                };
            }
        }

        // Hindu calendar - approximate mapping
        const hinduMonths = {
            'chaitra': 2, 'vaishakh': 3, 'jyeshtha': 4, 'ashadha': 5,
            'shravan': 6, 'bhadrapad': 7, 'ashwin': 8, 'kartik': 9,
            'margashirsha': 10, 'pausha': 11, 'magh': 0, 'phalgun': 1
        };

        for (const [name, month] of Object.entries(hinduMonths)) {
            if (dateStr.toLowerCase().includes(name)) {
                const dayMatch = dateStr.match(/(\d{1,2})/);
                const day = dayMatch ? parseInt(dayMatch[1], 10) : 15;
                return {
                    month,
                    day,
                    isGregorian: false,
                    dateStr,
                    note: 'Hindu calendar date (approximate)'
                };
            }
        }

        return null;
    },

    /**
     * Get upcoming events
     */
    getUpcomingEvents(events, count = 10) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        // Get events from today onwards, then wrap around to beginning of year
        const upcoming = [];

        // First, events from today to end of year
        events.forEach(event => {
            const daysFromNow = this.getDaysUntil(event.month, event.day);
            if (daysFromNow >= 0 && daysFromNow <= 365) {
                upcoming.push({ ...event, daysFromNow });
            }
        });

        // Sort by days from now
        upcoming.sort((a, b) => a.daysFromNow - b.daysFromNow);

        return upcoming.slice(0, count);
    },

    /**
     * Get days until a date
     */
    getDaysUntil(month, day) {
        const today = new Date();
        const thisYear = today.getFullYear();
        let targetDate = new Date(thisYear, month, day);

        if (targetDate < today) {
            targetDate = new Date(thisYear + 1, month, day);
        }

        const diffTime = targetDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    /**
     * Render upcoming events
     */
    renderUpcoming(events) {
        if (events.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No jayantis found</p>
                </div>
            `;
        }

        return `
            <div class="upcoming-events">
                ${events.map(event => this.renderEventCard(event)).join('')}
            </div>
        `;
    },

    /**
     * Render event card
     */
    renderEventCard(event) {
        const tradition = TRADITIONS[event.tradition];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const typeClass = event.type === 'jayanti' ? 'event-jayanti' :
                         event.type === 'punyatithi' ? 'event-punyatithi' : 'event-special';

        const typeIcon = event.type === 'jayanti' ? 'fa-birthday-cake' :
                        event.type === 'punyatithi' ? 'fa-pray' : 'fa-star';

        const daysText = event.daysFromNow === 0 ? 'Today' :
                        event.daysFromNow === 1 ? 'Tomorrow' :
                        `In ${event.daysFromNow} days`;

        return `
            <div class="event-card ${typeClass}" data-saint-id="${escapeHtml(event.saintId)}">
                <div class="event-date">
                    <span class="event-day">${event.day}</span>
                    <span class="event-month">${monthNames[event.month]}</span>
                </div>
                <div class="event-info">
                    <div class="event-type">
                        <i class="fas ${typeIcon}"></i>
                        ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </div>
                    <h4 class="event-title">${escapeHtml(event.title)}</h4>
                    ${event.titleHi ? `<p class="event-title-hi" lang="hi">${escapeHtml(event.titleHi)}</p>` : ''}
                    <div class="event-meta">
                        ${tradition ? `<span class="event-tradition" style="color: ${tradition.color}">${escapeHtml(tradition.name)}</span>` : ''}
                        <span class="event-countdown">${daysText}</span>
                    </div>
                    ${event.note ? `<p class="event-note">${escapeHtml(event.note)}</p>` : ''}
                </div>
                <div class="event-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    },

    /**
     * Render calendar view
     */
    renderCalendar(events) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];

        return `
            <!-- Month Selector -->
            <div class="month-selector">
                <button class="month-nav" id="prev-month">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h3 class="month-name">${monthNames[this.selectedMonth]}</h3>
                <button class="month-nav" id="next-month">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>

            <!-- Events for this month -->
            <div class="month-events">
                ${this.renderMonthEvents(events)}
            </div>
        `;
    },

    /**
     * Render month events
     */
    renderMonthEvents(events) {
        const monthEvents = events.filter(e => e.month === this.selectedMonth);

        if (monthEvents.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No jayantis this month</p>
                </div>
            `;
        }

        // Group by day
        const byDay = {};
        monthEvents.forEach(event => {
            if (!byDay[event.day]) byDay[event.day] = [];
            byDay[event.day].push(event);
        });

        // Add daysFromNow to each event
        monthEvents.forEach(event => {
            event.daysFromNow = this.getDaysUntil(event.month, event.day);
        });

        return Object.entries(byDay)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([day, dayEvents]) => `
                <div class="day-group">
                    <div class="day-header">
                        <span class="day-number">${day}</span>
                    </div>
                    <div class="day-events">
                        ${dayEvents.map(event => this.renderEventCard(event)).join('')}
                    </div>
                </div>
            `).join('');
    },

    /**
     * Update content based on view
     */
    updateContent(events) {
        const content = this.container.querySelector('#jayanti-content');
        if (!content) return;

        if (this.currentView === 'upcoming') {
            content.innerHTML = this.renderUpcoming(this.getUpcomingEvents(events));
        } else {
            content.innerHTML = this.renderCalendar(events);
            this.setupCalendarNav(events);
        }

        this.setupEventListeners();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Event card clicks
        this.container.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => {
                const saintId = card.dataset.saintId;
                if (saintId) {
                    closeModal();
                    navigate('saint', { id: saintId });
                }
            });
        });
    },

    /**
     * Setup calendar navigation
     */
    setupCalendarNav(events) {
        const prevBtn = this.container.querySelector('#prev-month');
        const nextBtn = this.container.querySelector('#next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.selectedMonth = (this.selectedMonth - 1 + 12) % 12;
                this.updateContent(events);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.selectedMonth = (this.selectedMonth + 1) % 12;
                this.updateContent(events);
            });
        }
    },

    /**
     * Cleanup
     */
    cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }
};

export default JayantiModal;
