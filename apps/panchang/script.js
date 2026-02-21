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
    let userLocation = { lat: 18.5204, lon: 73.8567, city: 'Pune' }; // Default to Pune
    let settings = { ayanamsa: 'lahiri', language: 'en' };
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

    const TRANSLATIONS = {
        en: {
            "Auspicious Time": "Auspicious Time",
            "Caution Period": "Caution Period",
            "Rahu Kalam": "Rahu Kalam",
            "Sunrise": "Sunrise",
            "Sunset": "Sunset",
            "Moonrise": "Moonrise",
            "Good Times Today": "Good Times Today",
            "Avoid These Times": "Avoid These Times",
            "Right Now": "Right Now",
            "Coming Up": "Coming Up",
            "Panchang Elements": "Panchang Elements",
            "More Details": "More Details",
            "Day": "Day",
            "Night": "Night",
            "Good for": "✓ Good for",
            "Avoid": "✗ Avoid"
        },
        hi: {
            "Auspicious Time": "शुभ समय",
            "Caution Period": "सतर्कता समय",
            "Rahu Kalam": "राहु काल",
            "Sunrise": "सूर्योदय",
            "Sunset": "सूर्यास्त",
            "Moonrise": "चंद्रोदय",
            "Good Times Today": "आज का शुभ समय",
            "Avoid These Times": "वर्जित समय",
            "Right Now": "अभी",
            "Coming Up": "आगामी",
            "Panchang Elements": "पञ्चाङ्ग विवरण",
            "More Details": "अधिक विवरण",
            "Day": "दिन",
            "Night": "रात",
            "Good for": "✓ इसके लिए शुभ",
            "Avoid": "✗ इससे बचें"
        }
    };

    // === PANCHANG EXPLAINERS (Beginner Education) ===
    const PANCHANG_EXPLAINERS = {
        tithi: {
            term: 'Tithi (तिथि)',
            what: 'The lunar day — based on the angle between the Sun and Moon.',
            why: 'Each tithi carries specific energy. Some favor new beginnings (Pratipada), others favor completion (Purnima) or reflection (Amavasya).',
            fact: 'There are 30 tithis in a lunar month: 15 in Shukla Paksha (waxing) and 15 in Krishna Paksha (waning).'
        },
        nakshatra: {
            term: 'Nakshatra (नक्षत्र)',
            what: 'The lunar mansion — the constellation the Moon occupies right now.',
            why: 'Ancient seers mapped 27 nakshatras along the Moon\'s path. Each has a ruling deity and specific qualities that influence the day.',
            fact: 'The Moon spends roughly 1 day in each of the 27 nakshatras.'
        },
        yoga: {
            term: 'Yoga (योग)',
            what: 'A calculation based on the combined longitude of the Sun and Moon.',
            why: 'Some yogas are naturally auspicious (Siddhi, Shubha) while others signal caution (Vyatipata). This helps you pick the right day for important decisions.',
            fact: 'There are 27 yogas. They cycle roughly once every 24 hours.'
        },
        karana: {
            term: 'Karana (करण)',
            what: 'Half of a tithi — each tithi has two karanas.',
            why: 'Karanas fine-tune your timing. Some are good for trade (Bava), others for travel (Balava), and some signal caution (Vishti/Bhadra).',
            fact: 'There are 11 karanas: 4 fixed and 7 rotating.'
        },
        choghadiya: {
            term: 'Choghadiya (चौघड़िया)',
            what: 'A time-division system that splits day and night into 8 slots each.',
            why: 'Quick way to check if the current moment is auspicious (Shubh, Labh, Amrit) or inauspicious (Rog, Kaal, Udveg) without complex calculations.',
            fact: '16 slots per day (8 daytime + 8 nighttime), named after their ruling planet\'s quality.'
        },
        hora: {
            term: 'Hora (होरा)',
            what: 'The planetary hour — each hour of the day is ruled by a different planet.',
            why: 'Choosing the right hora amplifies your activity. Sun hora for authority, Venus hora for creativity, Jupiter hora for wisdom.',
            fact: '24 horas per day, cycling through the 7 classical planets.'
        },
        rahuKalam: {
            term: 'Rahu Kalam (राहु काल)',
            what: 'A 90-minute inauspicious window each day ruled by shadow planet Rahu.',
            why: 'Starting new ventures, signing contracts, or beginning travel during Rahu Kalam is traditionally avoided. Ongoing activities are fine.',
            fact: 'The timing shifts daily based on sunrise and the day of the week.'
        },
        ayana: {
            term: 'Ayana (अयन)',
            what: 'The Sun\'s apparent journey between north (Uttarayana) and south (Dakshinayana).',
            why: 'Uttarayana (Jan–Jul) is considered auspicious for beginnings. Dakshinayana (Jul–Jan) favors spiritual practices.',
            fact: '2 ayanas per year, each lasting approximately 6 months.'
        },
        samvatsara: {
            term: 'Samvatsara (संवत्सर)',
            what: 'The Hindu year in a 60-year cycle, each with a unique name and character.',
            why: 'The samvatsara influences the overall tone of the year — prosperity, challenges, or transformation.',
            fact: '60 samvatsaras in a full cycle (e.g., Prabhava, Vibhava, Shukla…).'
        },
        panchang: {
            term: 'Panchang (पञ्चाङ्ग)',
            what: 'Literally "five limbs" — Tithi, Nakshatra, Yoga, Karana, and Vara (weekday).',
            why: 'The Panchang is the ancient Indian system for understanding cosmic time. It tells you WHEN to act, WHEN to wait, and WHAT energy surrounds you today.',
            fact: 'Used continuously for over 3,000 years across India.'
        },
        dishaShool: {
            term: 'Disha Shool (दिशा शूल)',
            what: 'A direction considered inauspicious for travel on a particular day.',
            why: 'Each weekday has one direction to avoid for new journeys. Traveling in that direction is believed to bring obstacles.',
            fact: 'Monday = East, Tuesday = North, Wednesday = North, Thursday = South, Friday = West, Saturday = East, Sunday = West.'
        }
    };

    // === UPCOMING FESTIVALS ===
    // Dynamically calculated using FestivalCalculator based on Tithi/Nakshatra
    function getNextFestivals() {
        if (typeof FestivalCalculator === 'undefined' || typeof VedicEngine === 'undefined') {
            console.warn('[Panchang] FestivalCalculator or VedicEngine not loaded');
            return [];
        }

        try {
            const festivals = [];
            const start = new Date(currentDate);
            let currentMonth = start.getMonth();
            let currentYear = start.getFullYear();

            // Scan next 6 months
            for (let i = 0; i < 6; i++) {
                try {
                    const monthFestivals = FestivalCalculator.getFestivalsForMonth(
                        currentYear,
                        currentMonth,
                        VedicEngine,
                        userLocation.lat,
                        userLocation.lon
                    );
                    festivals.push(...monthFestivals);
                } catch (monthErr) {
                    console.warn(`[Panchang] Festival scan failed for ${currentYear}-${currentMonth}:`, monthErr.message);
                }

                // Next month
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
            }

            // Filter: Only future festivals (including today)
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0);

            return festivals
                .filter(f => f.gregorianDate >= today)
                .sort((a, b) => a.gregorianDate - b.gregorianDate)
                .slice(0, 7); // Show next 7 festivals
        } catch (err) {
            console.error('[Panchang] Festival loading failed:', err.message);
            return [];
        }
    }

    // === INIT ===
    function init() {
        // Hide content initially to prevent "numbers" glitch
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        registerServiceWorker();
        loadSettings();
        setupTheme();
        setupEventListeners();
        updateDisplay();
        startRealTimeUpdates(); // Start the heartbeat

        // Reveal content
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    }

    // === REAL-TIME UPDATES ===
    let timeInterval;

    function startRealTimeUpdates() {
        if (timeInterval) clearInterval(timeInterval);

        // Update every second for countdowns
        timeInterval = setInterval(() => {
            updateRealTimeStatus();
            updateTimelineNow();
        }, 1000);

        // Initial call
        updateRealTimeStatus();
        updateTimelineNow();
    }

    function updateRealTimeStatus() {
        if (!currentPanchang) return;

        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
        const isToday = currentDate.toDateString() === now.toDateString();

        if (!isToday) {
            document.getElementById('status-countdown').textContent = '';
            return;
        }

        const { choghadiya, rahuKalam } = currentPanchang;

        // Check Rahu Kalam first (high priority)
        if (currentHour >= rahuKalam.start && currentHour < rahuKalam.end) {
            updateCountdown(rahuKalam.end, 'Rahu Kalam ends in');
            return;
        }

        // Check Choghadiya
        const isDay = currentHour >= currentPanchang.sunTimes.sunrise && currentHour < currentPanchang.sunTimes.sunset;
        const slots = choghadiya[isDay ? 'day' : 'night'];
        const currentSlot = slots.find(s => currentHour >= s.start && currentHour < s.end);

        if (currentSlot) {
            updateCountdown(currentSlot.end, `${currentSlot.name} ends in`);
        }
    }

    function updateCountdown(endTimeHours, label) {
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

        let diffHours = endTimeHours - currentHour;
        if (diffHours < 0) diffHours += 24; // Handle day rollover if needed

        const diffSecs = Math.floor(diffHours * 3600);
        const h = Math.floor(diffSecs / 3600);
        const m = Math.floor((diffSecs % 3600) / 60);
        const s = diffSecs % 60;

        const timeStr = h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;

        const el = document.getElementById('status-countdown');
        if (el) el.textContent = `${label} ${timeStr}`;
    }

    function updateTimelineNow() {
        const bar = document.getElementById('timeline-bar');
        const marker = document.getElementById('timeline-now');
        if (!bar || !marker || !currentPanchang) return;

        const now = new Date();
        const isToday = currentDate.toDateString() === now.toDateString();

        if (!isToday) {
            marker.style.display = 'none';
            return;
        }

        const { sunTimes } = currentPanchang;
        const currentHour = now.getHours() + now.getMinutes() / 60;

        // Timeline goes from Sunrise to Sunset (Day view)
        // Or we could make it 24h? The existing design suggests "Day Timeline". 
        // Let's stick to Sunrise-Sunset for the bar as per audit.

        if (currentHour < sunTimes.sunrise || currentHour > sunTimes.sunset) {
            marker.style.display = 'none';
            return;
        }

        marker.style.display = 'flex';

        const dayDuration = sunTimes.sunset - sunTimes.sunrise;
        const progress = (currentHour - sunTimes.sunrise) / dayDuration;
        const pct = Math.max(0, Math.min(100, progress * 100));

        marker.style.left = `${pct}%`;

        // Update label to show time
        const label = document.getElementById('now-label');
        if (label) {
            label.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        }
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(() => { })
                .catch(err => console.error('SW registration failed:', err));
        }
    }

    // === THEME ===
    function setupTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        const icon = toggleBtn?.querySelector('span');

        // 1. Get saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let currentTheme = savedTheme || (systemDark ? 'dark' : 'light');

        // 2. Apply theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        // 3. Toggle listener
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                currentTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', currentTheme);
                localStorage.setItem('theme', currentTheme);
                updateThemeIcon(currentTheme);
            });
        }

        function updateThemeIcon(theme) {
            if (icon) {
                icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
            }
        }
    }

    function loadSettings() {
        const saved = localStorage.getItem('panchang_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            userLocation = parsed.location || userLocation;
            settings = parsed.settings || settings;
        }
    }

    function saveSettings() {
        localStorage.setItem('panchang_settings', JSON.stringify({ location: userLocation, settings }));
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

            currentPanchang = VedicEngine.getPanchang(currentDate, userLocation.lat, userLocation.lon, {
                ayanamsa: settings.ayanamsa
            });

            if (currentPanchang.error) {
                console.error(currentPanchang.error);
                return;
            }

            applyTranslations();
            updateGuidance();
            updateInsight();
            updateHeader();
            updateHero();
            updateTiming();
            updateUpcoming();
            updateDetails();
            updateTodayIndicator();
            checkWarnings();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function checkWarnings() {
        const { isPanchak, karana } = currentPanchang;
        const banner = document.getElementById('warning-banner');
        const title = document.getElementById('warning-title');
        const desc = document.getElementById('warning-desc');

        if (!banner) return;

        let warning = null;

        // Priority 1: Panchak
        if (isPanchak) {
            warning = { title: 'Panchak Active', desc: 'Avoid south travel and roof construction.' };
        }

        // Priority 2: Bhadra (Vishti Karana)
        if (karana && karana.isBhadra) {
            warning = { title: 'Bhadra Active', desc: 'Avoid auspicious ceremonies now.' };
        }

        if (warning) {
            banner.style.display = 'flex';
            if (title) title.textContent = warning.title;
            if (desc) desc.textContent = warning.desc;
        } else {
            banner.style.display = 'none';
        }
    }

    // === TODAY INDICATOR ===
    function updateTodayIndicator() {
        const today = new Date();
        const isToday = currentDate.toDateString() === today.toDateString();
        const dateBar = document.querySelector('.date-bar');
        const todayBadge = document.getElementById('today-badge');

        if (dateBar) {
            dateBar.classList.toggle('not-today', !isToday);
        }
        if (todayBadge) {
            todayBadge.style.display = isToday ? 'none' : 'inline-block';
        }
    }

    // === VARA & DAY QUALITY (First Principles: What should I do today?) ===
    const VARA_DATA = {
        0: { icon: '☀️', deity: 'Lord Surya', deityHi: 'सूर्य देव', goodFor: 'Government work, Leadership, Health', avoid: 'Starting new ventures' },
        1: { icon: '🌙', deity: 'Lord Shiva', deityHi: 'शिव', goodFor: 'Meditation, Fasting, Travel', avoid: 'Major purchases' },
        2: { icon: '🔴', deity: 'Lord Hanuman', deityHi: 'हनुमान', goodFor: 'Property, Land deals, Sports', avoid: 'Starting journeys' },
        3: { icon: '🟢', deity: 'Lord Vishnu', deityHi: 'विष्णु', goodFor: 'Education, Business, Communication', avoid: 'Nothing specific' },
        4: { icon: '🟡', deity: 'Lord Brihaspati', deityHi: 'गुरु', goodFor: 'Weddings, Learning, Religious acts', avoid: 'Lending money' },
        5: { icon: '⚪', deity: 'Goddess Lakshmi', deityHi: 'लक्ष्मी', goodFor: 'Shopping, Entertainment, Romance', avoid: 'Starting construction' },
        6: { icon: '🔵', deity: 'Lord Shani', deityHi: 'शनि', goodFor: 'Oil massage, Iron work, Charity', avoid: 'New beginnings, Travel' }
    };

    function updateGuidance() {
        const { vara, nakshatra, yoga, tithi, dishaShool, isPanchak } = currentPanchang;
        const varaInfo = VARA_DATA[vara.index];

        // Update Vara display
        setText('vara-icon', varaInfo.icon);
        setText('vara-name', vara.name);

        const lang = settings.language || 'en';
        if (lang === 'hi') {
            setText('vara-deity', `${varaInfo.deityHi} का दिन`);
        } else {
            setText('vara-deity', `${varaInfo.deity}'s Day`);
        }

        // Update Day Quality
        let goodFor = varaInfo.goodFor;
        let avoidFor = varaInfo.avoid;

        // Modify based on yoga
        if (yoga.nameEn && (yoga.nameEn.includes('Vyatipata') || yoga.nameEn.includes('Vaidhriti'))) {
            avoidFor = 'New ventures, ' + avoidFor;
        }

        // Modify based on nakshatra
        const travelNakshatras = ['Ashwini', 'Mrigashira', 'Pushya', 'Hasta', 'Anuradha', 'Revati'];
        if (travelNakshatras.includes(nakshatra.nameEn)) {
            goodFor = 'Travel, ' + goodFor;
        }

        // Special tithi modifications
        if (tithi.index === 10 || tithi.index === 25) { // Ekadashi
            goodFor = 'Fasting, Spiritual practices, ' + goodFor;
        }

        // Disha Shool (Travel Prohibition)
        if (dishaShool) {
            avoidFor = `Travel to ${dishaShool.direction}, ` + avoidFor;
        }

        // Panchak Warning
        if (isPanchak) {
            avoidFor = '⚠️ Panchak (South travel, Roof construction), ' + avoidFor;
        }

        setText('good-for', goodFor);
        setText('avoid-for', avoidFor);
    }

    function updateHeader() {
        const hinduDate = document.getElementById('hindu-date');
        const gregorianDate = document.getElementById('gregorian-date');
        const currentCity = document.getElementById('current-city');

        if (hinduDate) {
            hinduDate.textContent = `${currentPanchang.hinduMonth.lunar.name} ${currentPanchang.tithi.fullName}`;
        }
        if (gregorianDate) {
            gregorianDate.textContent = currentDate.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }
        if (currentCity) {
            currentCity.textContent = userLocation.city;
        }
    }

    function updateHero() {
        const { tithi, nakshatra, sunTimes, moonTimes, moonIllumination } = currentPanchang;

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
        const moonrise = document.getElementById('moonrise');
        if (nakshatraName) nakshatraName.textContent = nakshatra.name;
        if (sunrise) sunrise.textContent = sunTimes.sunriseTime;
        if (sunset) sunset.textContent = sunTimes.sunsetTime;
        if (moonrise) moonrise.textContent = moonTimes?.moonriseTime || '--:--';
    }

    // === TODAY'S INSIGHT ===
    function updateInsight() {
        const { tithi, nakshatra, yoga, rahuKalam, auspiciousMuhurats, choghadiya } = currentPanchang;
        const insightTitle = document.getElementById('insight-title');
        const insightDesc = document.getElementById('insight-desc');
        const insightIcon = document.querySelector('.insight-icon');

        if (!insightTitle || !insightDesc) return;

        let insight = generateDailyInsight();
        insightTitle.textContent = insight.title;
        insightDesc.textContent = insight.desc;
        if (insightIcon) insightIcon.textContent = insight.icon;
    }

    function generateDailyInsight() {
        const { tithi, nakshatra, yoga, rahuKalam, auspiciousMuhurats, choghadiya, vara } = currentPanchang;
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        const isToday = currentDate.toDateString() === now.toDateString();

        // Priority 1: Check if in Rahu Kalam right now
        if (isToday && currentHour >= rahuKalam.start && currentHour < rahuKalam.end) {
            return {
                icon: 'warning',
                title: 'Avoid new ventures now',
                desc: `Rahu Kalam ends at ${rahuKalam.endTime}. Wait before starting important tasks.`
            };
        }

        // Priority 2: Special Tithis
        const specialTithis = {
            10: { title: 'Ekadashi - Day of fasting', desc: 'Considered auspicious for spiritual practices and fasting.' },
            14: { title: 'Purnima - Full Moon', desc: 'Excellent for meditation, charity, and new beginnings.' },
            29: { title: 'Amavasya - New Moon', desc: 'Good for introspection, ancestor worship (Pitru Tarpan).' },
            3: { title: 'Chaturthi - Ganesh Worship', desc: 'Auspicious day for Lord Ganesha prayers.' },
            8: { title: 'Ashtami - Day of Shakti', desc: 'Good for Durga/Shakti worship and spiritual practices.' }
        };

        if (specialTithis[tithi.index]) {
            return {
                icon: 'star',
                ...specialTithis[tithi.index]
            };
        }

        // Priority 3: Yoga-based guidance
        if (!yoga.good) {
            return {
                icon: 'info',
                title: `${yoga.nameEn} Yoga - Exercise caution`,
                desc: 'Not ideal for major decisions. Good for routine work and planning.'
            };
        }

        // Priority 4: Upcoming Rahu Kalam warning
        if (isToday && currentHour < rahuKalam.start) {
            const minsToRahu = Math.floor((rahuKalam.start - currentHour) * 60);
            if (minsToRahu <= 60) {
                return {
                    icon: 'schedule',
                    title: `Rahu Kalam starts in ${minsToRahu} min`,
                    desc: `Complete important tasks before ${rahuKalam.startTime}.`
                };
            }
        }

        // Priority 5: Good yoga encouragement
        if (yoga.good) {
            const positiveYogas = ['Siddhi', 'Shubha', 'Amrita', 'Saubhagya'];
            if (positiveYogas.includes(yoga.nameEn)) {
                return {
                    icon: 'lightbulb',
                    title: 'Excellent day for new ventures',
                    desc: `${yoga.nameEn} Yoga favors success. Start important projects today.`
                };
            }
        }

        // Priority 6: Brahma Muhurta recommendation
        if (isToday && currentHour < 7) {
            return {
                icon: 'wb_twilight',
                title: 'Brahma Muhurta is special',
                desc: `Best time for meditation: ${auspiciousMuhurats.brahmaMuhurta.startTime} - ${auspiciousMuhurats.brahmaMuhurta.endTime}`
            };
        }

        // Default: General positive message
        return {
            icon: 'lightbulb',
            title: 'Good day for steady progress',
            desc: 'Focus on routine tasks and planning. Check choghadiya for best times.'
        };
    }

    function updateTiming() {
        const { sunTimes, choghadiya, rahuKalam, yamagandam, gulikaKalam, auspiciousMuhurats } = currentPanchang;
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        const isToday = currentDate.toDateString() === now.toDateString();

        // Render Visual Timeline
        renderTimeline(sunTimes, choghadiya.day, rahuKalam);

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
                statusDesc.textContent = `${currentChog.name} (${currentChog.nameEn})`;
                // Countdown handled by real-time loop
            }
        } else {
            // Check Rahu Kalam
            const inRahu = isToday && currentHour >= rahuKalam.start && currentHour < rahuKalam.end;
            if (inRahu) {
                statusBanner.className = 'status-banner avoid';
                if (statusIcon) statusIcon.textContent = 'warning';
                if (statusTitle) statusTitle.textContent = 'Rahu Kalam';
                if (statusDesc) {
                    statusDesc.textContent = 'Avoid new ventures';
                }
            }
        }

        // Update good times list
        updateGoodTimes(auspiciousMuhurats, choghadiya);
        updateAvoidTimes(rahuKalam, yamagandam, gulikaKalam);
    }

    function renderTimeline(sunTimes, dayChoghadiyas, rahuKalam) {
        const bar = document.getElementById('timeline-bar');
        const sunriseLabel = document.getElementById('timeline-sunrise');
        const sunsetLabel = document.getElementById('timeline-sunset');

        if (!bar) return;

        if (sunriseLabel) sunriseLabel.textContent = sunTimes.sunriseTime;
        if (sunsetLabel) sunsetLabel.textContent = sunTimes.sunsetTime;

        const dayDuration = sunTimes.sunset - sunTimes.sunrise;

        // Create segments
        let html = '';

        // 1. Choghadiya Segments (Background)
        dayChoghadiyas.forEach(slot => {
            const startPct = ((slot.start - sunTimes.sunrise) / dayDuration) * 100;
            const widthPct = ((slot.end - slot.start) / dayDuration) * 100;
            const type = slot.good ? 'good' : 'bad'; // can use specific good/bad or neutral

            // Map specific names to colors if needed, or just good/bad
            let className = 'neutral';
            if (slot.good) className = 'good';
            if (!slot.good) className = 'bad';

            html += `<div class="timeline-segment ${className}" style="width: ${widthPct}%" title="${slot.name} (${slot.startTime} - ${slot.endTime})" aria-label="${slot.nameEn || slot.name}: ${slot.startTime} to ${slot.endTime}, ${slot.good ? 'auspicious' : 'inauspicious'}">
                ${slot.name}
            </div>`;
        });

        bar.innerHTML = html;

        // Overlay Rahu Kalam? 
        // For V1, the Choghadiya segments are good enough as base. 
        // Ideally we'd show Rahu Kalam as a marker or overlay, but CSS-wise simple segments are safer.
        // Let's stick to Choghadiya segments for the bar background.
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

    function updateAvoidTimes(rahu, yama, gulika) {
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
            <div class="time-row">
                <span class="time-name">Gulika Kalam</span>
                <span class="time-range">${gulika.startTime} - ${gulika.endTime}</span>
            </div>
        `;
    }

    function updateUpcoming() {
        const todayEvents = document.getElementById('today-events');
        const upcomingList = document.getElementById('upcoming-festivals');

        let upcoming;
        try {
            upcoming = getCachedFestivals();
        } catch (err) {
            console.error('[Panchang] Festival cache error:', err.message);
            upcoming = [];
        }

        // Today's events
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);

        const eventsToday = upcoming.filter(f => {
            const festDate = new Date(f.gregorianDate);
            festDate.setHours(0, 0, 0, 0);
            return festDate.getTime() === today.getTime();
        });

        if (todayEvents) {
            todayEvents.innerHTML = eventsToday.map(e => `
                <div class="event-card">
                    <span class="event-icon">${e.icon || '🎉'}</span>
                    <div class="event-info">
                        <span class="event-name">${e.name}</span>
                        <span class="event-name-en">${e.nameEn}</span>
                        ${e.significance ? `<p class="event-desc">${e.significance}</p>` : ''}
                    </div>
                </div>
            `).join('');
        }

        // Upcoming (exclude today)
        const futureEvents = upcoming.filter(f => {
            const festDate = new Date(f.gregorianDate);
            festDate.setHours(0, 0, 0, 0);
            return festDate.getTime() > today.getTime();
        }).slice(0, 5);

        if (upcomingList) {
            if (futureEvents.length === 0) {
                const lang = settings.language || 'en';
                const msg = lang === 'hi'
                    ? 'अगले 6 महीनों में कोई त्यौहार नहीं'
                    : 'No upcoming festivals in next 6 months';
                upcomingList.innerHTML = `<div class="no-events">${msg}</div>`;
            } else {
                upcomingList.innerHTML = futureEvents.map(f => {
                    const dayDiff = Math.round((f.gregorianDate - today) / 86400000);
                    const lang = settings.language || 'en';
                    let chip = '';
                    if (dayDiff === 1) chip = `<span class="today-badge">${lang === 'hi' ? 'कल' : 'Tomorrow'}</span>`;
                    else if (dayDiff <= 7) chip = `<span class="today-badge">${dayDiff} ${lang === 'hi' ? 'दिन में' : 'days'}</span>`;

                    return `
                    <div class="upcoming-item">
                        <div class="upcoming-date">
                            <span class="upcoming-day">${f.gregorianDate.getDate()}</span>
                            <span class="upcoming-month">${f.gregorianDate.toLocaleDateString('en', { month: 'short' })}</span>
                        </div>
                        <div class="upcoming-info">
                            <span class="upcoming-name">${f.icon || '🎉'} ${f.nameEn}</span>
                            ${f.significance ? `<span class="upcoming-significance">${f.significance}</span>` : ''}
                            ${chip}
                        </div>
                    </div>
                `;
                }).join('');
            }
        }
    }

    function updateDetails() {
        const { vara, tithi, nakshatra, yoga, karana, samvatsara, hinduMonth, ayana, sunTimes } = currentPanchang;

        // Vara (Weekday)
        const varaInfo = VARA_DATA[vara.index];
        const lang = settings.language || 'en';
        let lordName = lang === 'hi' ? varaInfo.deityHi : varaInfo.deity;
        let dayName = lang === 'hi' ? vara.name : vara.nameEn;

        setText('d-vara', dayName);
        setText('d-vara-lord', lordName);

        // Core Limbs
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

        // Update Hora
        updateHora(sunTimes);

        // Update Graha Sthiti
        updateGrahaSthiti();

        // Update Mantra
        updateMantra(currentPanchang.vara.index);
    }

    function updateHora(sunTimes) {
        const container = document.getElementById('hora-display');
        if (!container) return;

        // Chaldean order (correct planetary hora sequence)
        // Saturn(0) → Jupiter(1) → Mars(2) → Sun(3) → Venus(4) → Mercury(5) → Moon(6)
        const lords = [
            { name: 'Saturn', nameHi: 'शनि', icon: '🪐' },
            { name: 'Jupiter', nameHi: 'गुरु', icon: '📿' },
            { name: 'Mars', nameHi: 'मंगल', icon: '⚔️' },
            { name: 'Sun', nameHi: 'सूर्य', icon: '☀️' },
            { name: 'Venus', nameHi: 'शुक्र', icon: '💎' },
            { name: 'Mercury', nameHi: 'बुध', icon: '☿️' },
            { name: 'Moon', nameHi: 'चन्द्र', icon: '🌙' }
        ];

        // Day lords in Chaldean array index:
        // Sun=3, Mon=6, Tue=2, Wed=5, Thu=1, Fri=4, Sat=0
        const dayLordIndex = [3, 6, 2, 5, 1, 4, 0];

        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        const dayIndex = currentDate.getDay();

        const dayDuration = sunTimes.sunset - sunTimes.sunrise;
        const nightDuration = 24 - dayDuration;
        const dayHora = dayDuration / 12;
        const nightHora = nightDuration / 12;

        let horaIndex, isDay;
        if (currentHour >= sunTimes.sunrise && currentHour < sunTimes.sunset) {
            // Daytime hora
            horaIndex = Math.min(Math.floor((currentHour - sunTimes.sunrise) / dayHora), 11);
            isDay = true;
        } else {
            // Nighttime hora — starts after sunset, continues to next sunrise
            let nightElapsed;
            if (currentHour >= sunTimes.sunset) {
                nightElapsed = currentHour - sunTimes.sunset;
            } else {
                // After midnight, before sunrise
                nightElapsed = (24 - sunTimes.sunset) + currentHour;
            }
            horaIndex = Math.min(Math.floor(nightElapsed / nightHora), 11);
            isDay = false;
        }

        // First day hora = day lord. Night starts at hora 12 (index 0 of night = dayLord + 12)
        const startIndex = dayLordIndex[dayIndex];
        const offset = isDay ? horaIndex : (12 + horaIndex);
        const currentLordIndex = (startIndex + offset) % 7;
        const currentLord = lords[currentLordIndex];

        const horaEnd = isDay
            ? VedicEngine.hoursToTime(sunTimes.sunrise + (horaIndex + 1) * dayHora)
            : VedicEngine.hoursToTime(sunTimes.sunset + (horaIndex + 1) * nightHora);

        container.innerHTML = `
            <div class="hora-current">
                <span class="hora-planet-icon">${currentLord.icon}</span>
                <div class="hora-info">
                    <span class="hora-planet-name">${currentLord.nameHi} (${currentLord.name}) Hora</span>
                    <span class="hora-time">${isDay ? 'Day' : 'Night'} • till ${horaEnd}</span>
                </div>
            </div>
        `;
    }

    function updateGrahaSthiti() {
        const container = document.getElementById('graha-sthiti');
        if (!container || !VedicEngine) return;

        // Use SIDEREAL positions (subtract ayanamsa)
        const ayanamsa = currentPanchang.ayanamsa || 0;
        const sunLong = VedicEngine.getSunLongitude(currentDate) - ayanamsa;
        const moonLong = VedicEngine.getMoonLongitude(currentDate) - ayanamsa;

        const getRashi = (lon) => {
            const normLon = ((lon % 360) + 360) % 360;
            const index = Math.floor(normLon / 30);
            const rashis = ['Mesh', 'Vrishabh', 'Mithun', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchik', 'Dhanu', 'Makar', 'Kumbha', 'Meena'];
            const deg = Math.floor(normLon % 30);
            return { name: rashis[index], deg };
        };

        const sun = getRashi(sunLong);
        const moon = getRashi(moonLong);

        container.innerHTML = `
            <div class="graha-item">
                <span class="graha-icon">☀️</span>
                <span class="graha-name">Sun</span>
                <span class="graha-rashi">${sun.name}</span>
                <span class="graha-degree">${sun.deg}°</span>
            </div>
            <div class="graha-item">
                <span class="graha-icon">🌙</span>
                <span class="graha-name">Moon</span>
                <span class="graha-rashi">${moon.name}</span>
                <span class="graha-degree">${moon.deg}°</span>
            </div>
        `;
    }

    function updateMantra(dayIndex) {
        const container = document.getElementById('daily-mantra');
        if (!container) return;

        const mantras = [
            { deity: 'Surya', mantra: 'Om Suryaya Namah' },
            { deity: 'Shiva', mantra: 'Om Namah Shivaya' },
            { deity: 'Hanuman', mantra: 'Om Hanumate Namah' },
            { deity: 'Mercury', mantra: 'Om Budhaya Namah' },
            { deity: 'Vishnu', mantra: 'Om Namo Bhagavate Vasudevaya' },
            { deity: 'Lakshmi', mantra: 'Om Mahalakshmyai Namah' },
            { deity: 'Shani', mantra: 'Om Sham Shanicharaya Namah' }
        ];

        const m = mantras[dayIndex];

        container.innerHTML = `
            <div class="mantra-deity">
                <span class="mantra-deity-icon">🕉️</span>
                <b>${m.deity}</b>
            </div>
            <p>${m.mantra}</p>
        `;
    }

    function applyTranslations() {
        const lang = settings.language || 'en';
        const dict = TRANSLATIONS[lang];
        if (!dict) return;

        // Helper to safely set text
        const safeSet = (id, key) => {
            const el = document.getElementById(id);
            if (el && dict[key]) el.textContent = dict[key];
        };

        // Static labels
        safeSet('label-sunrise', 'Sunrise');
        safeSet('label-good-for', 'Good for');
        safeSet('label-avoid', 'Avoid');
        // Need to add IDs to HTML labels if not present
        // Actually, many labels in HTML don't have IDs. 
        // Strategy: dynamic content updates should handle translation, static content needs IDs.
        // For V1, let's just translate the dynamic headers we control.

        // Update Section Headers
        // We can query selector by class and text, but that's brittle.
        // Let's rely on specific IDs or just update the variable parts.

        // Vara Name is handled in updateGuidance
        // Tithi Name is handled in updateHero

        // Update Choghadiya Tabs
        document.querySelectorAll('.chog-tab').forEach(tab => {
            if (tab.dataset.period === 'day') tab.textContent = dict['Day'];
            if (tab.dataset.period === 'night') tab.textContent = dict['Night'];
        });

        // Update More Details Button
        const expandBtn = document.querySelector('#expand-details span');
        if (expandBtn) expandBtn.textContent = dict['More Details'];
    }

    function getText(key) {
        const lang = settings.language || 'en';
        return TRANSLATIONS[lang]?.[key] || key;
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
        // Date navigation (uses navigateDate for slide animation)
        const prevBtn = document.getElementById('prev-day');
        const nextBtn = document.getElementById('next-day');
        const dateCenter = document.getElementById('date-center');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateDate(-1, 'slide-right'));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateDate(1, 'slide-left'));
        }

        if (dateCenter) {
            dateCenter.addEventListener('click', () => {
                if (navigator.vibrate) navigator.vibrate(10);
                currentDate = new Date();
                updateDisplay();
            });
        }

        // Share button
        document.getElementById('share-btn')?.addEventListener('click', sharePanchang);

        // Expand details
        document.getElementById('expand-details')?.addEventListener('click', () => {
            const btn = document.getElementById('expand-details');
            const content = document.getElementById('details-content');

            btn.classList.toggle('active');
            const isExpanded = content.style.display !== 'none';
            content.style.display = isExpanded ? 'none' : 'block';
            btn.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                updateChoghadiya('day');
            }
        });

        // Choghadiya tabs
        document.querySelectorAll('.chog-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.chog-tab').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                updateChoghadiya(tab.dataset.period);
            });
        });

        // --- SINGLE SETTINGS MODAL ---
        const settingsModal = document.getElementById('settings-modal');

        // Open modal: Settings button OR location chip
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            // Populate settings
            const langSelect = document.getElementById('language-select');
            if (langSelect) langSelect.value = settings.language;
            settingsModal?.classList.add('active');
        });
        document.getElementById('location-chip')?.addEventListener('click', () => {
            const langSelect = document.getElementById('language-select');
            if (langSelect) langSelect.value = settings.language;
            settingsModal?.classList.add('active');
        });

        // --- CALENDAR MODAL ---
        const calendarModal = document.getElementById('calendar-modal');
        let calDate = new Date();

        document.getElementById('calendar-btn')?.addEventListener('click', () => {
            calDate = new Date(currentDate); // Start at current view date
            renderCalendar(calDate);
            calendarModal?.classList.add('active');
        });

        document.getElementById('close-calendar')?.addEventListener('click', () => {
            calendarModal?.classList.remove('active');
        });

        document.getElementById('cal-prev')?.addEventListener('click', () => {
            calDate.setMonth(calDate.getMonth() - 1);
            renderCalendar(calDate);
        });

        document.getElementById('cal-next')?.addEventListener('click', () => {
            calDate.setMonth(calDate.getMonth() + 1);
            renderCalendar(calDate);
        });

        // Close modal
        document.getElementById('close-settings')?.addEventListener('click', () => {
            settingsModal?.classList.remove('active');
        });

        // Click outside to close
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });

        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const activeModal = document.querySelector('.modal-overlay.active .modal-content');
            if (!activeModal) return;
            const focusable = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        // --- DYNAMIC CITY GRID ---
        populateCityGrid();

        // Auto location detection
        document.getElementById('detect-location')?.addEventListener('click', detectLocation);

        // Ayanamsa change
        document.getElementById('ayanamsa-select')?.addEventListener('change', (e) => {
            settings.ayanamsa = e.target.value;
            saveSettings();
            updateDisplay();
        });
    }

    // === CALENDAR LOGIC ===
    function renderCalendar(date) {
        const grid = document.getElementById('calendar-grid');
        const header = document.getElementById('cal-month-year');
        if (!grid || !header) return;

        const year = date.getFullYear();
        const month = date.getMonth();

        header.textContent = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay(); // 0 = Sun

        let html = '';

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            html += '<div class="cal-day empty"></div>';
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const dayDate = new Date(year, month, d);
            // Check if selected
            const isSelected = dayDate.toDateString() === currentDate.toDateString();
            const isToday = dayDate.toDateString() === new Date().toDateString();

            // Simple data check (mock for now, ideally fetch panchang for each day)
            // For V1, just show basic numbers. Can add dots for Ekadashi/Purnima if cache available.

            const classes = ['cal-day'];
            if (isSelected) classes.push('selected');
            if (isToday) classes.push('today');

            html += `<div class="${classes.join(' ')}" data-date="${dayDate.toISOString()}">
                <span class="cal-day-num">${d}</span>
                <!-- <div class="cal-day-dot"></div> -->
            </div>`;
        }

        grid.innerHTML = html;

        // Add click listeners & tabindex for keyboard nav
        const dayEls = grid.querySelectorAll('.cal-day:not(.empty)');
        dayEls.forEach((el, idx) => {
            el.setAttribute('tabindex', el.classList.contains('selected') ? '0' : '-1');
            el.setAttribute('role', 'gridcell');
            el.addEventListener('click', () => selectCalendarDay(el));
            el.addEventListener('keydown', (e) => handleCalendarKeydown(e, dayEls, idx));
        });

        // Focus the selected day (or first day)
        const selectedDay = grid.querySelector('.cal-day.selected') || dayEls[0];
        if (selectedDay) selectedDay.setAttribute('tabindex', '0');
    }

    function selectCalendarDay(el) {
        const newD = new Date(el.dataset.date);
        currentDate = newD;
        updateDisplay();
        document.getElementById('calendar-modal').classList.remove('active');
    }

    function handleCalendarKeydown(e, dayEls, currentIdx) {
        let targetIdx = currentIdx;
        switch (e.key) {
            case 'ArrowRight': targetIdx = Math.min(dayEls.length - 1, currentIdx + 1); break;
            case 'ArrowLeft': targetIdx = Math.max(0, currentIdx - 1); break;
            case 'ArrowDown': targetIdx = Math.min(dayEls.length - 1, currentIdx + 7); break;
            case 'ArrowUp': targetIdx = Math.max(0, currentIdx - 7); break;
            case 'Enter':
            case ' ': e.preventDefault(); selectCalendarDay(dayEls[currentIdx]); return;
            case 'Escape': document.getElementById('calendar-modal').classList.remove('active'); return;
            default: return;
        }
        e.preventDefault();
        dayEls[currentIdx].setAttribute('tabindex', '-1');
        dayEls[targetIdx].setAttribute('tabindex', '0');
        dayEls[targetIdx].focus();
    }



    // === DYNAMIC CITY BUTTONS ===
    function populateCityGrid() {
        const grid = document.getElementById('city-grid');
        if (!grid) return;

        grid.innerHTML = '';
        for (const [key, city] of Object.entries(CITIES)) {
            const btn = document.createElement('button');
            btn.className = 'city-btn';
            btn.textContent = city.name;
            btn.dataset.lat = city.lat;
            btn.dataset.lon = city.lon;
            btn.addEventListener('click', () => {
                userLocation.lat = city.lat;
                userLocation.lon = city.lon;
                userLocation.city = city.name;
                saveSettings();
                closeAllModals();
                updateDisplay();
                // Update city display
                const cityEl = document.getElementById('current-city');
                if (cityEl) cityEl.textContent = city.name;
            });
            grid.appendChild(btn);
        }
    }

    function detectLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation not supported by your browser');
            return;
        }

        const btn = document.getElementById('detect-location');
        if (btn) btn.textContent = 'Detecting...';

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLocation.lat = pos.coords.latitude;
                userLocation.lon = pos.coords.longitude;
                userLocation.city = findNearestCity(pos.coords.latitude, pos.coords.longitude);
                saveSettings();
                closeAllModals();
                updateDisplay();

                // Update city display
                const cityEl = document.getElementById('current-city');
                if (cityEl) cityEl.textContent = userLocation.city;

                // Reset button
                if (btn) btn.innerHTML = '<span class="material-symbols-rounded">my_location</span> Detect My Location';
            },
            (error) => {
                console.error('Location error:', error);
                alert('Could not detect location. Please select a city manually.');
                if (btn) btn.innerHTML = '<span class="material-symbols-rounded">my_location</span> Detect My Location';
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        const sheet = document.getElementById('info-sheet-overlay');
        if (sheet) sheet.classList.remove('active');
    }

    // === INFO BOTTOM SHEET ===
    function showExplainer(key) {
        const data = PANCHANG_EXPLAINERS[key];
        if (!data) return;
        const title = document.getElementById('sheet-title');
        const body = document.getElementById('sheet-body');
        const overlay = document.getElementById('info-sheet-overlay');
        if (!title || !body || !overlay) return;

        title.textContent = data.term;
        body.innerHTML = `
            <div class="sheet-section">
                <div class="sheet-section-label">What is it?</div>
                <div class="sheet-section-text">${data.what}</div>
            </div>
            <div class="sheet-section">
                <div class="sheet-section-label">Why does it matter?</div>
                <div class="sheet-section-text">${data.why}</div>
            </div>
            <div class="sheet-section">
                <div class="sheet-section-label">Quick fact</div>
                <div class="sheet-section-text">${data.fact}</div>
            </div>
        `;
        overlay.classList.add('active');
    }

    // Info button click delegation
    document.addEventListener('click', (e) => {
        const infoBtn = e.target.closest('.info-btn');
        if (infoBtn) {
            e.stopPropagation();
            showExplainer(infoBtn.dataset.explain);
            return;
        }
        const overlay = e.target.closest('#info-sheet-overlay');
        if (overlay && !e.target.closest('.bottom-sheet')) {
            overlay.classList.remove('active');
        }
    });

    // === FESTIVAL CACHE ===
    let festivalCache = { key: null, data: null };

    function getCachedFestivals() {
        const cacheKey = `${currentDate.getMonth()}-${currentDate.getFullYear()}-${userLocation.lat}-${userLocation.lon}`;
        if (festivalCache.key === cacheKey && festivalCache.data) {
            return festivalCache.data;
        }
        const data = getNextFestivals();
        festivalCache = { key: cacheKey, data: data };
        return data;
    }

    // === SWIPE NAVIGATION ===
    function setupSwipe() {
        const container = document.querySelector('.app-container');
        if (!container) return;

        let startX = 0;
        let startY = 0;
        let swiping = false;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            swiping = true;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!swiping) return;
            swiping = false;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - startX;
            const diffY = endY - startY;

            // Only trigger if horizontal swipe is dominant and > 60px
            if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                if (diffX < 0) {
                    // Swipe left → next day
                    navigateDate(1, 'slide-left');
                } else {
                    // Swipe right → previous day
                    navigateDate(-1, 'slide-right');
                }
            }
        }, { passive: true });
    }

    // === NAVIGATION ===
    let isNavigating = false;

    function navigateDate(delta, animClass) {
        if (isNavigating) return;
        isNavigating = true;

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);

        const container = document.querySelector('.app-container');
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + delta);
        currentDate = newDate;

        if (container && animClass) {
            container.classList.remove('slide-left', 'slide-right');
            void container.offsetWidth; // Force reflow
            container.classList.add(animClass);
            setTimeout(() => {
                container.classList.remove(animClass);
                isNavigating = false;
            }, 300); // Match animation duration
        } else {
            isNavigating = false;
        }

        updateDisplay();
    }

    // === SHARE FEATURE ===
    function sharePanchang() {
        if (!currentPanchang || currentPanchang.error) return;

        const dateStr = currentDate.toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });

        const text = [
            `🙏 पञ्चाङ्ग — ${dateStr}`,
            `📍 ${userLocation.city}`,
            '',
            `🗓 ${currentPanchang.vara?.name || ''} (${currentPanchang.vara?.nameEn || ''})`,
            `🌙 तिथि: ${currentPanchang.tithi?.fullName || ''}`,
            `⭐ नक्षत्र: ${currentPanchang.nakshatra?.name || ''}`,
            `🧘 योग: ${currentPanchang.yoga?.name || ''}`,
            `📿 करण: ${currentPanchang.karana?.name || ''}`,
            '',
            `🌅 Sunrise: ${currentPanchang.sunTimes?.sunriseTime || ''}`,
            `🌇 Sunset: ${currentPanchang.sunTimes?.sunsetTime || ''}`,
            '',
            `— via पञ्चाङ्ग App`
        ].join('\n');

        if (navigator.share) {
            navigator.share({
                title: `पञ्चाङ्ग — ${dateStr}`,
                text: text
            }).catch(() => { });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                showToast('Copied to clipboard! 📋');
            }).catch(() => {
                showToast('Could not share');
            });
        }
    }

    function showToast(message) {
        let toast = document.querySelector('.share-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'share-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // === START ===
    init();
    setupSwipe();
});

