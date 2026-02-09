/**
 * Panchang App - Complete Script
 * First Principles: Answer user's core questions quickly
 * 
 * 1. WHAT - Today's tithi, nakshatra
 * 2. WHEN - Is now good or avoid
 * 3. PLAN - Upcoming festivals
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // === STATE ===
    let currentDate = new Date();
    let location = { lat: 18.5204, lon: 73.8567, city: 'Pune' }; // Default to Pune
    let settings = { ayanamsa: 'lahiri' };
    let currentPanchang = null;

    // === CITY DATABASE ===
    const CITIES = {
        delhi: { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
        mumbai: { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
        pune: { lat: 18.5204, lon: 73.8567, name: 'Pune' },
        bangalore: { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
        chennai: { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
        kolkata: { lat: 22.5726, lon: 88.3639, name: 'Kolkata' },
        hyderabad: { lat: 17.3850, lon: 78.4867, name: 'Hyderabad' },
        ahmedabad: { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad' },
        jaipur: { lat: 26.9124, lon: 75.7873, name: 'Jaipur' },
        lucknow: { lat: 26.8467, lon: 80.9462, name: 'Lucknow' },
        varanasi: { lat: 25.3176, lon: 82.9739, name: 'Varanasi' },
        ujjain: { lat: 23.1765, lon: 75.7885, name: 'Ujjain' },
        prayagraj: { lat: 25.4358, lon: 81.8463, name: 'Prayagraj' },
        kanpur: { lat: 26.4499, lon: 80.3319, name: 'Kanpur' },
        surat: { lat: 21.1702, lon: 72.8311, name: 'Surat' },
        nagpur: { lat: 21.1458, lon: 79.0882, name: 'Nagpur' },
        indore: { lat: 22.7196, lon: 75.8577, name: 'Indore' },
        bhopal: { lat: 23.2599, lon: 77.4126, name: 'Bhopal' },
        patna: { lat: 25.5941, lon: 85.1376, name: 'Patna' },
        coimbatore: { lat: 11.0168, lon: 76.9558, name: 'Coimbatore' }
    };

    // === UPCOMING FESTIVALS ===
    const UPCOMING_FESTIVALS = [
        { date: new Date(2026, 1, 14), name: 'महाशिवरात्रि', nameEn: 'Maha Shivaratri', icon: '🔱' },
        { date: new Date(2026, 2, 13), name: 'होली', nameEn: 'Holi', icon: '🎨' },
        { date: new Date(2026, 3, 2), name: 'राम नवमी', nameEn: 'Ram Navami', icon: '🏹' },
        { date: new Date(2026, 7, 14), name: 'जन्माष्टमी', nameEn: 'Janmashtami', icon: '🎂' },
        { date: new Date(2026, 8, 26), name: 'गणेश चतुर्थी', nameEn: 'Ganesh Chaturthi', icon: '🐘' },
        { date: new Date(2026, 9, 10), name: 'दशहरा', nameEn: 'Dussehra', icon: '🏹' },
        { date: new Date(2026, 9, 29), name: 'दीपावली', nameEn: 'Diwali', icon: '🪔' }
    ];

    // === INIT ===
    function init() {
        loadSettings();
        setupEventListeners();
        updateDisplay();
    }

    function loadSettings() {
        const saved = localStorage.getItem('panchang_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            location = parsed.location || location;
            settings = parsed.settings || settings;
        }
    }

    function saveSettings() {
        localStorage.setItem('panchang_settings', JSON.stringify({ location, settings }));
    }

    // === REVERSE GEOCODING ===
    function findNearestCity(lat, lon) {
        let nearestCity = 'Current Location';
        let minDist = Infinity;

        for (const [key, city] of Object.entries(CITIES)) {
            const dist = Math.sqrt(
                Math.pow(lat - city.lat, 2) +
                Math.pow(lon - city.lon, 2)
            );
            if (dist < minDist) {
                minDist = dist;
                nearestCity = city.name;
            }
        }

        // Only use city name if within ~50km (roughly 0.5 degrees)
        return minDist < 0.5 ? nearestCity : 'Current Location';
    }

    // === MAIN UPDATE ===
    function updateDisplay() {
        try {
            if (typeof VedicEngine === 'undefined' || !VedicEngine) {
                console.error('VedicEngine not loaded');
                return;
            }

            currentPanchang = VedicEngine.getPanchang(currentDate, location.lat, location.lon, {
                ayanamsa: settings.ayanamsa
            });

            if (currentPanchang.error) {
                console.error(currentPanchang.error);
                return;
            }

            updateHeader();
            updateHero();
            updateTiming();
            updateUpcoming();
            updateDetails();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function updateHeader() {
        const hinduDate = document.getElementById('hindu-date');
        const gregorianDate = document.getElementById('gregorian-date');
        const locationName = document.getElementById('location-name');

        if (hinduDate) {
            hinduDate.textContent = `${currentPanchang.hinduMonth.lunar.name} ${currentPanchang.tithi.fullName}`;
        }
        if (gregorianDate) {
            gregorianDate.textContent = currentDate.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }
        if (locationName) {
            locationName.textContent = location.city;
        }
    }

    function updateHero() {
        const { tithi, nakshatra, sunTimes, moonIllumination } = currentPanchang;

        // Moon visual
        const moonShadow = document.getElementById('moon-shadow');
        if (moonShadow) {
            const pct = moonIllumination.percentage;
            if (moonIllumination.isWaxing) {
                moonShadow.style.width = `${100 - pct}%`;
                moonShadow.style.right = '0';
                moonShadow.style.left = 'auto';
            } else {
                moonShadow.style.width = `${100 - pct}%`;
                moonShadow.style.left = '0';
                moonShadow.style.right = 'auto';
            }
        }

        // Tithi
        const tithiName = document.getElementById('tithi-name');
        const tithiEnd = document.getElementById('tithi-end');
        if (tithiName) tithiName.textContent = tithi.fullName;
        if (tithiEnd) tithiEnd.textContent = `Till ${tithi.endTime}`;

        // Quick facts
        const nakshatraName = document.getElementById('nakshatra-name');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        if (nakshatraName) nakshatraName.textContent = nakshatra.name;
        if (sunrise) sunrise.textContent = sunTimes.sunriseTime;
        if (sunset) sunset.textContent = sunTimes.sunsetTime;
    }

    function updateTiming() {
        const { sunTimes, choghadiya, rahuKalam, yamagandam, auspiciousMuhurats } = currentPanchang;
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        const isToday = currentDate.toDateString() === now.toDateString();

        // Determine if day or night
        const isDaytime = currentHour >= sunTimes.sunrise && currentHour < sunTimes.sunset;
        const slots = choghadiya[isDaytime ? 'day' : 'night'];

        // Find current choghadiya
        let currentChog = null;
        if (isToday) {
            currentChog = slots.find(s => currentHour >= s.start && currentHour < s.end);
        }

        // Update status banner
        const statusBanner = document.getElementById('current-status');
        const statusTitle = document.getElementById('status-title');
        const statusDesc = document.getElementById('status-desc');
        const statusIcon = statusBanner?.querySelector('.status-icon');

        if (isToday && currentChog) {
            statusBanner.className = `status-banner ${currentChog.good ? 'good' : 'avoid'}`;
            if (statusIcon) {
                statusIcon.textContent = currentChog.good ? 'check_circle' : 'warning';
            }
            if (statusTitle) {
                statusTitle.textContent = currentChog.good ? 'Auspicious Time' : 'Caution Period';
            }
            if (statusDesc) {
                const mins = Math.floor((currentChog.end - currentHour) * 60);
                statusDesc.textContent = `${currentChog.name} (${currentChog.nameEn}) • ${mins} min remaining`;
            }
        } else {
            // Check Rahu Kalam
            const inRahu = isToday && currentHour >= rahuKalam.start && currentHour < rahuKalam.end;
            if (inRahu) {
                statusBanner.className = 'status-banner avoid';
                if (statusIcon) statusIcon.textContent = 'warning';
                if (statusTitle) statusTitle.textContent = 'Rahu Kalam';
                if (statusDesc) {
                    const mins = Math.floor((rahuKalam.end - currentHour) * 60);
                    statusDesc.textContent = `Avoid new ventures • ${mins} min remaining`;
                }
            }
        }

        // Update good times list
        updateGoodTimes(auspiciousMuhurats, choghadiya);
        updateAvoidTimes(rahuKalam, yamagandam);
    }

    function updateGoodTimes(muhurats, choghadiya) {
        const list = document.getElementById('good-times-list');
        if (!list) return;

        const goodTimes = [
            { name: 'Brahma Muhurta', range: `${muhurats.brahmaMuhurta.startTime} - ${muhurats.brahmaMuhurta.endTime}` },
            { name: 'Abhijit Muhurta', range: `${muhurats.abhijitMuhurta.startTime} - ${muhurats.abhijitMuhurta.endTime}` }
        ];

        // Add good choghadiyas
        const goodChogs = choghadiya.day.filter(c => c.good && ['अमृत', 'शुभ', 'लाभ'].includes(c.name));
        goodChogs.forEach(c => {
            goodTimes.push({ name: `${c.name}`, range: `${c.startTime} - ${c.endTime}` });
        });

        list.innerHTML = goodTimes.map(t => `
            <div class="time-row">
                <span class="time-name">${t.name}</span>
                <span class="time-range">${t.range}</span>
            </div>
        `).join('');
    }

    function updateAvoidTimes(rahu, yama) {
        const list = document.getElementById('avoid-times-list');
        if (!list) return;

        list.innerHTML = `
            <div class="time-row">
                <span class="time-name">Rahu Kalam</span>
                <span class="time-range">${rahu.startTime} - ${rahu.endTime}</span>
            </div>
            <div class="time-row">
                <span class="time-name">Yamagandam</span>
                <span class="time-range">${yama.startTime} - ${yama.endTime}</span>
            </div>
        `;
    }

    function updateUpcoming() {
        const todayEvents = document.getElementById('today-events');
        const upcomingList = document.getElementById('upcoming-festivals');

        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);

        // Today's events
        const eventsToday = UPCOMING_FESTIVALS.filter(f => {
            const festDate = new Date(f.date);
            festDate.setHours(0, 0, 0, 0);
            return festDate.getTime() === today.getTime();
        });

        if (todayEvents) {
            todayEvents.innerHTML = eventsToday.map(e => `
                <div class="event-card">
                    <span class="event-icon">${e.icon}</span>
                    <div class="event-info">
                        <span class="event-name">${e.name}</span>
                        <span class="event-name-en">${e.nameEn}</span>
                    </div>
                </div>
            `).join('');
        }

        // Upcoming
        const upcoming = UPCOMING_FESTIVALS
            .filter(f => f.date > today)
            .sort((a, b) => a.date - b.date)
            .slice(0, 5);

        if (upcomingList) {
            if (upcoming.length === 0) {
                upcomingList.innerHTML = '<div class="no-events">No upcoming festivals</div>';
            } else {
                upcomingList.innerHTML = upcoming.map(f => `
                    <div class="upcoming-item">
                        <div class="upcoming-date">
                            <span class="upcoming-day">${f.date.getDate()}</span>
                            <span class="upcoming-month">${f.date.toLocaleDateString('en', { month: 'short' })}</span>
                        </div>
                        <span class="upcoming-name">${f.icon} ${f.nameEn}</span>
                    </div>
                `).join('');
            }
        }
    }

    function updateDetails() {
        const { tithi, nakshatra, yoga, karana, samvatsara, hinduMonth, ayana } = currentPanchang;

        setText('d-tithi', tithi.fullName);
        setText('d-tithi-time', `Till ${tithi.endTime}`);
        setText('d-nakshatra', nakshatra.name);
        setText('d-nakshatra-time', `Till ${nakshatra.endTime}`);
        setText('d-yoga', yoga.name);
        setText('d-yoga-time', `Till ${yoga.endTime}`);
        setText('d-karana', karana.name);
        setText('d-karana-time', `Till ${karana.endTime}`);

        // Calendar info
        const calendarInfo = document.getElementById('calendar-info');
        if (calendarInfo) {
            calendarInfo.innerHTML = `
                <div class="cal-item">
                    <span>Samvatsara</span>
                    <span>${samvatsara.name}</span>
                </div>
                <div class="cal-item">
                    <span>Vikram Samvat</span>
                    <span>${samvatsara.vikramSamvat}</span>
                </div>
                <div class="cal-item">
                    <span>Shaka Samvat</span>
                    <span>${samvatsara.shakaSamvat}</span>
                </div>
                <div class="cal-item">
                    <span>Month</span>
                    <span>${hinduMonth.lunar.name}</span>
                </div>
                <div class="cal-item">
                    <span>Ayana</span>
                    <span>${ayana.name}</span>
                </div>
            `;
        }
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function updateChoghadiya(period) {
        const list = document.getElementById('choghadiya-list');
        if (!list || !currentPanchang.choghadiya) return;

        const slots = currentPanchang.choghadiya[period];
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        const isToday = currentDate.toDateString() === now.toDateString();

        list.innerHTML = slots.map(slot => {
            const isCurrent = isToday && currentHour >= slot.start && currentHour < slot.end;
            return `
                <div class="chog-item ${slot.good ? 'good' : 'bad'} ${isCurrent ? 'current' : ''}">
                    <span class="chog-name">${slot.name} (${slot.nameEn})</span>
                    <span class="chog-time">${slot.startTime} - ${slot.endTime}</span>
                </div>
            `;
        }).join('');
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Date navigation
        document.getElementById('prev-day')?.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 1);
            updateDisplay();
        });

        document.getElementById('next-day')?.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDisplay();
        });

        document.getElementById('date-center')?.addEventListener('click', () => {
            currentDate = new Date();
            updateDisplay();
        });

        // Expand details
        document.getElementById('expand-details')?.addEventListener('click', () => {
            const btn = document.getElementById('expand-details');
            const content = document.getElementById('details-content');

            btn.classList.toggle('active');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';

            if (content.style.display === 'block') {
                updateChoghadiya('day');
            }
        });

        // Choghadiya tabs
        document.querySelectorAll('.chog-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.chog-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateChoghadiya(tab.dataset.period);
            });
        });

        // Location pill
        document.getElementById('location-pill')?.addEventListener('click', () => {
            document.getElementById('location-modal').classList.add('active');
        });

        // Settings
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('active');
        });

        // Close modals
        document.getElementById('close-settings')?.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('active');
        });
        document.getElementById('close-location')?.addEventListener('click', () => {
            document.getElementById('location-modal').classList.remove('active');
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        });

        // City selection (works with data-lat/data-lon)
        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lat = parseFloat(btn.dataset.lat);
                const lon = parseFloat(btn.dataset.lon);

                if (!isNaN(lat) && !isNaN(lon)) {
                    location.lat = lat;
                    location.lon = lon;
                    location.city = btn.textContent.trim();
                    saveSettings();
                    closeAllModals();
                    updateDisplay();
                }
            });
        });

        // Auto location detection - for both buttons
        const locationButtons = [
            document.getElementById('detect-location'),
            document.getElementById('detect-location-2')
        ];

        locationButtons.forEach(btn => {
            btn?.addEventListener('click', detectLocation);
        });

        // Ayanamsa change
        document.getElementById('ayanamsa-select')?.addEventListener('change', (e) => {
            settings.ayanamsa = e.target.value;
            saveSettings();
            updateDisplay();
        });
    }

    function detectLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation not supported by your browser');
            return;
        }

        // Show loading state
        const btns = document.querySelectorAll('[id^="detect-location"]');
        btns.forEach(btn => {
            if (btn) btn.textContent = 'Detecting...';
        });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                location.lat = pos.coords.latitude;
                location.lon = pos.coords.longitude;
                location.city = findNearestCity(pos.coords.latitude, pos.coords.longitude);
                saveSettings();
                closeAllModals();
                updateDisplay();

                // Reset button text
                btns.forEach(btn => {
                    if (btn) btn.innerHTML = '<span class="material-symbols-rounded">my_location</span> Use My Location';
                });
            },
            (error) => {
                console.error('Location error:', error);
                alert('Could not detect location. Please select a city manually.');

                // Reset button text
                btns.forEach(btn => {
                    if (btn) btn.innerHTML = '<span class="material-symbols-rounded">my_location</span> Use My Location';
                });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    // === START ===
    init();
});
