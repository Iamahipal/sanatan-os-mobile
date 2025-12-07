/**
 * Panchang App - Next Generation
 * Using VedicEphemeris for NASA-grade calculations
 */

document.addEventListener('DOMContentLoaded', () => {
    // === CONSTANTS ===
    const WEEKDAYS = {
        0: { name: 'रविवार', english: 'Sunday', deity: 'Lord Surya', color: 'linear-gradient(135deg, #FF6B35, #FF8F5E)', colorName: 'Orange (नारंगी)' },
        1: { name: 'सोमवार', english: 'Monday', deity: 'Lord Chandra', color: 'linear-gradient(135deg, #E8E8E8, #FFFFFF)', colorName: 'White (सफ़ेद)' },
        2: { name: 'मंगलवार', english: 'Tuesday', deity: 'Lord Hanuman', color: 'linear-gradient(135deg, #FF0000, #FF4444)', colorName: 'Red (लाल)' },
        3: { name: 'बुधवार', english: 'Wednesday', deity: 'Lord Ganesha', color: 'linear-gradient(135deg, #4CAF50, #66BB6A)', colorName: 'Green (हरा)' },
        4: { name: 'गुरुवार', english: 'Thursday', deity: 'Lord Vishnu', color: 'linear-gradient(135deg, #FFD700, #FFEB3B)', colorName: 'Yellow (पीला)' },
        5: { name: 'शुक्रवार', english: 'Friday', deity: 'Goddess Lakshmi', color: 'linear-gradient(135deg, #E0E0E0, #FFFFFF)', colorName: 'White (सफ़ेद)' },
        6: { name: 'शनिवार', english: 'Saturday', deity: 'Lord Shani', color: 'linear-gradient(135deg, #1A237E, #3949AB)', colorName: 'Blue (नीला)' }
    };

    // Tara Bala descriptions
    const TARA_DESCRIPTIONS = {
        0: 'Caution advised today. Take extra care with health and avoid risky activities.',
        1: 'Excellent day for financial matters, investments, and new beginnings.',
        2: 'Challenging energy today. Postpone important decisions if possible.',
        3: 'Safe and stable day. Good for routine activities and family matters.',
        4: 'Minor obstacles may arise. Practice patience and persistence.',
        5: 'Great day for achievements, learning, and spiritual practices.',
        6: 'Avoid major undertakings. Focus on rest and introspection.',
        7: 'Friendly energy supports social activities and collaborations.',
        8: 'Best day of the cycle! Ideal for all important activities.'
    };

    // === FESTIVALS DATA ===
    const FESTIVALS = {
        '2024-12-07': [{ name: 'शुक्ल पञ्चमी', type: 'Tithi', icon: '🌙' }],
        '2024-12-11': [{ name: 'मोक्षदा एकादशी', type: 'Ekadashi', icon: '🕉️' }],
        '2024-12-15': [{ name: 'पूर्णिमा', type: 'Purnima', icon: '🌕' }],
        '2024-12-25': [{ name: 'क्रिसमस', type: 'Holiday', icon: '🎄' }],
        '2024-12-26': [{ name: 'मार्गशीर्ष अमावस्या', type: 'Amavasya', icon: '🌑' }],
        '2025-01-01': [{ name: 'नव वर्ष', type: 'Holiday', icon: '🎉' }],
        '2025-01-14': [{ name: 'मकर संक्रांति', type: 'Festival', icon: '🪁' }],
        '2025-01-26': [{ name: 'गणतंत्र दिवस', type: 'Holiday', icon: '🇮🇳' }],
        '2025-02-26': [{ name: 'महाशिवरात्रि', type: 'Festival', icon: '🔱' }],
        '2025-03-14': [{ name: 'होली', type: 'Festival', icon: '🎨' }],
        '2025-04-06': [{ name: 'राम नवमी', type: 'Festival', icon: '🏹' }],
        '2025-04-14': [{ name: 'बैसाखी', type: 'Festival', icon: '🌾' }],
        '2025-08-15': [{ name: 'स्वतंत्रता दिवस', type: 'Holiday', icon: '🇮🇳' }],
        '2025-08-16': [{ name: 'जन्माष्टमी', type: 'Festival', icon: '🙏' }],
        '2025-10-02': [{ name: 'गांधी जयंती', type: 'Holiday', icon: '🕊️' }],
        '2025-10-20': [{ name: 'दशहरा', type: 'Festival', icon: '🏹' }],
        '2025-10-29': [{ name: 'करवा चौथ', type: 'Vrat', icon: '🌙' }],
        '2025-11-01': [{ name: 'दीपावली', type: 'Festival', icon: '🪔' }],
        '2025-12-07': [{ name: 'कार्तिक पूर्णिमा', type: 'Purnima', icon: '🌕' }],
        '2025-12-08': [{ name: 'कृष्ण प्रतिपदा', type: 'Tithi', icon: '🌙' }]
    };

    // === STATE ===
    let currentDate = new Date();
    let location = { lat: 28.6139, lon: 77.2090, city: 'New Delhi' };
    let birthNakshatra = null;
    let currentPanchang = null;

    // === DOM ELEMENTS ===
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');
    const gregorianDateEl = document.getElementById('gregorian-date');
    const hinduDateEl = document.getElementById('hindu-date');
    const locationBtn = document.getElementById('location-btn');
    const locationModal = document.getElementById('location-modal');
    const closeLocationBtn = document.getElementById('close-location');
    const autoLocationBtn = document.getElementById('auto-location');
    const choghadiyaGrid = document.getElementById('choghadiya-grid');
    const eventsList = document.getElementById('events-list');

    // Tara Bala elements
    const birthNakshatraSelect = document.getElementById('birth-nakshatra');
    const saveNakshatraBtn = document.getElementById('save-nakshatra');
    const changeNakshatraBtn = document.getElementById('change-nakshatra');
    const taraSetup = document.getElementById('tara-setup');
    const taraResult = document.getElementById('tara-result');

    // === INITIALIZE ===
    function init() {
        loadSettings();
        populateNakshatraSelect();
        updateDisplay();
        setupEventListeners();
        lucide.createIcons();
    }

    // === SETTINGS ===
    function loadSettings() {
        const savedLocation = localStorage.getItem('panchang_location');
        if (savedLocation) {
            location = JSON.parse(savedLocation);
        }

        const savedNakshatra = localStorage.getItem('panchang_birth_nakshatra');
        if (savedNakshatra) {
            birthNakshatra = parseInt(savedNakshatra, 10);
        }
    }

    function saveLocation() {
        localStorage.setItem('panchang_location', JSON.stringify(location));
    }

    function saveBirthNakshatra(index) {
        birthNakshatra = index;
        localStorage.setItem('panchang_birth_nakshatra', index.toString());
    }

    // === POPULATE NAKSHATRA SELECT ===
    function populateNakshatraSelect() {
        if (!birthNakshatraSelect) return;

        VedicEphemeris.NAKSHATRAS.forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${name} (${VedicEphemeris.NAKSHATRAS_EN[index]})`;
            birthNakshatraSelect.appendChild(option);
        });

        // Show appropriate view
        if (birthNakshatra !== null) {
            taraSetup.style.display = 'none';
            taraResult.style.display = 'block';
        }
    }

    // === DATE FORMATTING ===
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    }

    function getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    function getHinduMonth(date) {
        const month = (date.getMonth() + 9) % 12;
        return VedicEphemeris.HINDU_MONTHS[month];
    }

    // === UPDATE DISPLAY ===
    function updateDisplay() {
        // Get complete Panchang using ephemeris
        currentPanchang = VedicEphemeris.getPanchang(currentDate, location.lat, location.lon);

        // Date display
        gregorianDateEl.textContent = formatDate(currentDate);

        // Hindu date
        const hinduMonth = getHinduMonth(currentDate);
        hinduDateEl.textContent = `${hinduMonth} ${currentPanchang.tithi.fullName}`;

        // Moon phase
        updateMoonPhase(currentPanchang.moonIllumination, currentPanchang.tithi.index);
        document.getElementById('tithi-name').textContent = currentPanchang.tithi.fullName;
        document.getElementById('moon-percent').textContent = `${currentPanchang.moonIllumination}% Illuminated`;

        // Panchang elements
        document.getElementById('tithi-value').textContent = currentPanchang.tithi.fullName;
        document.getElementById('nakshatra-value').textContent = currentPanchang.nakshatra.name;
        document.getElementById('yoga-value').textContent = currentPanchang.yoga.name;
        document.getElementById('karana-value').textContent = currentPanchang.karana.name;

        // Day
        const dayData = WEEKDAYS[currentDate.getDay()];
        document.getElementById('var-value').textContent = dayData.name;
        document.getElementById('var-deity').textContent = dayData.deity;

        // Auspicious color
        document.getElementById('auspicious-color').style.background = dayData.color;
        document.getElementById('color-name').textContent = dayData.colorName;

        // Sun/Moon timings
        document.getElementById('sunrise').textContent = currentPanchang.sunTimes.sunriseTime;
        document.getElementById('sunset').textContent = currentPanchang.sunTimes.sunsetTime;

        // Moonrise/set (approximation based on tithi)
        const lunation = currentPanchang.tithi.angle / 360;
        document.getElementById('moonrise').textContent = hoursToTime((6 + lunation * 24) % 24);
        document.getElementById('moonset').textContent = hoursToTime((18 + lunation * 24) % 24);

        // Muhurats
        updateMuhurats();

        // Choghadiya
        renderChoghadiya('day');

        // Tara Bala
        updateTaraBala();

        // Events
        renderEvents();

        lucide.createIcons();
    }

    function hoursToTime(hours) {
        if (hours < 0) hours += 24;
        if (hours >= 24) hours -= 24;
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    // === MOON PHASE ===
    function updateMoonPhase(illumination, tithiIndex) {
        const shadow = document.getElementById('moon-shadow');
        if (!shadow) return;

        const isWaxing = tithiIndex < 15;

        if (isWaxing) {
            // Waxing: shadow on right
            shadow.style.width = `${100 - illumination}%`;
            shadow.style.right = '0';
            shadow.style.left = 'auto';
        } else {
            // Waning: shadow on left
            shadow.style.width = `${100 - illumination}%`;
            shadow.style.left = '0';
            shadow.style.right = 'auto';
        }
    }

    // === MUHURATS ===
    function updateMuhurats() {
        const sunrise = currentPanchang.sunTimes.sunrise;
        const sunset = currentPanchang.sunTimes.sunset;
        const dayDuration = sunset - sunrise;

        // Brahma Muhurat: 1hr 36min before sunrise
        const brahmaStart = sunrise - 1.6;
        const brahmaEnd = sunrise - 0.8;
        document.getElementById('brahma-muhurat').textContent =
            `${hoursToTime(brahmaStart)} - ${hoursToTime(brahmaEnd)}`;

        // Abhijit Muhurat: Middle of day
        const midday = (sunrise + sunset) / 2;
        const abhijitStart = midday - 0.4;
        const abhijitEnd = midday + 0.4;
        document.getElementById('abhijit-muhurat').textContent =
            `${hoursToTime(abhijitStart)} - ${hoursToTime(abhijitEnd)}`;

        // Godhuli: Around sunset
        const godhuliStart = sunset - 0.4;
        document.getElementById('godhuli-muhurat').textContent =
            `${hoursToTime(godhuliStart)} - ${hoursToTime(sunset)}`;

        // Rahu Kalam
        document.getElementById('rahu-kalam').textContent =
            `${currentPanchang.rahuKalam.startTime} - ${currentPanchang.rahuKalam.endTime}`;

        // Yamagandam (different slot)
        const rahuSlots = [8, 2, 7, 5, 6, 4, 3];
        const dayOfWeek = currentDate.getDay();
        const slotDuration = dayDuration / 8;
        const yamaSlot = (rahuSlots[dayOfWeek] + 4) % 8 || 8;
        const yamaStart = sunrise + (yamaSlot - 1) * slotDuration;
        document.getElementById('yamagandam').textContent =
            `${hoursToTime(yamaStart)} - ${hoursToTime(yamaStart + slotDuration)}`;

        // Gulika Kalam
        const gulikaSlot = (rahuSlots[dayOfWeek] + 2) % 8 || 8;
        const gulikaStart = sunrise + (gulikaSlot - 1) * slotDuration;
        document.getElementById('gulika-kalam').textContent =
            `${hoursToTime(gulikaStart)} - ${hoursToTime(gulikaStart + slotDuration)}`;
    }

    // === CHOGHADIYA TIME WHEEL ===
    let currentChogPeriod = 'day';
    let wheelUpdateInterval = null;

    const CHOG_DATA = {
        day: [
            { name: 'उद्वेग', type: 'udveg', english: 'Anxiety', good: false },
            { name: 'चल', type: 'chal', english: 'Movement', good: true },
            { name: 'लाभ', type: 'labh', english: 'Gain', good: true },
            { name: 'अमृत', type: 'amrit', english: 'Nectar', good: true },
            { name: 'काल', type: 'kaal', english: 'Death', good: false },
            { name: 'शुभ', type: 'shubh', english: 'Auspicious', good: true },
            { name: 'रोग', type: 'rog', english: 'Disease', good: false },
            { name: 'उद्वेग', type: 'udveg', english: 'Anxiety', good: false }
        ],
        night: [
            { name: 'शुभ', type: 'shubh', english: 'Auspicious', good: true },
            { name: 'अमृत', type: 'amrit', english: 'Nectar', good: true },
            { name: 'चल', type: 'chal', english: 'Movement', good: true },
            { name: 'रोग', type: 'rog', english: 'Disease', good: false },
            { name: 'काल', type: 'kaal', english: 'Death', good: false },
            { name: 'लाभ', type: 'labh', english: 'Gain', good: true },
            { name: 'उद्वेग', type: 'udveg', english: 'Anxiety', good: false },
            { name: 'शुभ', type: 'shubh', english: 'Auspicious', good: true }
        ]
    };

    function getChoghadiyaSlots(period) {
        const sunrise = currentPanchang.sunTimes.sunrise;
        const sunset = currentPanchang.sunTimes.sunset;
        const dayDuration = sunset - sunrise;
        const nightDuration = 24 - dayDuration;

        const chogs = CHOG_DATA[period];
        const duration = period === 'day' ? dayDuration / 8 : nightDuration / 8;
        const start = period === 'day' ? sunrise : sunset;

        // Rotate based on day
        const dayOfWeek = currentDate.getDay();
        const rotated = [...chogs.slice(dayOfWeek % 7), ...chogs.slice(0, dayOfWeek % 7)];

        return rotated.map((chog, i) => ({
            ...chog,
            startHour: start + i * duration,
            endHour: start + (i + 1) * duration
        }));
    }

    function drawWheelSegments(period) {
        const segmentsEl = document.getElementById('chog-segments');
        if (!segmentsEl) return;

        const slots = getChoghadiyaSlots(period);
        const anglePerSlot = 360 / 8;

        let html = '';
        slots.forEach((slot, i) => {
            const startAngle = i * anglePerSlot;
            const endAngle = (i + 1) * anglePerSlot;
            const path = describeArc(100, 100, 72, startAngle, endAngle - 1);

            html += `<path d="${path}" class="segment-${slot.type}" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>`;
        });

        segmentsEl.innerHTML = html;
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    }

    function polarToCartesian(cx, cy, radius, angleDeg) {
        const rad = (angleDeg - 90) * Math.PI / 180;
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad)
        };
    }

    function updateTimeWheel() {
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;

        const sunrise = currentPanchang.sunTimes.sunrise;
        const sunset = currentPanchang.sunTimes.sunset;

        // Determine if day or night
        const isDay = currentHour >= sunrise && currentHour < sunset;
        const period = isDay ? 'day' : 'night';

        const slots = getChoghadiyaSlots(period);

        // Find current slot
        let currentSlot = null;
        let currentIndex = 0;
        slots.forEach((slot, i) => {
            const slotStart = slot.startHour;
            const slotEnd = slot.endHour;

            if (currentHour >= slotStart && currentHour < slotEnd) {
                currentSlot = slot;
                currentIndex = i;
            }
        });

        if (!currentSlot) {
            // Default to first slot if not found
            currentSlot = slots[0];
        }

        // Update center display
        const nameEl = document.getElementById('current-chog-name');
        const countdownEl = document.getElementById('current-chog-countdown');
        const badgeEl = document.getElementById('current-chog-badge');

        if (nameEl) nameEl.textContent = currentSlot.name;

        // Calculate remaining time
        const remainingHours = currentSlot.endHour - currentHour;
        const remainingMinutes = Math.floor(remainingHours * 60);
        if (countdownEl) countdownEl.textContent = `${remainingMinutes} min left`;

        if (badgeEl) {
            badgeEl.textContent = currentSlot.good ? 'Good' : 'Caution';
            badgeEl.className = `current-chog-badge ${currentSlot.good ? 'good' : 'bad'}`;
        }

        // Update sun indicator position
        const sunIndicator = document.getElementById('sun-indicator');
        if (sunIndicator) {
            const periodStart = period === 'day' ? sunrise : sunset;
            const periodDuration = period === 'day' ? (sunset - sunrise) : (24 - (sunset - sunrise));
            const progress = (currentHour - periodStart) / periodDuration;
            const angle = progress * 360;
            sunIndicator.setAttribute('transform', `rotate(${angle} 100 100)`);
        }

        // Check for Rahu Kalam alert
        updateRahuKalamAlert(currentHour);
    }

    function updateRahuKalamAlert(currentHour) {
        const alertEl = document.getElementById('time-alert');
        const alertText = document.getElementById('alert-text');
        if (!alertEl || !alertText) return;

        const rahuStart = parseFloat(currentPanchang.rahuKalam.startTime.split(':')[0]) +
            parseFloat(currentPanchang.rahuKalam.startTime.split(':')[1]) / 60;
        const rahuEnd = parseFloat(currentPanchang.rahuKalam.endTime.split(':')[0]) +
            parseFloat(currentPanchang.rahuKalam.endTime.split(':')[1]) / 60;

        // Show alert 15 min before Rahu Kalam or during
        const minsToRahu = (rahuStart - currentHour) * 60;

        if (currentHour >= rahuStart && currentHour < rahuEnd) {
            alertEl.style.display = 'flex';
            const remaining = Math.floor((rahuEnd - currentHour) * 60);
            alertText.textContent = `⚠️ Rahu Kalam active! ${remaining} min remaining`;
        } else if (minsToRahu > 0 && minsToRahu <= 15) {
            alertEl.style.display = 'flex';
            alertText.textContent = `Rahu Kalam starts in ${Math.floor(minsToRahu)} minutes`;
        } else {
            alertEl.style.display = 'none';
        }

        lucide.createIcons();
    }

    function renderChoghadiya(period) {
        currentChogPeriod = period;

        // Draw wheel segments
        drawWheelSegments(period);

        // Update wheel display
        updateTimeWheel();

        // Render grid fallback
        if (!choghadiyaGrid) return;

        const slots = getChoghadiyaSlots(period);

        choghadiyaGrid.innerHTML = slots.map((chog, i) => `
            <div class="chog-card ${chog.type}">
                <span class="chog-name">${chog.name}</span>
                <span class="chog-time">${hoursToTime(chog.startHour)}</span>
            </div>
        `).join('');

        // Start auto-update
        if (wheelUpdateInterval) clearInterval(wheelUpdateInterval);
        wheelUpdateInterval = setInterval(updateTimeWheel, 60000); // Update every minute
    }

    // === TARA BALA ===
    function updateTaraBala() {
        if (birthNakshatra === null) {
            if (taraSetup) taraSetup.style.display = 'block';
            if (taraResult) taraResult.style.display = 'none';
            return;
        }

        if (taraSetup) taraSetup.style.display = 'none';
        if (taraResult) taraResult.style.display = 'block';

        const taraBala = VedicEphemeris.calculateTaraBala(
            birthNakshatra,
            currentPanchang.nakshatra.index
        );

        const meter = document.getElementById('tara-meter');
        const icon = document.getElementById('tara-icon');
        const name = document.getElementById('tara-name');
        const english = document.getElementById('tara-english');
        const badge = document.getElementById('tara-badge');
        const desc = document.getElementById('tara-desc');

        if (meter) {
            meter.className = `tara-meter ${taraBala.good ? 'good' : 'bad'}`;
        }
        if (icon) {
            icon.textContent = taraBala.good ? '✨' : '⚠️';
        }
        if (name) {
            name.textContent = taraBala.name;
        }
        if (english) {
            english.textContent = taraBala.english;
        }
        if (badge) {
            badge.textContent = taraBala.good ? 'Good' : 'Caution';
        }
        if (desc) {
            desc.textContent = TARA_DESCRIPTIONS[taraBala.index];
        }
    }

    // === EVENTS ===
    function renderEvents() {
        if (!eventsList) return;

        const dateKey = getDateKey(currentDate);
        const events = FESTIVALS[dateKey];

        if (!events || events.length === 0) {
            eventsList.innerHTML = `
                <div class="no-events">
                    कोई विशेष उत्सव नहीं | No special events today
                </div>
            `;
            return;
        }

        eventsList.innerHTML = events.map(event => `
            <div class="event-card">
                <span class="event-icon">${event.icon}</span>
                <div class="event-info">
                    <span class="event-name">${event.name}</span>
                    <span class="event-type">${event.type}</span>
                </div>
            </div>
        `).join('');
    }

    // === LOCATION ===
    function getAutoLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                location.lat = pos.coords.latitude;
                location.lon = pos.coords.longitude;
                location.city = 'Current Location';
                saveLocation();
                updateDisplay();
                locationModal.classList.remove('active');
            },
            (err) => {
                alert('Could not get location. Using default (New Delhi)');
            }
        );
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Date navigation
        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', () => {
                currentDate.setDate(currentDate.getDate() - 1);
                updateDisplay();
            });
        }

        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', () => {
                currentDate.setDate(currentDate.getDate() + 1);
                updateDisplay();
            });
        }

        // Location modal
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                locationModal.classList.add('active');
                lucide.createIcons();
            });
        }

        if (closeLocationBtn) {
            closeLocationBtn.addEventListener('click', () => {
                locationModal.classList.remove('active');
            });
        }

        if (locationModal) {
            locationModal.addEventListener('click', (e) => {
                if (e.target === locationModal) {
                    locationModal.classList.remove('active');
                }
            });
        }

        if (autoLocationBtn) {
            autoLocationBtn.addEventListener('click', getAutoLocation);
        }

        // Choghadiya tabs
        document.querySelectorAll('.chog-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.chog-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderChoghadiya(tab.dataset.period);
            });
        });

        // Tara Bala
        if (saveNakshatraBtn) {
            saveNakshatraBtn.addEventListener('click', () => {
                const selected = birthNakshatraSelect.value;
                if (selected !== '') {
                    saveBirthNakshatra(parseInt(selected, 10));
                    updateTaraBala();
                }
            });
        }

        if (changeNakshatraBtn) {
            changeNakshatraBtn.addEventListener('click', () => {
                taraSetup.style.display = 'block';
                taraResult.style.display = 'none';
            });
        }
    }

    // === START ===
    init();
});
