/**
 * Satsang - Spiritual Events App
 * Main Application Logic
 */

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

// State
const state = {
    currentCity: 'all',
    savedEvents: [],
    followedVachaks: [],
    currentEventId: null,
    currentVachakId: null,
    selectedDate: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
};

// ===== INITIALIZATION =====
function initApp() {
    loadState();
    loadVachaks();
    loadEvents();
    initSearch();
    initLocation();
    initFilter();
    initBottomNav();
    initCalendar();
    initDonation();
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    lucide.createIcons();
}

// ===== LOAD VACHAKS =====
function loadVachaks() {
    const container = document.getElementById('vachaksList');
    container.innerHTML = '';

    window.vachaks.forEach(v => {
        const card = document.createElement('div');
        card.className = 'vachak-card';
        card.innerHTML = `
            <div class="vachak-avatar">
                <div class="vachak-avatar-placeholder">${v.emoji}</div>
            </div>
            <h4>${v.shortName}</h4>
            <p>${v.specialty}</p>
        `;
        card.addEventListener('click', () => openVachak(v.id));
        container.appendChild(card);
    });
}

// ===== LOAD EVENTS =====
function loadEvents() {
    const container = document.getElementById('eventsList');
    const nearbyContainer = document.getElementById('nearbyList');
    container.innerHTML = '';
    nearbyContainer.innerHTML = '';

    // Filter by city
    let filtered = window.events;
    if (state.currentCity !== 'all') {
        filtered = filtered.filter(e => e.city === state.currentCity);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Upcoming events (first 4)
    filtered.slice(0, 4).forEach(event => {
        container.appendChild(createEventCard(event));
    });

    // Nearby (random 2)
    filtered.slice(0, 2).forEach(event => {
        nearbyContainer.appendChild(createEventCard(event));
    });

    lucide.createIcons();
}

function createEventCard(event) {
    const date = new Date(event.startDate);
    const isSaved = state.savedEvents.includes(event.id);

    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-date-box">
            <span class="day">${date.getDate()}</span>
            <span class="month">${date.toLocaleString('en', { month: 'short' })}</span>
        </div>
        <div class="event-info">
            <span class="event-type">${event.typeName}</span>
            <h4>${event.title}</h4>
            <p class="vachak-name">${event.vachakName}</p>
            <div class="event-location">
                <i data-lucide="map-pin"></i>
                ${event.location}
            </div>
        </div>
        <button class="save-btn ${isSaved ? 'saved' : ''}" data-event="${event.id}">
            <i data-lucide="${isSaved ? 'heart' : 'heart'}"></i>
        </button>
    `;

    // Click on card opens detail
    card.querySelector('.event-info').addEventListener('click', () => openEvent(event.id));
    card.querySelector('.event-date-box').addEventListener('click', () => openEvent(event.id));

    // Save button
    card.querySelector('.save-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSaveEvent(event.id);
    });

    return card;
}

// ===== EVENT DETAIL =====
function openEvent(eventId) {
    const event = window.events.find(e => e.id === eventId);
    if (!event) return;

    state.currentEventId = eventId;

    const container = document.getElementById('eventMain');
    const isSaved = state.savedEvents.includes(eventId);

    container.innerHTML = `
        <div class="event-hero">
            <div class="event-hero-gradient"></div>
            <div class="event-hero-content">
                <span class="event-hero-type">${event.typeName}</span>
                <h1>${event.title}</h1>
                <p>${event.vachakName}</p>
            </div>
        </div>
        <div class="event-details">
            <div class="detail-row">
                <div class="detail-icon"><i data-lucide="calendar"></i></div>
                <div class="detail-content">
                    <h4>${formatDateRange(event.startDate, event.endDate)}</h4>
                    <p>${event.duration} Day${event.duration > 1 ? 's' : ''} • ${event.timing}</p>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-icon"><i data-lucide="map-pin"></i></div>
                <div class="detail-content">
                    <h4>${event.venue}</h4>
                    <p>${event.location}</p>
                    <a href="#" class="link">Open in Maps →</a>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-icon"><i data-lucide="user"></i></div>
                <div class="detail-content">
                    <h4>${event.organizer}</h4>
                    <p>${event.contact}</p>
                </div>
            </div>
            ${event.bhandara ? `
            <div class="detail-row">
                <div class="detail-icon"><i data-lucide="utensils"></i></div>
                <div class="detail-content">
                    <h4>Bhandara (Free Prasad)</h4>
                    <p>Daily prasad distribution for all attendees</p>
                </div>
            </div>` : ''}
            ${event.hasLiveStream ? `
            <div class="detail-row">
                <div class="detail-icon"><i data-lucide="video"></i></div>
                <div class="detail-content">
                    <h4>Live Streaming Available</h4>
                    <p>Watch online if you can't attend</p>
                </div>
            </div>` : ''}
            ${event.schedule.length > 0 ? `
            <div class="detail-row">
                <div class="detail-icon"><i data-lucide="list"></i></div>
                <div class="detail-content">
                    <h4>Daily Schedule</h4>
                    <div class="schedule-list">
                        ${event.schedule.map(s => `
                            <div class="schedule-item">
                                <span class="schedule-day">${s.day}</span>
                                <div class="schedule-info">
                                    <h5>${s.title}</h5>
                                    <p>${s.time}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>` : ''}
            <div class="detail-row">
                <div class="detail-icon"><i data-lucide="info"></i></div>
                <div class="detail-content">
                    <h4>About This Event</h4>
                    <p>${event.description}</p>
                </div>
            </div>
        </div>
    `;

    // Update save button
    document.getElementById('saveEvent').innerHTML = `<i data-lucide="${isSaved ? 'heart' : 'heart'}"></i>`;
    document.getElementById('saveEvent').classList.toggle('saved', isSaved);

    // Add event listeners
    document.getElementById('backFromEvent').addEventListener('click', () => showScreen('homeScreen'));
    document.getElementById('saveEvent').addEventListener('click', () => toggleSaveEvent(eventId));
    document.getElementById('shareEvent').addEventListener('click', () => shareEvent(event));
    document.getElementById('donateBtn').addEventListener('click', () => showDonationModal());
    document.getElementById('registerBtn').addEventListener('click', () => registerForEvent(event));

    showScreen('eventScreen');
    lucide.createIcons();
}

// ===== VACHAK PROFILE =====
function openVachak(vachakId) {
    const vachak = window.vachaks.find(v => v.id === vachakId);
    if (!vachak) return;

    state.currentVachakId = vachakId;
    const isFollowing = state.followedVachaks.includes(vachakId);

    document.getElementById('vachakName').textContent = vachak.name;

    const container = document.getElementById('vachakMain');
    container.innerHTML = `
        <div class="vachak-profile">
            <div class="vachak-large-avatar">
                <div>${vachak.emoji}</div>
            </div>
            <h2>${vachak.name}</h2>
            <p class="specialty">${vachak.specialty}</p>
            <div class="vachak-stats">
                <div class="stat">
                    <span class="stat-value">${formatNumber(vachak.followers)}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${vachak.events}+</span>
                    <span class="stat-label">Events</span>
                </div>
            </div>
            <button class="follow-btn" id="followVachakBtn">
                <i data-lucide="${isFollowing ? 'check' : 'plus'}"></i>
                ${isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
        <section class="events-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i data-lucide="calendar-days"></i>
                    Upcoming Events
                </h3>
            </div>
            <div class="events-list" id="vachakEvents"></div>
        </section>
    `;

    // Load vachak's events
    const vachakEvents = window.events.filter(e => e.vachakId === vachakId);
    const eventsContainer = document.getElementById('vachakEvents');
    vachakEvents.forEach(event => {
        eventsContainer.appendChild(createEventCard(event));
    });

    // Follow button
    document.getElementById('followVachakBtn').addEventListener('click', () => toggleFollow(vachakId));

    // Back button
    document.getElementById('backFromVachak').addEventListener('click', () => showScreen('homeScreen'));

    showScreen('vachakScreen');
    lucide.createIcons();
}

// ===== CALENDAR =====
function initCalendar() {
    document.getElementById('seeAllEvents')?.addEventListener('click', () => {
        showScreen('calendarScreen');
        renderCalendar();
    });

    document.getElementById('backFromCalendar')?.addEventListener('click', () => showScreen('homeScreen'));
    document.getElementById('prevMonth')?.addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth')?.addEventListener('click', () => changeMonth(1));
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    const firstDay = new Date(state.currentYear, state.currentMonth, 1);
    const lastDay = new Date(state.currentYear, state.currentMonth + 1, 0);
    const today = new Date();

    // Update title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('calendarTitle').textContent =
        `${monthNames[state.currentMonth]} ${state.currentYear}`;

    // Empty cells before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        grid.appendChild(cell);
    }

    // Days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = day;

        const cellDate = new Date(state.currentYear, state.currentMonth, day);

        // Check if today
        if (cellDate.toDateString() === today.toDateString()) {
            cell.classList.add('today');
        }

        // Check if has events
        const dateStr = cellDate.toISOString().split('T')[0];
        const hasEvent = window.events.some(e => {
            const start = new Date(e.startDate);
            const end = new Date(e.endDate);
            return cellDate >= start && cellDate <= end;
        });

        if (hasEvent) {
            cell.classList.add('has-event');
        }

        cell.addEventListener('click', () => selectDate(cellDate));
        grid.appendChild(cell);
    }

    lucide.createIcons();
}

function changeMonth(delta) {
    state.currentMonth += delta;
    if (state.currentMonth > 11) {
        state.currentMonth = 0;
        state.currentYear++;
    } else if (state.currentMonth < 0) {
        state.currentMonth = 11;
        state.currentYear--;
    }
    renderCalendar();
}

function selectDate(date) {
    state.selectedDate = date;

    // Update UI
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    event.target.classList.add('selected');

    // Find events on this date
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = window.events.filter(e => {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        return date >= start && date <= end;
    });

    const eventsContainer = document.getElementById('calendarEvents');
    if (dayEvents.length === 0) {
        eventsContainer.innerHTML = `
            <h3>Events on ${date.toLocaleDateString()}</h3>
            <p class="no-events">No events on this day</p>
        `;
    } else {
        eventsContainer.innerHTML = `<h3>Events on ${date.toLocaleDateString()}</h3>`;
        dayEvents.forEach(event => {
            eventsContainer.appendChild(createEventCard(event));
        });
    }

    lucide.createIcons();
}

// ===== SEARCH =====
function initSearch() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');

    document.getElementById('searchBtn')?.addEventListener('click', () => {
        modal.classList.add('active');
        input.focus();
    });

    document.getElementById('closeSearch')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    document.querySelector('.search-modal .modal-backdrop')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.textContent;
            performSearch(chip.textContent);
        });
    });

    input?.addEventListener('input', (e) => performSearch(e.target.value));
}

function performSearch(query) {
    const results = document.getElementById('searchResults');
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }

    const q = query.toLowerCase();
    const matches = [];

    // Search events
    window.events.forEach(e => {
        if (e.title.toLowerCase().includes(q) ||
            e.englishTitle.toLowerCase().includes(q) ||
            e.vachakName.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q)) {
            matches.push({ type: 'event', data: e });
        }
    });

    // Search vachaks
    window.vachaks.forEach(v => {
        if (v.name.toLowerCase().includes(q) ||
            v.shortName.toLowerCase().includes(q)) {
            matches.push({ type: 'vachak', data: v });
        }
    });

    if (matches.length === 0) {
        results.innerHTML = '<p class="search-hint">No results found</p>';
    } else {
        results.innerHTML = matches.slice(0, 8).map(m => {
            if (m.type === 'event') {
                return `
                    <div class="search-result-item" onclick="openEvent('${m.data.id}'); document.getElementById('searchModal').classList.remove('active');">
                        <h4>${m.data.title}</h4>
                        <p>${m.data.vachakName} • ${m.data.location}</p>
                    </div>
                `;
            } else {
                return `
                    <div class="search-result-item" onclick="openVachak('${m.data.id}'); document.getElementById('searchModal').classList.remove('active');">
                        <h4>${m.data.emoji} ${m.data.name}</h4>
                        <p>${m.data.specialty}</p>
                    </div>
                `;
            }
        }).join('');
    }
}

// ===== LOCATION =====
function initLocation() {
    const modal = document.getElementById('locationModal');

    document.getElementById('locationBtn')?.addEventListener('click', () => {
        modal.classList.add('active');
    });

    document.getElementById('closeLocation')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    document.querySelector('.location-modal .modal-backdrop')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // City buttons
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const city = btn.dataset.city;
            selectCity(city);
            modal.classList.remove('active');
        });
    });

    // Current location
    document.getElementById('useCurrentLocation')?.addEventListener('click', () => {
        showToast('Location detection coming soon!');
        modal.classList.remove('active');
    });
}

function selectCity(city) {
    state.currentCity = city;
    const cityData = window.cities[city];
    document.getElementById('currentLocation').textContent = cityData.name;
    loadEvents();
    saveState();
}

// ===== FILTER =====
function initFilter() {
    const modal = document.getElementById('filterModal');

    document.getElementById('filterBtn')?.addEventListener('click', () => {
        modal.classList.add('active');
    });

    document.getElementById('closeFilter')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    document.querySelector('.filter-modal .modal-backdrop')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    document.getElementById('applyFilters')?.addEventListener('click', () => {
        showToast('Filters applied!');
        modal.classList.remove('active');
    });

    // Quick filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });
}

// ===== DONATION =====
function initDonation() {
    const modal = document.getElementById('donationModal');

    document.getElementById('closeDonation')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    document.querySelector('.donation-modal .modal-backdrop')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Amount buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('customAmount').value = '';
        });
    });

    document.getElementById('proceedDonation')?.addEventListener('click', () => {
        showToast('Payment integration coming soon!');
        modal.classList.remove('active');
    });
}

function showDonationModal() {
    document.getElementById('donationModal').classList.add('active');
}

// ===== BOTTOM NAV =====
function initBottomNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;

            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            switch (tab) {
                case 'home':
                    showScreen('homeScreen');
                    break;
                case 'calendar':
                    showScreen('calendarScreen');
                    renderCalendar();
                    break;
                case 'saved':
                    showSavedEvents();
                    break;
                case 'profile':
                    showProfile();
                    break;
            }
        });
    });
}

function showSavedEvents() {
    if (state.savedEvents.length === 0) {
        showToast('No saved events. Tap ❤️ to save!');
    } else {
        showToast(`${state.savedEvents.length} events saved`);
    }
}

function showProfile() {
    showToast('Profile coming soon!');
}

// ===== HELPERS =====
function toggleSaveEvent(eventId) {
    const idx = state.savedEvents.indexOf(eventId);
    if (idx === -1) {
        state.savedEvents.push(eventId);
        showToast('Event saved!');
    } else {
        state.savedEvents.splice(idx, 1);
        showToast('Event removed');
    }
    saveState();
    loadEvents();
}

function toggleFollow(vachakId) {
    const idx = state.followedVachaks.indexOf(vachakId);
    if (idx === -1) {
        state.followedVachaks.push(vachakId);
        showToast('Following!');
    } else {
        state.followedVachaks.splice(idx, 1);
        showToast('Unfollowed');
    }
    saveState();
    openVachak(vachakId);
}

function shareEvent(event) {
    if (navigator.share) {
        navigator.share({
            title: event.title,
            text: `${event.title} by ${event.vachakName} in ${event.location}`,
            url: window.location.href
        });
    } else {
        showToast('Link copied!');
    }
}

function registerForEvent(event) {
    showRegistrationModal(event);
}

// ===== YAJMAN REGISTRATION =====
let registrationData = {
    tier: 'attendee',
    name: '',
    fatherName: '',
    gotra: '',
    rashi: '',
    nakshatra: '',
    phone: '',
    email: '',
    pan: '',
    eventId: null
};

let currentRegStep = 1;

function showRegistrationModal(event) {
    registrationData.eventId = event?.id || state.currentEventId;
    currentRegStep = 1;
    resetRegistrationForm();
    updateRegStep(1);
    document.getElementById('registrationModal').classList.add('active');
    lucide.createIcons();

    // Init tier change handler
    document.querySelectorAll('input[name="tier"]').forEach(r => {
        r.addEventListener('change', handleTierChange);
    });

    // Init navigation
    document.getElementById('regNextBtn').onclick = handleRegNext;
    document.getElementById('regPrevBtn').onclick = handleRegPrev;
    document.getElementById('closeRegistration').onclick = () => {
        document.getElementById('registrationModal').classList.remove('active');
    };
    document.querySelector('.registration-modal .modal-backdrop').onclick = () => {
        document.getElementById('registrationModal').classList.remove('active');
    };
}

function resetRegistrationForm() {
    document.getElementById('yajmanName').value = '';
    document.getElementById('fatherName').value = '';
    document.getElementById('gotra').value = '';
    document.getElementById('rashi').value = '';
    document.getElementById('nakshatra').value = '';
    document.getElementById('yajmanPhone').value = '';
    document.getElementById('yajmanEmail').value = '';
    document.getElementById('yajmanPan').value = '';
    document.querySelector('input[name="tier"][value="attendee"]').checked = true;
    document.getElementById('termsAgree').checked = false;
}

function handleTierChange(e) {
    registrationData.tier = e.target.value;
    const panGroup = document.getElementById('panGroup');
    if (registrationData.tier !== 'attendee') {
        panGroup.style.display = 'block';
    } else {
        panGroup.style.display = 'none';
    }
}

function updateRegStep(step) {
    currentRegStep = step;

    // Update step indicators
    document.querySelectorAll('.reg-steps .step').forEach(s => {
        const num = parseInt(s.dataset.step);
        s.classList.remove('active', 'done');
        if (num === step) s.classList.add('active');
        if (num < step) s.classList.add('done');
    });

    // Show/hide content
    document.getElementById('regStep1').classList.toggle('hidden', step !== 1);
    document.getElementById('regStep2').classList.toggle('hidden', step !== 2);
    document.getElementById('regStep3').classList.toggle('hidden', step !== 3);

    // Update buttons
    document.getElementById('regPrevBtn').style.display = step === 1 ? 'none' : 'flex';

    const nextBtn = document.getElementById('regNextBtn');
    if (step === 3) {
        nextBtn.innerHTML = `<i data-lucide="check"></i> Confirm & ${registrationData.tier === 'attendee' ? 'Register' : 'Pay'}`;
    } else {
        nextBtn.innerHTML = `Next Step <i data-lucide="chevron-right"></i>`;
    }

    lucide.createIcons();
}

function handleRegNext() {
    if (currentRegStep === 1) {
        // Capture tier selection
        const selected = document.querySelector('input[name="tier"]:checked');
        registrationData.tier = selected.value;
        updateRegStep(2);
    } else if (currentRegStep === 2) {
        // Validate personal details
        const name = document.getElementById('yajmanName').value.trim();
        const gotra = document.getElementById('gotra').value;
        const rashi = document.getElementById('rashi').value;
        const phone = document.getElementById('yajmanPhone').value.trim();

        if (!name) {
            showToast('Please enter your name');
            return;
        }
        if (!gotra) {
            showToast('Please select your Gotra');
            return;
        }
        if (!rashi) {
            showToast('Please select your Rashi');
            return;
        }
        if (!phone) {
            showToast('Please enter your phone number');
            return;
        }

        // Save data
        registrationData.name = name;
        registrationData.fatherName = document.getElementById('fatherName').value.trim();
        registrationData.gotra = gotra;
        registrationData.rashi = rashi;
        registrationData.nakshatra = document.getElementById('nakshatra').value;
        registrationData.phone = phone;
        registrationData.email = document.getElementById('yajmanEmail').value.trim();
        registrationData.pan = document.getElementById('yajmanPan').value.trim();

        // Populate confirmation
        populateSankalpCard();
        updateRegStep(3);
    } else if (currentRegStep === 3) {
        // Final confirmation
        if (!document.getElementById('termsAgree').checked) {
            showToast('Please accept the terms');
            return;
        }

        completeRegistration();
    }
}

function handleRegPrev() {
    if (currentRegStep > 1) {
        updateRegStep(currentRegStep - 1);
    }
}

const gotraNames = {
    bharadwaj: 'भारद्वाज',
    kashyap: 'कश्यप',
    vashistha: 'वशिष्ठ',
    gautam: 'गौतम',
    jamadagni: 'जमदग्नि',
    vishwamitra: 'विश्वामित्र',
    atri: 'अत्रि',
    agastya: 'अगस्त्य',
    shandilya: 'शाण्डिल्य',
    kaushik: 'कौशिक',
    other: 'अन्य'
};

const rashiNames = {
    mesh: 'मेष',
    vrishabh: 'वृषभ',
    mithun: 'मिथुन',
    kark: 'कर्क',
    simha: 'सिंह',
    kanya: 'कन्या',
    tula: 'तुला',
    vrishchik: 'वृश्चिक',
    dhanu: 'धनु',
    makar: 'मकर',
    kumbh: 'कुम्भ',
    meen: 'मीन'
};

const tierLabels = {
    attendee: 'उपस्थित',
    dainik: 'दैनिक यजमान',
    mukhya: 'मुख्य यजमान'
};

const tierAmounts = {
    attendee: 0,
    dainik: 5100,
    mukhya: 21000
};

function populateSankalpCard() {
    document.getElementById('confirmName').textContent = registrationData.name;
    document.getElementById('confirmGotra').textContent = gotraNames[registrationData.gotra] || registrationData.gotra;
    document.getElementById('confirmRashi').textContent = rashiNames[registrationData.rashi] || registrationData.rashi;
    document.getElementById('confirmTier').textContent = tierLabels[registrationData.tier];

    const event = window.events.find(e => e.id === registrationData.eventId);
    if (event) {
        document.getElementById('confirmEvent').textContent = event.title;
        document.getElementById('confirmDate').textContent = formatDateRange(event.startDate, event.endDate) + ' • ' + event.location;
    }

    // Payment summary
    const amount = tierAmounts[registrationData.tier];
    if (amount > 0) {
        document.getElementById('paymentSummary').style.display = 'block';
        document.getElementById('sevaAmount').textContent = '₹' + amount.toLocaleString();
        document.getElementById('totalAmount').textContent = '₹' + amount.toLocaleString();
    } else {
        document.getElementById('paymentSummary').style.display = 'none';
    }
}

function completeRegistration() {
    // Generate registration ID
    const regId = 'SAT-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Save registration
    const registrations = JSON.parse(localStorage.getItem('satsangRegistrations') || '[]');
    registrations.push({
        ...registrationData,
        registrationId: regId,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('satsangRegistrations', JSON.stringify(registrations));

    // Close registration modal
    document.getElementById('registrationModal').classList.remove('active');

    // Show success modal
    document.getElementById('registrationId').textContent = regId;
    document.getElementById('successModal').classList.add('active');
    lucide.createIcons();

    // Success modal close
    document.getElementById('closeSuccess').onclick = () => {
        document.getElementById('successModal').classList.remove('active');
        showScreen('homeScreen');
    };
    document.querySelector('.success-modal .modal-backdrop').onclick = () => {
        document.getElementById('successModal').classList.remove('active');
    };
}

function formatDateRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    const options = { day: 'numeric', month: 'short' };
    if (s.toDateString() === e.toDateString()) {
        return s.toLocaleDateString('en-IN', { ...options, year: 'numeric' });
    }
    return `${s.toLocaleDateString('en-IN', options)} - ${e.toLocaleDateString('en-IN', { ...options, year: 'numeric' })}`;
}

function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toString();
}

// ===== PERSISTENCE =====
function saveState() {
    localStorage.setItem('satsangState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('satsangState');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        if (state.currentCity !== 'all') {
            const cityData = window.cities[state.currentCity];
            if (cityData) document.getElementById('currentLocation').textContent = cityData.name;
        }
    }
}

// ===== TOAST =====
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: #6B46C1;
        color: white;
        border-radius: 12px;
        font-size: 0.85rem;
        z-index: 9999;
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Make functions global for inline onclick
window.openEvent = openEvent;
window.openVachak = openVachak;
