/**
 * Panchang App - Vedic Calendar
 * Complete Panchang calculations and display
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

    const TITHIS = [
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
        'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
        'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'
    ];

    const NAKSHATRAS = [
        'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु',
        'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा',
        'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा',
        'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
    ];

    const YOGAS = [
        'विष्कुम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा',
        'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र',
        'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य',
        'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'
    ];

    const KARANAS = [
        'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि',
        'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'
    ];

    const HINDU_MONTHS = [
        'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद',
        'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'
    ];

    const CHOGHADIYA_DAY = [
        { name: 'उद्वेग', type: 'udveg', good: false },
        { name: 'चल', type: 'chal', good: true },
        { name: 'लाभ', type: 'labh', good: true },
        { name: 'अमृत', type: 'amrit', good: true },
        { name: 'काल', type: 'kaal', good: false },
        { name: 'शुभ', type: 'shubh', good: true },
        { name: 'रोग', type: 'rog', good: false },
        { name: 'उद्वेग', type: 'udveg', good: false }
    ];

    const CHOGHADIYA_NIGHT = [
        { name: 'शुभ', type: 'shubh', good: true },
        { name: 'अमृत', type: 'amrit', good: true },
        { name: 'चल', type: 'chal', good: true },
        { name: 'रोग', type: 'rog', good: false },
        { name: 'काल', type: 'kaal', good: false },
        { name: 'लाभ', type: 'labh', good: true },
        { name: 'उद्वेग', type: 'udveg', good: false },
        { name: 'शुभ', type: 'shubh', good: true }
    ];

    // Rahu Kalam order for each day (Sunday=0 to Saturday=6)
    const RAHU_KALAM_ORDER = [8, 2, 7, 5, 6, 4, 3]; // Which 1.5hr slot is Rahu Kalam

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
        '2025-11-01': [{ name: 'दीपावली', type: 'Festival', icon: '🪔' }]
    };

    // === STATE ===
    let currentDate = new Date();
    let location = { lat: 28.6139, lon: 77.2090, city: 'New Delhi' }; // Default

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

    // === INITIALIZE ===
    function init() {
        loadLocation();
        updateDisplay();
        setupEventListeners();
        lucide.createIcons();
    }

    // === DATE CALCULATIONS ===
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    }

    function getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    // === PANCHANG CALCULATIONS ===
    function calculateTithi(date) {
        // Simplified Tithi calculation based on lunar phase
        const lunation = getLunation(date);
        const tithiIndex = Math.floor(lunation * 30) % 15;
        const paksha = lunation < 0.5 ? 'शुक्ल' : 'कृष्ण';
        return {
            name: TITHIS[tithiIndex],
            paksha: paksha,
            fullName: `${paksha} ${TITHIS[tithiIndex]}`
        };
    }

    function getLunation(date) {
        // Calculate approximate moon phase (0-1)
        const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
        const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000;
        const diff = date.getTime() - knownNewMoon;
        return (diff % lunarCycle) / lunarCycle;
    }

    function calculateNakshatra(date) {
        // Simplified calculation
        const dayOfYear = getDayOfYear(date);
        const index = (dayOfYear * 27 / 365) % 27;
        return NAKSHATRAS[Math.floor(index)];
    }

    function calculateYoga(date) {
        const dayOfYear = getDayOfYear(date);
        const index = (dayOfYear * 27 / 365 + 7) % 27;
        return YOGAS[Math.floor(index)];
    }

    function calculateKarana(date) {
        const dayOfYear = getDayOfYear(date);
        const index = (dayOfYear * 2) % 11;
        return KARANAS[index];
    }

    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    function getHinduMonth(date) {
        // Approximate Hindu month calculation
        const month = (date.getMonth() + 9) % 12;
        return HINDU_MONTHS[month];
    }

    function getVikramSamvat(date) {
        // Vikram Samvat is ahead of Gregorian by ~57 years
        return date.getFullYear() + 57;
    }

    // === SUN/MOON CALCULATIONS ===
    function calculateSunTimes(date, lat, lon) {
        // Simplified sunrise/sunset calculation
        const dayOfYear = getDayOfYear(date);
        const decl = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180);
        const hourAngle = Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(decl * Math.PI / 180)) * 180 / Math.PI;

        const sunrise = 12 - hourAngle / 15;
        const sunset = 12 + hourAngle / 15;

        return {
            sunrise: formatTime(sunrise),
            sunset: formatTime(sunset),
            sunriseHours: sunrise,
            sunsetHours: sunset
        };
    }

    function formatTime(hours) {
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    // === MUHURAT CALCULATIONS ===
    function calculateMuhurats(sunTimes) {
        const sunrise = sunTimes.sunriseHours;
        const sunset = sunTimes.sunsetHours;
        const dayDuration = sunset - sunrise;
        const nightDuration = 24 - dayDuration;

        // Brahma Muhurat: 1hr 36min before sunrise
        const brahmaMuhuratStart = sunrise - 1.6;
        const brahmaMuhuratEnd = sunrise - 0.8;

        // Abhijit Muhurat: Middle of day (11:36 AM to 12:24 PM approx)
        const midday = (sunrise + sunset) / 2;
        const abhijitStart = midday - 0.4;
        const abhijitEnd = midday + 0.4;

        // Godhuli: Around sunset
        const godhuliStart = sunset - 0.4;
        const godhuliEnd = sunset;

        // Rahu Kalam calculation
        const dayOfWeek = currentDate.getDay();
        const slot = RAHU_KALAM_ORDER[dayOfWeek];
        const slotDuration = dayDuration / 8;
        const rahuStart = sunrise + (slot - 1) * slotDuration;
        const rahuEnd = rahuStart + slotDuration;

        // Yamagandam (different slot order)
        const yamaSlot = (slot + 4) % 8 || 8;
        const yamaStart = sunrise + (yamaSlot - 1) * slotDuration;
        const yamaEnd = yamaStart + slotDuration;

        // Gulika Kalam (different slot order)
        const gulikaSlot = (slot + 2) % 8 || 8;
        const gulikaStart = sunrise + (gulikaSlot - 1) * slotDuration;
        const gulikaEnd = gulikaStart + slotDuration;

        return {
            brahmaMuhurat: `${formatTime(brahmaMuhuratStart)} - ${formatTime(brahmaMuhuratEnd)}`,
            abhijitMuhurat: `${formatTime(abhijitStart)} - ${formatTime(abhijitEnd)}`,
            godhuliMuhurat: `${formatTime(godhuliStart)} - ${formatTime(godhuliEnd)}`,
            rahuKalam: `${formatTime(rahuStart)} - ${formatTime(rahuEnd)}`,
            yamagandam: `${formatTime(yamaStart)} - ${formatTime(yamaEnd)}`,
            gulikaKalam: `${formatTime(gulikaStart)} - ${formatTime(gulikaEnd)}`
        };
    }

    // === CHOGHADIYA CALCULATION ===
    function calculateChoghadiya(sunTimes, period) {
        const sunrise = sunTimes.sunriseHours;
        const sunset = sunTimes.sunsetHours;
        const dayDuration = sunset - sunrise;
        const nightDuration = 24 - dayDuration;

        const chogs = period === 'day' ? CHOGHADIYA_DAY : CHOGHADIYA_NIGHT;
        const duration = period === 'day' ? dayDuration / 8 : nightDuration / 8;
        const start = period === 'day' ? sunrise : sunset;

        // Rotate based on day of week
        const dayOfWeek = currentDate.getDay();
        const rotatedChogs = [...chogs.slice(dayOfWeek), ...chogs.slice(0, dayOfWeek)];

        return rotatedChogs.map((chog, i) => ({
            ...chog,
            startTime: formatTime(start + i * duration),
            endTime: formatTime(start + (i + 1) * duration)
        }));
    }

    // === MOON PHASE UPDATE ===
    function updateMoonPhase(lunation) {
        const shadow = document.getElementById('moon-shadow');
        const moonPercent = document.getElementById('moon-percent');

        // Calculate illumination percentage
        let illumination;
        if (lunation <= 0.5) {
            illumination = lunation * 2 * 100;
        } else {
            illumination = (1 - lunation) * 2 * 100;
        }

        // Adjust shadow based on phase
        if (lunation <= 0.25) {
            // Waxing crescent
            shadow.style.width = `${100 - lunation * 400}%`;
            shadow.style.right = '0';
            shadow.style.left = 'auto';
        } else if (lunation <= 0.5) {
            // Waxing gibbous
            shadow.style.width = `${(0.5 - lunation) * 200}%`;
            shadow.style.right = '0';
            shadow.style.left = 'auto';
        } else if (lunation <= 0.75) {
            // Waning gibbous
            shadow.style.width = `${(lunation - 0.5) * 200}%`;
            shadow.style.left = '0';
            shadow.style.right = 'auto';
        } else {
            // Waning crescent
            shadow.style.width = `${100 - (1 - lunation) * 400}%`;
            shadow.style.left = '0';
            shadow.style.right = 'auto';
        }

        moonPercent.textContent = `${Math.round(illumination)}% Illuminated`;
    }

    // === UPDATE DISPLAY ===
    function updateDisplay() {
        // Date display
        gregorianDateEl.textContent = formatDate(currentDate);

        // Hindu date
        const hinduMonth = getHinduMonth(currentDate);
        const tithi = calculateTithi(currentDate);
        hinduDateEl.textContent = `${hinduMonth} ${tithi.fullName}`;

        // Moon phase
        const lunation = getLunation(currentDate);
        updateMoonPhase(lunation);
        document.getElementById('tithi-name').textContent = tithi.fullName;

        // Panchang elements
        document.getElementById('tithi-value').textContent = tithi.fullName;
        document.getElementById('nakshatra-value').textContent = calculateNakshatra(currentDate);
        document.getElementById('yoga-value').textContent = calculateYoga(currentDate);
        document.getElementById('karana-value').textContent = calculateKarana(currentDate);

        // Day
        const dayData = WEEKDAYS[currentDate.getDay()];
        document.getElementById('var-value').textContent = dayData.name;
        document.getElementById('var-deity').textContent = dayData.deity;

        // Auspicious color
        document.getElementById('auspicious-color').style.background = dayData.color;
        document.getElementById('color-name').textContent = dayData.colorName;

        // Sun/Moon timings
        const sunTimes = calculateSunTimes(currentDate, location.lat, location.lon);
        document.getElementById('sunrise').textContent = sunTimes.sunrise;
        document.getElementById('sunset').textContent = sunTimes.sunset;

        // Moonrise/set (approximation)
        const moonriseOffset = lunation * 24;
        document.getElementById('moonrise').textContent = formatTime((6 + moonriseOffset) % 24);
        document.getElementById('moonset').textContent = formatTime((18 + moonriseOffset) % 24);

        // Muhurats
        const muhurats = calculateMuhurats(sunTimes);
        document.getElementById('brahma-muhurat').textContent = muhurats.brahmaMuhurat;
        document.getElementById('abhijit-muhurat').textContent = muhurats.abhijitMuhurat;
        document.getElementById('godhuli-muhurat').textContent = muhurats.godhuliMuhurat;
        document.getElementById('rahu-kalam').textContent = muhurats.rahuKalam;
        document.getElementById('yamagandam').textContent = muhurats.yamagandam;
        document.getElementById('gulika-kalam').textContent = muhurats.gulikaKalam;

        // Choghadiya
        renderChoghadiya(sunTimes, 'day');

        // Events
        renderEvents();

        lucide.createIcons();
    }

    // === RENDER CHOGHADIYA ===
    function renderChoghadiya(sunTimes, period) {
        const chogs = calculateChoghadiya(sunTimes, period);

        choghadiyaGrid.innerHTML = chogs.map(chog => `
            <div class="chog-card ${chog.type}">
                <span class="chog-name">${chog.name}</span>
                <span class="chog-time">${chog.startTime}</span>
            </div>
        `).join('');
    }

    // === RENDER EVENTS ===
    function renderEvents() {
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
    function loadLocation() {
        const saved = localStorage.getItem('panchang_location');
        if (saved) {
            location = JSON.parse(saved);
        }
    }

    function saveLocation() {
        localStorage.setItem('panchang_location', JSON.stringify(location));
    }

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
        prevDayBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 1);
            updateDisplay();
        });

        nextDayBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDisplay();
        });

        // Location modal
        locationBtn.addEventListener('click', () => {
            locationModal.classList.add('active');
            lucide.createIcons();
        });

        closeLocationBtn.addEventListener('click', () => {
            locationModal.classList.remove('active');
        });

        locationModal.addEventListener('click', (e) => {
            if (e.target === locationModal) {
                locationModal.classList.remove('active');
            }
        });

        autoLocationBtn.addEventListener('click', getAutoLocation);

        // Choghadiya tabs
        document.querySelectorAll('.chog-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.chog-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const sunTimes = calculateSunTimes(currentDate, location.lat, location.lon);
                renderChoghadiya(sunTimes, tab.dataset.period);
            });
        });
    }

    // === START ===
    init();
});
