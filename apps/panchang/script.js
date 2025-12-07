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


    // === REGIONAL FESTIVAL PACKS ===
    const REGIONAL_FESTIVALS = {
        // Common to all regions
        common: {
            '2025-01-14': [{ name: 'मकर संक्रांति', type: 'Festival', icon: '🪁', naivedya: 'Til Gul, Khichdi' }],
            '2025-01-26': [{ name: 'गणतंत्र दिवस', type: 'Holiday', icon: '🇮🇳' }],
            '2025-02-26': [{ name: 'महाशिवरात्रि', type: 'Festival', icon: '🔱', naivedya: 'Bel Patra, Milk' }],
            '2025-03-14': [{ name: 'होली', type: 'Festival', icon: '🎨', naivedya: 'Gujiya, Thandai' }],
            '2025-04-06': [{ name: 'राम नवमी', type: 'Festival', icon: '🏹', naivedya: 'Panakam, Kosambari' }],
            '2025-08-15': [{ name: 'स्वतंत्रता दिवस', type: 'Holiday', icon: '🇮🇳' }],
            '2025-08-16': [{ name: 'जन्माष्टमी', type: 'Festival', icon: '🎂', naivedya: 'Makhan Mishri, Panchamrit' }],
            '2025-10-02': [{ name: 'गांधी जयंती', type: 'Holiday', icon: '🕊️' }],
            '2025-10-20': [{ name: 'दशहरा', type: 'Festival', icon: '🏹', naivedya: 'Jalebi, Fafda' }],
            '2025-11-01': [{ name: 'दीपावली', type: 'Festival', icon: '🪔', naivedya: 'Mithai, Dry Fruits' }]
        },

        // Maharashtra Pack
        maharashtra: {
            '2025-08-19': [{
                name: 'नारळी पौर्णिमा',
                nameEn: 'Narali Purnima',
                type: 'Festival',
                icon: '🥥',
                naivedya: 'Nariyal Rice, Narali Bhat',
                ritual: 'समुद्राला नारळ अर्पण करा',
                description: 'Coconut Day - Offering to the Sea God Varuna'
            }],
            '2025-08-27': [{
                name: 'गणेश चतुर्थी',
                type: 'Festival',
                icon: '🐘',
                naivedya: 'Modak, Puran Poli',
                ritual: 'गणपती बाप्पा मोरया',
                description: '10-day Ganesh festival begins'
            }],
            '2025-09-06': [{
                name: 'गणेश विसर्जन',
                type: 'Festival',
                icon: '🌊',
                ritual: 'गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या'
            }],
            '2025-03-13': [{
                name: 'होळी / शिमगा',
                nameEn: 'Shimga',
                type: 'Festival',
                icon: '🔥',
                naivedya: 'Puran Poli, Karanji',
                ritual: 'होळीची पूजा',
                description: 'Holika Dahan - Konkan style'
            }],
            '2025-10-01': [{
                name: 'नवरात्र प्रारंभ',
                type: 'Festival',
                icon: '🙏',
                naivedya: 'Sabudana Khichdi'
            }],
            '2025-09-17': [{
                name: 'अनंत चतुर्दशी',
                type: 'Festival',
                icon: '🧵',
                naivedya: 'Chana Dal Varan',
                ritual: 'अनंत धागा बांधणे'
            }],
            '2025-04-08': [{
                name: 'गुढी पाडवा',
                type: 'New Year',
                icon: '🎊',
                naivedya: 'Shrikhand Puri, Kadhi',
                ritual: 'गुढी उभारणे',
                description: 'Marathi New Year'
            }]
        },

        // Tamil Nadu Pack
        tamil: {
            '2025-01-14': [{
                name: 'पोंगल',
                nameEn: 'Thai Pongal',
                type: 'Festival',
                icon: '🍚',
                naivedya: 'Pongal Rice, Sakkarai Pongal',
                ritual: 'पोंगलो पोंगल!',
                description: 'Harvest festival - 4 day celebration'
            }],
            '2025-01-15': [{
                name: 'मट्टु पोंगल',
                nameEn: 'Mattu Pongal',
                type: 'Festival',
                icon: '🐄',
                description: 'Worship of cattle'
            }],
            '2025-02-11': [{
                name: 'थाई पूसम',
                nameEn: 'Thai Poosam',
                type: 'Festival',
                icon: '🔱',
                naivedya: 'Paal Koozh, Panchamirtam',
                ritual: 'कावड़ी अट्टम',
                description: 'Lord Murugan worship'
            }],
            '2025-04-14': [{
                name: 'तमिल पुथांडु',
                nameEn: 'Tamil New Year',
                type: 'New Year',
                icon: '🎊',
                naivedya: 'Maanga Pachadi',
                description: 'Tamil New Year (Chithirai 1)'
            }],
            '2025-08-26': [{
                name: 'विनायक चतुर्थी',
                type: 'Festival',
                icon: '🐘',
                naivedya: 'Kozhukattai, Sundal'
            }],
            '2025-10-29': [{
                name: 'कार्तिगै दीपम',
                nameEn: 'Karthigai Deepam',
                type: 'Festival',
                icon: '🪔',
                description: 'Festival of Lights at Thiruvannamalai'
            }]
        },

        // Bengal Pack
        bengal: {
            '2025-10-01': [{
                name: 'महालया',
                nameEn: 'Mahalaya',
                type: 'Festival',
                icon: '🙏',
                description: 'Devi Paksha begins - Mahishasura Mardini'
            }],
            '2025-10-07': [{
                name: 'दुर्गा षष्ठी',
                type: 'Festival',
                icon: '🔔',
                ritual: 'बोधन, कल्पारम्भ'
            }],
            '2025-10-08': [{
                name: 'महा सप्तमी',
                type: 'Festival',
                icon: '🌺',
                naivedya: 'Khichuri, Labra',
                ritual: 'नबपत्रिका स्नान'
            }],
            '2025-10-09': [{
                name: 'महा अष्टमी',
                type: 'Festival',
                icon: '⚔️',
                naivedya: 'Bhog - Khichuri, Beguni',
                ritual: 'कुमारी पूजा, संध्या आरती'
            }],
            '2025-10-10': [{
                name: 'महा नवमी',
                type: 'Festival',
                icon: '🎭',
                naivedya: 'Bhog, Payesh',
                ritual: 'महा आरती'
            }],
            '2025-10-11': [{
                name: 'विजया दशमी',
                type: 'Festival',
                icon: '👋',
                naivedya: 'Rosogolla, Sandesh',
                ritual: 'सिंदूर खेला, विसर्जन',
                description: 'Durga Visarjan - Shubho Bijoya!'
            }],
            '2025-10-20': [{
                name: 'लक्ष्मी पूजा',
                type: 'Festival',
                icon: '🦉',
                naivedya: 'Luchi, Cholar Dal'
            }],
            '2025-11-01': [{
                name: 'काली पूजा',
                nameEn: 'Kali Puja',
                type: 'Festival',
                icon: '🖤',
                naivedya: 'Luchi, Mangsho',
                ritual: 'रात्रि पूजा',
                description: 'Celebrated with Diwali in Bengal'
            }],
            '2025-04-14': [{
                name: 'पोइला बोइशाख',
                nameEn: 'Poila Boishakh',
                type: 'New Year',
                icon: '🎊',
                naivedya: 'Maach Bhaat, Mishti',
                description: 'Bengali New Year'
            }]
        }
    };

    // === STATE ===
    let currentDate = new Date();
    let location = { lat: 28.6139, lon: 77.2090, city: 'New Delhi' };
    let birthNakshatra = null;
    let currentPanchang = null;
    let selectedRegion = 'common'; // common, maharashtra, tamil, bengal


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
        setupRegionTabs();
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
    function getEventsForDate(dateKey) {
        // Merge common + selected region events
        const commonEvents = REGIONAL_FESTIVALS.common[dateKey] || [];
        const regionalEvents = selectedRegion !== 'common'
            ? (REGIONAL_FESTIVALS[selectedRegion][dateKey] || [])
            : [];

        return [...commonEvents, ...regionalEvents];
    }

    function renderEvents() {
        if (!eventsList) return;

        const dateKey = getDateKey(currentDate);
        const events = getEventsForDate(dateKey);

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
                <div class="event-content">
                    <div class="event-header">
                        <div>
                            <span class="event-name">${event.name}</span>
                            ${event.nameEn ? `<span class="event-name-en">${event.nameEn}</span>` : ''}
                        </div>
                        <span class="event-type">${event.type}</span>
                    </div>
                    ${event.description ? `<p class="event-desc">${event.description}</p>` : ''}
                    ${event.naivedya ? `
                        <div class="event-naivedya">
                            <i data-lucide="utensils"></i>
                            <span>नैवेद्य: ${event.naivedya}</span>
                        </div>
                    ` : ''}
                    ${event.ritual ? `<p class="event-ritual">"${event.ritual}"</p>` : ''}
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    function loadRegionSetting() {
        const saved = localStorage.getItem('panchang_region');
        if (saved) {
            selectedRegion = saved;
        }
    }

    function saveRegionSetting() {
        localStorage.setItem('panchang_region', selectedRegion);
    }

    function setupRegionTabs() {
        loadRegionSetting();

        // Set active tab
        document.querySelectorAll('.region-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.region === selectedRegion);

            tab.addEventListener('click', () => {
                document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selectedRegion = tab.dataset.region;
                saveRegionSetting();
                renderEvents();
            });
        });
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

        // Sankalpa Generator
        setupSankalpaListeners();
    }

    // === SANKALPA GENERATOR ===
    const RITUS = ['वसन्त', 'ग्रीष्म', 'वर्षा', 'शरद्', 'हेमन्त', 'शिशिर'];
    const AYANAS = { uttarayana: 'उत्तरायण', dakshinayana: 'दक्षिणायन' };

    let sankalpaUser = {
        name: '',
        gotra: '',
        tradition: 'north'
    };

    function loadSankalpaSettings() {
        const saved = localStorage.getItem('panchang_sankalpa_user');
        if (saved) {
            sankalpaUser = JSON.parse(saved);
        }
    }

    function saveSankalpaSettings() {
        localStorage.setItem('panchang_sankalpa_user', JSON.stringify(sankalpaUser));
    }

    function getAyana(date) {
        // Uttarayana: Jan 14 - Jul 16, Dakshinayana: Jul 17 - Jan 13
        const month = date.getMonth();
        const day = date.getDate();

        if ((month === 0 && day >= 14) || (month > 0 && month < 6) || (month === 6 && day <= 16)) {
            return 'uttarayana';
        }
        return 'dakshinayana';
    }

    function getRitu(date) {
        // 6 Ritus based on Hindu months
        // Vasant (Chaitra-Vaishakh), Grishma (Jyeshtha-Ashadha), etc.
        const month = date.getMonth();
        const rituIndex = Math.floor(((month + 9) % 12) / 2);
        return RITUS[rituIndex];
    }

    function generateSankalpaText() {
        loadSankalpaSettings();

        const samvatsara = currentPanchang.samvatsara;
        const ayana = getAyana(currentDate);
        const ritu = getRitu(currentDate);
        const masa = getHinduMonth(currentDate);
        const paksha = currentPanchang.tithi.paksha;
        const tithi = currentPanchang.tithi.name;
        const nakshatra = currentPanchang.nakshatra.name;
        const vara = WEEKDAYS[currentDate.getDay()].name;

        // Build Sankalpa text
        const text = `॥ श्री गणेशाय नमः ॥

अद्य ब्रह्मणः द्वितीय परार्धे, श्वेतवराहकल्पे, वैवस्वतमन्वन्तरे, 
अष्टाविंशतितमे कलियुगे, प्रथम चरणे, 
${samvatsara.name} नाम संवत्सरे, ${AYANAS[ayana]}े, ${ritu} ऋतौ, 
${masa} मासे, ${paksha} पक्षे, ${tithi} तिथौ, 
${vara} वासरे, ${nakshatra} नक्षत्रे,

${sankalpaUser.gotra || '(गोत्र)'} गोत्रः ${sankalpaUser.name || '(नाम)'} अहं...

[पूजा/कर्म का उद्देश्य यहाँ बोलें]`;

        return {
            text,
            samvatsara: samvatsara.name,
            ayana: AYANAS[ayana],
            ritu: ritu,
            masa: masa,
            paksha: paksha,
            tithi: tithi
        };
    }

    function displaySankalpa() {
        const data = generateSankalpaText();

        const textEl = document.getElementById('sankalpa-text');
        if (textEl) textEl.textContent = data.text;

        // Update breakdown
        document.getElementById('sk-samvatsara').textContent = data.samvatsara;
        document.getElementById('sk-ayana').textContent = data.ayana;
        document.getElementById('sk-ritu').textContent = data.ritu;
        document.getElementById('sk-masa').textContent = data.masa;
        document.getElementById('sk-paksha').textContent = data.paksha;
        document.getElementById('sk-tithi').textContent = data.tithi;

        // Show result
        document.getElementById('sankalpa-setup').style.display = 'none';
        document.getElementById('sankalpa-result').style.display = 'block';

        lucide.createIcons();
    }

    function speakSankalpa() {
        const textEl = document.getElementById('sankalpa-text');
        if (!textEl) return;

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textEl.textContent);
            utterance.lang = 'hi-IN';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } else {
            alert('Speech synthesis not supported in this browser');
        }
    }

    function copySankalpa() {
        const textEl = document.getElementById('sankalpa-text');
        if (!textEl) return;

        navigator.clipboard.writeText(textEl.textContent).then(() => {
            const copyBtn = document.getElementById('copy-sankalpa');
            if (copyBtn) {
                copyBtn.innerHTML = '<i data-lucide="check"></i>';
                lucide.createIcons();
                setTimeout(() => {
                    copyBtn.innerHTML = '<i data-lucide="copy"></i>';
                    lucide.createIcons();
                }, 2000);
            }
        });
    }

    function setupSankalpaListeners() {
        loadSankalpaSettings();

        // Pre-fill inputs if saved
        const nameInput = document.getElementById('user-name');
        const gotraInput = document.getElementById('user-gotra');

        if (nameInput && sankalpaUser.name) nameInput.value = sankalpaUser.name;
        if (gotraInput && sankalpaUser.gotra) gotraInput.value = sankalpaUser.gotra;

        // Tradition toggle
        document.querySelectorAll('.tradition-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tradition-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                sankalpaUser.tradition = btn.dataset.tradition;
            });
        });

        // Generate button
        const generateBtn = document.getElementById('generate-sankalpa');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                sankalpaUser.name = nameInput?.value || '';
                sankalpaUser.gotra = gotraInput?.value || '';
                saveSankalpaSettings();
                displaySankalpa();
            });
        }

        // Edit button
        const editBtn = document.getElementById('edit-sankalpa');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                document.getElementById('sankalpa-setup').style.display = 'block';
                document.getElementById('sankalpa-result').style.display = 'none';
            });
        }

        // Speak button
        const speakBtn = document.getElementById('speak-sankalpa');
        if (speakBtn) {
            speakBtn.addEventListener('click', speakSankalpa);
        }

        // Copy button
        const copyBtn = document.getElementById('copy-sankalpa');
        if (copyBtn) {
            copyBtn.addEventListener('click', copySankalpa);
        }
    }

    // === START ===
    init();
});
