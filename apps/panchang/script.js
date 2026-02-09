/**
 * Panchang App - Simplified Script
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
    let location = { lat: 28.6139, lon: 77.2090, city: 'Delhi' };
    let settings = { ayanamsa: 'lahiri' };
    let currentPanchang = null;

    // === UPCOMING FESTIVALS (Static for performance, regenerate monthly) ===
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
        lucide.createIcons();
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

    // === MAIN UPDATE ===
    function updateDisplay() {
        try {
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

            lucide.createIcons();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function updateHeader() {
        // Date
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

        if (isToday && currentChog) {
            statusBanner.className = `status-banner ${currentChog.good ? 'good' : 'avoid'}`;
            statusBanner.querySelector('.status-icon').textContent = currentChog.good ? '✅' : '⚠️';
            statusTitle.textContent = currentChog.good ? 'Auspicious Time' : 'Caution Period';
            const minsLeft = Math.floor((currentChog.end - currentHour) * 60);
            statusDesc.textContent = `${currentChog.name} (${currentChog.nameEn}) • ${minsLeft} min remaining`;
        } else {
            statusBanner.style.display = 'none';
        }

        // Good times list
        const goodList = document.getElementById('good-times-list');
        if (goodList) {
            let html = '';
            html += timeRow('Brahma Muhurta', `${auspiciousMuhurats.brahmaMuhurta.startTime} - ${auspiciousMuhurats.brahmaMuhurta.endTime}`);
            html += timeRow('Abhijit Muhurta', `${auspiciousMuhurats.abhijitMuhurta.startTime} - ${auspiciousMuhurats.abhijitMuhurta.endTime}`);

            // Add good choghadiyas
            slots.filter(s => s.good).slice(0, 2).forEach(s => {
                html += timeRow(s.name, `${s.startTime} - ${s.endTime}`);
            });

            goodList.innerHTML = html;
        }

        // Avoid times list
        const avoidList = document.getElementById('avoid-times-list');
        if (avoidList) {
            let html = '';
            html += timeRow('Rahu Kalam', `${rahuKalam.startTime} - ${rahuKalam.endTime}`);
            html += timeRow('Yamaganda', `${yamagandam.startTime} - ${yamagandam.endTime}`);
            avoidList.innerHTML = html;
        }
    }

    function timeRow(name, range) {
        return `<div class="time-row"><span class="time-name">${name}</span><span class="time-range">${range}</span></div>`;
    }

    function updateUpcoming() {
        const todayEvents = document.getElementById('today-events');
        const upcomingList = document.getElementById('upcoming-festivals');

        // Today's festivals
        try {
            const festivals = FestivalCalculator.getFestivalsForDate(
                currentDate, VedicEngine, location.lat, location.lon, 'all'
            );

            if (festivals && festivals.length > 0) {
                todayEvents.innerHTML = festivals.map(f => `
                    <div class="event-card">
                        <span class="event-icon">${f.icon || '🙏'}</span>
                        <div class="event-info">
                            <span class="event-name">${f.name}</span>
                            <span class="event-name-en">${f.nameEn || ''}</span>
                            ${f.significance ? `<p class="event-desc">${f.significance}</p>` : ''}
                        </div>
                    </div>
                `).join('');
            } else {
                todayEvents.innerHTML = '';
            }
        } catch (e) {
            console.error(e);
            todayEvents.innerHTML = '';
        }

        // Upcoming festivals (next 7 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const week = new Date(today);
        week.setDate(week.getDate() + 60);

        const upcoming = UPCOMING_FESTIVALS
            .filter(f => f.date >= today && f.date <= week)
            .slice(0, 4);

        if (upcoming.length > 0) {
            upcomingList.innerHTML = upcoming.map(f => `
                <div class="upcoming-item">
                    <div class="upcoming-date">
                        <span class="upcoming-day">${f.date.getDate()}</span>
                        <span class="upcoming-month">${f.date.toLocaleDateString('en', { month: 'short' })}</span>
                    </div>
                    <span class="event-icon">${f.icon}</span>
                    <span class="upcoming-name">${f.name}</span>
                </div>
            `).join('');
        } else {
            upcomingList.innerHTML = '<div class="no-events">No major festivals in next 2 months</div>';
        }
    }

    function updateDetails() {
        const { tithi, nakshatra, yoga, karana, samvatsara, hinduMonth, ayana, choghadiya, sunTimes } = currentPanchang;

        // Panchang elements
        setText('d-tithi', tithi.fullName);
        setText('d-tithi-time', `Till ${tithi.endTime}`);
        setText('d-nakshatra', `${nakshatra.name} (Pada ${nakshatra.pada})`);
        setText('d-nakshatra-time', `Till ${nakshatra.endTime}`);
        setText('d-yoga', yoga.name);
        setText('d-yoga-time', `Till ${yoga.endTime}`);
        setText('d-karana', karana.name);
        setText('d-karana-time', `Till ${karana.endTime}`);

        // Calendar
        setText('d-samvatsara', samvatsara.name);
        setText('d-vikram', samvatsara.vikramSamvat);
        setText('d-shaka', samvatsara.shakaSamvat);
        setText('d-month', hinduMonth.lunar.name);
        setText('d-ayana', ayana.name);
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

        // City selection
        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                location.lat = parseFloat(btn.dataset.lat);
                location.lon = parseFloat(btn.dataset.lon);
                location.city = btn.textContent;
                saveSettings();
                document.getElementById('location-modal').classList.remove('active');
                updateDisplay();
            });
        });

        // Auto location
        document.getElementById('auto-location')?.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    location.lat = pos.coords.latitude;
                    location.lon = pos.coords.longitude;
                    location.city = 'Current Location';
                    saveSettings();
                    document.getElementById('location-modal').classList.remove('active');
                    updateDisplay();
                }, () => {
                    alert('Could not get location');
                });
            }
        });

        // Settings changes
        document.getElementById('city-select')?.addEventListener('change', (e) => {
            const [lat, lon] = e.target.value.split(',').map(Number);
            location.lat = lat;
            location.lon = lon;
            location.city = e.target.options[e.target.selectedIndex].text;
            saveSettings();
            updateDisplay();
        });

        document.getElementById('ayanamsa-select')?.addEventListener('change', (e) => {
            settings.ayanamsa = e.target.value;
            saveSettings();
            updateDisplay();
        });
    }

    // === START ===
    init();
});
