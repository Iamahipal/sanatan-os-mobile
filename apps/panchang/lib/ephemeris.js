/**
 * Vedic Panchang Ephemeris Engine
 * Using mhah-panchang library for accurate astronomical calculations
 * With proper IST timezone handling
 */

const VedicEphemeris = (function () {
    'use strict';

    // === CONSTANTS ===
    const IST_OFFSET_HOURS = 5.5; // IST is UTC+5:30
    const DEG_TO_RAD = Math.PI / 180;
    const RAD_TO_DEG = 180 / Math.PI;

    // Nakshatra names (27)
    const NAKSHATRAS = [
        'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु',
        'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा',
        'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा',
        'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
    ];

    const NAKSHATRAS_EN = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
        'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
        'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
        'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    // Tithi names (30)
    const TITHIS = [
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
        'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
        'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
        'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
        'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या'
    ];

    // Yoga names (27)
    const YOGAS = [
        'विष्कुम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा',
        'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र',
        'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य',
        'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'
    ];

    const YOGAS_EN = [
        'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma',
        'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
        'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya',
        'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
    ];

    // Karana names (11)
    const KARANAS = [
        'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि',
        'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'
    ];

    const KARANAS_EN = [
        'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
        'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
    ];

    // Hindu months
    const HINDU_MONTHS = [
        'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद',
        'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'
    ];

    // Samvatsara names (60-year Jupiter cycle)
    const SAMVATSARAS = [
        'प्रभव', 'विभव', 'शुक्ल', 'प्रमोदूत', 'प्रजोत्पत्ति', 'आंगिरस', 'श्रीमुख', 'भाव',
        'युवा', 'धाता', 'ईश्वर', 'बहुधान्य', 'प्रमाथी', 'विक्रम', 'वृष', 'चित्रभानु',
        'स्वभानु', 'तारण', 'पार्थिव', 'व्यय', 'सर्वजित्', 'सर्वधारी', 'विरोधी', 'विकृति',
        'खर', 'नंदन', 'विजय', 'जय', 'मन्मथ', 'दुर्मुखी', 'हेविलम्बी', 'विलम्बी',
        'विकारी', 'शार्वरी', 'प्लव', 'शुभकृत्', 'शोभकृत्', 'क्रोधी', 'विश्वावसु', 'पराभव',
        'प्लवंग', 'कीलक', 'सौम्य', 'साधारण', 'विरोधिकृत्', 'परिधावी', 'प्रमादीच', 'आनंद',
        'राक्षस', 'नल', 'पिंगल', 'काळयुक्त', 'सिद्धार्थी', 'रौद्र', 'दुर्मति', 'दुन्दुभि',
        'रुधिरोद्गारी', 'रक्ताक्षी', 'क्रोधन', 'अक्षय'
    ];

    // Tara Bala results
    const TARA_BALA = [
        { name: 'जन्म', english: 'Janma', result: 'danger', good: false },
        { name: 'सम्पत्', english: 'Sampat', result: 'wealth', good: true },
        { name: 'विपत्', english: 'Vipat', result: 'danger', good: false },
        { name: 'क्षेम', english: 'Kshema', result: 'safety', good: true },
        { name: 'प्रत्यक्', english: 'Pratyak', result: 'obstacle', good: false },
        { name: 'साधना', english: 'Sadhana', result: 'achievement', good: true },
        { name: 'नैधन', english: 'Naidhana', result: 'danger', good: false },
        { name: 'मित्र', english: 'Mitra', result: 'friend', good: true },
        { name: 'परम मित्र', english: 'Parama Mitra', result: 'best friend', good: true }
    ];

    // === mhah-panchang INTEGRATION ===
    let mhahPanchang = null;

    function initMhahPanchang() {
        // Try different ways the library might be exported
        if (typeof MhahPanchang !== 'undefined') {
            try {
                // Try different initialization methods
                if (MhahPanchang.MhahPanchang) {
                    mhahPanchang = new MhahPanchang.MhahPanchang();
                } else if (MhahPanchang.default) {
                    mhahPanchang = new MhahPanchang.default();
                } else if (typeof MhahPanchang === 'function') {
                    mhahPanchang = new MhahPanchang();
                } else {
                    mhahPanchang = MhahPanchang;
                }
                console.log('mhah-panchang library loaded:', mhahPanchang);
                return true;
            } catch (e) {
                console.error('Error initializing mhah-panchang:', e);
                return false;
            }
        }
        console.warn('mhah-panchang library not found, using fallback calculations');
        return false;
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMhahPanchang);
    } else {
        initMhahPanchang();
    }

    // === SUNRISE/SUNSET CALCULATION (Accurate for India) ===

    function calculateSunrise(date, lat, lon) {
        const dayOfYear = getDayOfYear(date);

        // Solar declination
        const decl = 23.45 * Math.sin(DEG_TO_RAD * (360 / 365) * (dayOfYear - 81));

        // Hour angle at sunrise
        const cosH = -Math.tan(lat * DEG_TO_RAD) * Math.tan(decl * DEG_TO_RAD);

        if (cosH > 1 || cosH < -1) {
            // Polar day or night
            return null;
        }

        const H = Math.acos(cosH) * RAD_TO_DEG;

        // Equation of time correction (minutes)
        const B = (360 / 365) * (dayOfYear - 81) * DEG_TO_RAD;
        const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

        // Local solar noon in IST
        // Standard meridian for IST is 82.5°E
        const IST_MERIDIAN = 82.5;
        const solarNoon = 12 + (IST_MERIDIAN - lon) * 4 / 60 - EoT / 60;

        const sunriseLocal = solarNoon - H / 15;
        const sunsetLocal = solarNoon + H / 15;

        return {
            sunrise: sunriseLocal,
            sunset: sunsetLocal,
            sunriseTime: hoursToTime(sunriseLocal),
            sunsetTime: hoursToTime(sunsetLocal),
            dayDuration: sunsetLocal - sunriseLocal
        };
    }

    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    function hoursToTime(hours) {
        if (hours < 0) hours += 24;
        if (hours >= 24) hours -= 24;
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    // === PANCHANG DATA FROM LIBRARY ===

    function getPanchangFromLibrary(date, lat, lon) {
        if (!mhahPanchang) {
            initMhahPanchang();
        }

        if (mhahPanchang) {
            try {
                // mhah-panchang.calendar() returns accurate panchang with location
                const calData = mhahPanchang.calendar(date, lat, lon);

                // Also get basic calculation for cross-reference
                const calcData = mhahPanchang.calculate(date);

                return { calData, calcData };
            } catch (e) {
                console.error('mhah-panchang error:', e);
                return null;
            }
        }
        return null;
    }

    // === MAP LIBRARY DATA TO OUR FORMAT ===

    function mapTithiFromLibrary(libData) {
        if (!libData) return null;

        // Library returns Tithi object with name, index
        const tithi = libData.calData?.Tithi || libData.calcData?.Tithi;
        if (!tithi) return null;

        const index = tithi.index || 0;
        const paksha = index < 15 ? 'शुक्ल' : 'कृष्ण';
        const pakshaEn = index < 15 ? 'Shukla' : 'Krishna';

        return {
            index: index,
            name: TITHIS[index] || tithi.name,
            paksha: paksha,
            pakshaEn: pakshaEn,
            fullName: `${paksha} ${TITHIS[index] || tithi.name}`,
            progress: 0,
            angle: index * 12
        };
    }

    function mapNakshatraFromLibrary(libData) {
        if (!libData) return null;

        const nakshatra = libData.calData?.Nakshatra || libData.calcData?.Nakshatra;
        if (!nakshatra) return null;

        const index = nakshatra.index || 0;

        return {
            index: index,
            name: NAKSHATRAS[index] || nakshatra.name,
            nameEn: NAKSHATRAS_EN[index] || nakshatra.name,
            progress: 0,
            longitude: 0
        };
    }

    function mapYogaFromLibrary(libData) {
        if (!libData) return null;

        const yoga = libData.calData?.Yoga || libData.calcData?.Yoga;
        if (!yoga) return null;

        const index = yoga.index || 0;

        return {
            index: index,
            name: YOGAS[index] || yoga.name,
            nameEn: YOGAS_EN[index] || yoga.name,
            progress: 0
        };
    }

    function mapKaranaFromLibrary(libData) {
        if (!libData) return null;

        const karana = libData.calData?.Karna || libData.calcData?.Karna;
        if (!karana) return null;

        const index = karana.index || 0;

        return {
            index: index,
            name: KARANAS[index % 11] || karana.name,
            nameEn: KARANAS_EN[index % 11] || karana.name,
            number: index
        };
    }

    // === FALLBACK CALCULATIONS (if library not available) ===

    function dateToJD(date) {
        // Use LOCAL time, not UTC
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate() +
            date.getHours() / 24 +
            date.getMinutes() / 1440 +
            date.getSeconds() / 86400;

        let y = year;
        let m = month;
        if (m <= 2) {
            y -= 1;
            m += 12;
        }

        const a = Math.floor(y / 100);
        const b = 2 - a + Math.floor(a / 4);

        return Math.floor(365.25 * (y + 4716)) +
            Math.floor(30.6001 * (m + 1)) +
            day + b - 1524.5;
    }

    function normalizeAngle(angle) {
        angle = angle % 360;
        if (angle < 0) angle += 360;
        return angle;
    }

    function getSunLongitude(jd) {
        const J2000 = 2451545.0;
        const t = (jd - J2000) / 36525;

        // Mean longitude of the Sun (VSOP87 simplified)
        // L0 = 280.46646 + 36000.76983*T + 0.0003032*T^2 (degrees)
        let L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
        L0 = normalizeAngle(L0);

        // Mean anomaly of the Sun
        let M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
        M = normalizeAngle(M) * DEG_TO_RAD;

        // Equation of center
        const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M) +
            (0.019993 - 0.000101 * t) * Math.sin(2 * M) +
            0.000289 * Math.sin(3 * M);

        // Sun's true longitude
        let sunLong = L0 + C;

        // Apparent longitude (correction for nutation and aberration)
        const omega = 125.04 - 1934.136 * t;
        sunLong = sunLong - 0.00569 - 0.00478 * Math.sin(omega * DEG_TO_RAD);

        return normalizeAngle(sunLong);
    }

    function getMoonLongitude(jd) {
        const J2000 = 2451545.0;
        const t = (jd - J2000) / 36525;

        let Lp = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t;
        let D = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t;
        let M = 357.5291092 + 35999.0502909 * t;
        let Mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t;
        let F = 93.272095 + 483202.0175233 * t - 0.0036539 * t * t;

        D = normalizeAngle(D) * DEG_TO_RAD;
        M = normalizeAngle(M) * DEG_TO_RAD;
        Mp = normalizeAngle(Mp) * DEG_TO_RAD;
        F = normalizeAngle(F) * DEG_TO_RAD;

        let dL = 6.289 * Math.sin(Mp)
            + 1.274 * Math.sin(2 * D - Mp)
            + 0.658 * Math.sin(2 * D)
            + 0.214 * Math.sin(2 * Mp)
            - 0.186 * Math.sin(M)
            - 0.114 * Math.sin(2 * F)
            + 0.059 * Math.sin(2 * D - 2 * Mp)
            + 0.057 * Math.sin(2 * D - M - Mp)
            + 0.053 * Math.sin(2 * D + Mp)
            + 0.046 * Math.sin(2 * D - M)
            - 0.041 * Math.sin(M - Mp)
            - 0.035 * Math.sin(D)
            - 0.031 * Math.sin(M + Mp);

        return normalizeAngle(Lp + dL);
    }

    function getLahiriAyanamsa(jd) {
        const J2000 = 2451545.0;
        const AYANAMSA_BASE = 23.85;
        const AYANAMSA_RATE = 50.2564 / 3600;
        return AYANAMSA_BASE + AYANAMSA_RATE * (jd - J2000) / 365.25;
    }

    function calculateTithiFallback(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);

        let angle = moonLong - sunLong;
        if (angle < 0) angle += 360;

        const tithiIndex = Math.floor(angle / 12);
        const tithiProgress = (angle % 12) / 12;

        const paksha = tithiIndex < 15 ? 'शुक्ल' : 'कृष्ण';
        const pakshaEn = tithiIndex < 15 ? 'Shukla' : 'Krishna';

        return {
            index: tithiIndex,
            name: TITHIS[tithiIndex],
            paksha: paksha,
            pakshaEn: pakshaEn,
            fullName: `${paksha} ${TITHIS[tithiIndex]}`,
            progress: tithiProgress,
            angle: angle
        };
    }

    function calculateNakshatraFallback(jd) {
        const moonLong = getMoonLongitude(jd);
        const ayanamsa = getLahiriAyanamsa(jd);

        let siderealMoon = moonLong - ayanamsa;
        if (siderealMoon < 0) siderealMoon += 360;

        const nakshatraIndex = Math.floor(siderealMoon / (360 / 27));
        const nakshatraProgress = (siderealMoon % (360 / 27)) / (360 / 27);

        return {
            index: nakshatraIndex,
            name: NAKSHATRAS[nakshatraIndex],
            nameEn: NAKSHATRAS_EN[nakshatraIndex],
            progress: nakshatraProgress,
            longitude: siderealMoon
        };
    }

    function calculateYogaFallback(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        const ayanamsa = getLahiriAyanamsa(jd);

        const siderealSun = normalizeAngle(sunLong - ayanamsa);
        const siderealMoon = normalizeAngle(moonLong - ayanamsa);

        let sum = siderealSun + siderealMoon;
        if (sum >= 360) sum -= 360;

        const yogaIndex = Math.floor(sum / (360 / 27));

        return {
            index: yogaIndex,
            name: YOGAS[yogaIndex],
            nameEn: YOGAS_EN[yogaIndex],
            progress: (sum % (360 / 27)) / (360 / 27)
        };
    }

    function calculateKaranaFallback(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);

        let angle = moonLong - sunLong;
        if (angle < 0) angle += 360;

        const karanaNum = Math.floor(angle / 6);

        let karanaIndex;
        if (karanaNum === 0) karanaIndex = 10;
        else if (karanaNum === 57) karanaIndex = 7;
        else if (karanaNum === 58) karanaIndex = 8;
        else if (karanaNum === 59) karanaIndex = 9;
        else karanaIndex = ((karanaNum - 1) % 7);

        return {
            index: karanaIndex,
            name: KARANAS[karanaIndex],
            nameEn: KARANAS_EN[karanaIndex],
            number: karanaNum
        };
    }

    // === MUHURAT CALCULATIONS ===

    function calculateRahuKalam(sunTimes, dayOfWeek) {
        const rahuSlots = [8, 2, 7, 5, 6, 4, 3];
        const slot = rahuSlots[dayOfWeek];

        const slotDuration = sunTimes.dayDuration / 8;
        const start = sunTimes.sunrise + (slot - 1) * slotDuration;
        const end = start + slotDuration;

        return {
            start: start,
            end: end,
            startTime: hoursToTime(start),
            endTime: hoursToTime(end)
        };
    }

    function calculateChoghadiya(sunTimes, dayOfWeek) {
        const dayChogs = [
            { name: 'उद्वेग', type: 'udveg', good: false },
            { name: 'चल', type: 'chal', good: true },
            { name: 'लाभ', type: 'labh', good: true },
            { name: 'अमृत', type: 'amrit', good: true },
            { name: 'काल', type: 'kaal', good: false },
            { name: 'शुभ', type: 'shubh', good: true },
            { name: 'रोग', type: 'rog', good: false },
            { name: 'उद्वेग', type: 'udveg', good: false }
        ];

        const slotDuration = sunTimes.dayDuration / 8;
        const rotated = [...dayChogs.slice(dayOfWeek % 7), ...dayChogs.slice(0, dayOfWeek % 7)];

        return rotated.map((chog, i) => ({
            ...chog,
            start: sunTimes.sunrise + i * slotDuration,
            end: sunTimes.sunrise + (i + 1) * slotDuration,
            startTime: hoursToTime(sunTimes.sunrise + i * slotDuration),
            endTime: hoursToTime(sunTimes.sunrise + (i + 1) * slotDuration)
        }));
    }

    // === TARA BALA ===

    function calculateTaraBala(birthNakshatraIndex, dayNakshatraIndex) {
        let distance = (dayNakshatraIndex - birthNakshatraIndex + 27) % 27;
        const taraIndex = distance % 9;

        return {
            ...TARA_BALA[taraIndex],
            distance: distance,
            index: taraIndex
        };
    }

    // === SAMVATSARA ===

    function calculateSamvatsara(year, tradition = 'north') {
        let samvatsaraIndex;
        if (tradition === 'north') {
            const vikramSamvat = year + 57;
            samvatsaraIndex = (vikramSamvat + 9) % 60;
        } else {
            const sakaYear = year - 78;
            samvatsaraIndex = (sakaYear + 12) % 60;
        }

        return {
            index: samvatsaraIndex,
            name: SAMVATSARAS[samvatsaraIndex],
            vikramSamvat: year + 57,
            sakaYear: year - 78
        };
    }

    // === MAIN PANCHANG FUNCTION ===

    function getPanchang(date, lat, lon) {
        const sunTimes = calculateSunrise(date, lat, lon);
        const dayOfWeek = date.getDay();

        // Create sunrise date for calculations
        const sunriseDate = new Date(date);
        sunriseDate.setHours(Math.floor(sunTimes.sunrise),
            Math.floor((sunTimes.sunrise % 1) * 60), 0, 0);
        const jd = dateToJD(sunriseDate);

        // Try to get data from mhah-panchang library
        const libData = getPanchangFromLibrary(sunriseDate, lat, lon);

        let tithi, nakshatra, yoga, karana;

        if (libData && libData.calcData) {
            // Use library data (more accurate)
            tithi = mapTithiFromLibrary(libData) || calculateTithiFallback(jd);
            nakshatra = mapNakshatraFromLibrary(libData) || calculateNakshatraFallback(jd);
            yoga = mapYogaFromLibrary(libData) || calculateYogaFallback(jd);
            karana = mapKaranaFromLibrary(libData) || calculateKaranaFallback(jd);
        } else {
            // Fallback to local calculations
            tithi = calculateTithiFallback(jd);
            nakshatra = calculateNakshatraFallback(jd);
            yoga = calculateYogaFallback(jd);
            karana = calculateKaranaFallback(jd);
        }

        const choghadiya = calculateChoghadiya(sunTimes, dayOfWeek);
        const rahuKalam = calculateRahuKalam(sunTimes, dayOfWeek);
        const samvatsara = calculateSamvatsara(date.getFullYear());

        // Moon illumination
        const lunation = (tithi.angle / 360);
        let illumination = lunation <= 0.5 ? lunation * 2 * 100 : (1 - lunation) * 2 * 100;

        return {
            date: date,
            jd: jd,
            tithi: tithi,
            nakshatra: nakshatra,
            yoga: yoga,
            karana: karana,
            sunTimes: sunTimes,
            choghadiya: choghadiya,
            rahuKalam: rahuKalam,
            samvatsara: samvatsara,
            moonIllumination: Math.round(illumination),
            ayanamsa: getLahiriAyanamsa(jd),
            libraryUsed: !!libData
        };
    }

    // === PUBLIC API ===
    return {
        getPanchang: getPanchang,
        calculateTaraBala: calculateTaraBala,
        calculateSamvatsara: calculateSamvatsara,
        calculateSunrise: calculateSunrise,
        calculateChoghadiya: calculateChoghadiya,
        calculateRahuKalam: calculateRahuKalam,
        dateToJD: dateToJD,
        getLahiriAyanamsa: getLahiriAyanamsa,
        NAKSHATRAS: NAKSHATRAS,
        NAKSHATRAS_EN: NAKSHATRAS_EN,
        TITHIS: TITHIS,
        YOGAS: YOGAS,
        KARANAS: KARANAS,
        HINDU_MONTHS: HINDU_MONTHS,
        SAMVATSARAS: SAMVATSARAS,
        TARA_BALA: TARA_BALA
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VedicEphemeris;
}
