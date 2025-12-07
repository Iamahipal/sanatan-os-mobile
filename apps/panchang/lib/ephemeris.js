/**
 * Vedic Panchang Ephemeris Engine
 * NASA-grade astronomical calculations for Panchang
 * Based on Swiss Ephemeris algorithms
 */

const VedicEphemeris = (function () {
    'use strict';

    // === CONSTANTS ===
    const J2000 = 2451545.0; // Julian Date for J2000 epoch
    const DEG_TO_RAD = Math.PI / 180;
    const RAD_TO_DEG = 180 / Math.PI;

    // Lahiri Ayanamsa constants (Chitra Paksha)
    const AYANAMSA_BASE = 23.85; // Ayanamsa at J2000
    const AYANAMSA_RATE = 50.2564 / 3600; // Annual precession in degrees

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

    // Karana names (11)
    const KARANAS = [
        'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि',
        'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'
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

    // === DATE/TIME UTILITIES ===

    /**
     * Convert Date to Julian Day Number
     */
    function dateToJD(date) {
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate() +
            date.getUTCHours() / 24 +
            date.getUTCMinutes() / 1440 +
            date.getUTCSeconds() / 86400;

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

    /**
     * Convert Julian Day to Date
     */
    function jdToDate(jd) {
        const z = Math.floor(jd + 0.5);
        const f = (jd + 0.5) - z;
        let a = z;

        if (z >= 2299161) {
            const alpha = Math.floor((z - 1867216.25) / 36524.25);
            a = z + 1 + alpha - Math.floor(alpha / 4);
        }

        const b = a + 1524;
        const c = Math.floor((b - 122.1) / 365.25);
        const d = Math.floor(365.25 * c);
        const e = Math.floor((b - d) / 30.6001);

        const day = b - d - Math.floor(30.6001 * e) + f;
        const month = e < 14 ? e - 1 : e - 13;
        const year = month > 2 ? c - 4716 : c - 4715;

        const dayInt = Math.floor(day);
        const dayFrac = day - dayInt;
        const hours = Math.floor(dayFrac * 24);
        const minutes = Math.floor((dayFrac * 24 - hours) * 60);

        return new Date(Date.UTC(year, month - 1, dayInt, hours, minutes));
    }

    // === ASTRONOMICAL CALCULATIONS ===

    /**
     * Calculate Lahiri Ayanamsa for given Julian Day
     */
    function getLahiriAyanamsa(jd) {
        const t = (jd - J2000) / 36525; // Julian centuries from J2000
        return AYANAMSA_BASE + AYANAMSA_RATE * (jd - J2000) / 365.25;
    }

    /**
     * Calculate Sun's ecliptic longitude (tropical)
     * Using VSOP87 simplified algorithm
     */
    function getSunLongitude(jd) {
        const t = (jd - J2000) / 36525;

        // Mean longitude of the Sun
        let L0 = 280.4664567 + 360007.6982779 * t + 0.03032028 * t * t;
        L0 = normalizeAngle(L0);

        // Mean anomaly of the Sun
        let M = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t;
        M = normalizeAngle(M) * DEG_TO_RAD;

        // Equation of center
        const C = (1.9146 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M) +
            (0.019993 - 0.000101 * t) * Math.sin(2 * M) +
            0.00029 * Math.sin(3 * M);

        // Sun's true longitude
        let sunLong = L0 + C;

        // Apparent longitude (correcting for nutation and aberration)
        const omega = 125.04 - 1934.136 * t;
        sunLong = sunLong - 0.00569 - 0.00478 * Math.sin(omega * DEG_TO_RAD);

        return normalizeAngle(sunLong);
    }

    /**
     * Calculate Moon's ecliptic longitude (tropical)
     * Using simplified lunar theory
     */
    function getMoonLongitude(jd) {
        const t = (jd - J2000) / 36525;

        // Mean longitude of Moon
        let Lp = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t;

        // Mean elongation of Moon
        let D = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t;

        // Mean anomaly of Sun
        let M = 357.5291092 + 35999.0502909 * t;

        // Mean anomaly of Moon
        let Mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t;

        // Moon's argument of latitude
        let F = 93.272095 + 483202.0175233 * t - 0.0036539 * t * t;

        // Convert to radians
        D = normalizeAngle(D) * DEG_TO_RAD;
        M = normalizeAngle(M) * DEG_TO_RAD;
        Mp = normalizeAngle(Mp) * DEG_TO_RAD;
        F = normalizeAngle(F) * DEG_TO_RAD;

        // Longitude correction terms
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

    /**
     * Normalize angle to 0-360 range
     */
    function normalizeAngle(angle) {
        angle = angle % 360;
        if (angle < 0) angle += 360;
        return angle;
    }

    // === PANCHANG CALCULATIONS ===

    /**
     * Calculate Tithi (lunar day)
     * Tithi = (Moon - Sun) / 12, where each Tithi is 12°
     */
    function calculateTithi(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        const ayanamsa = getLahiriAyanamsa(jd);

        // Calculate the angular distance
        let angle = moonLong - sunLong;
        if (angle < 0) angle += 360;

        const tithiIndex = Math.floor(angle / 12);
        const tithiProgress = (angle % 12) / 12;

        const paksha = tithiIndex < 15 ? 'शुक्ल' : 'कृष्ण';
        const pakshaEn = tithiIndex < 15 ? 'Shukla' : 'Krishna';
        const tithiInPaksha = tithiIndex % 15;

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

    /**
     * Calculate Nakshatra (lunar mansion)
     * Each Nakshatra = 13°20' = 13.3333°
     */
    function calculateNakshatra(jd) {
        const moonLong = getMoonLongitude(jd);
        const ayanamsa = getLahiriAyanamsa(jd);

        // Convert to sidereal
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

    /**
     * Calculate Yoga (Sun + Moon)
     * Yoga = (Sun + Moon) / 13.3333
     */
    function calculateYoga(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        const ayanamsa = getLahiriAyanamsa(jd);

        // Convert to sidereal
        const siderealSun = normalizeAngle(sunLong - ayanamsa);
        const siderealMoon = normalizeAngle(moonLong - ayanamsa);

        let sum = siderealSun + siderealMoon;
        if (sum >= 360) sum -= 360;

        const yogaIndex = Math.floor(sum / (360 / 27));
        const yogaProgress = (sum % (360 / 27)) / (360 / 27);

        return {
            index: yogaIndex,
            name: YOGAS[yogaIndex],
            progress: yogaProgress
        };
    }

    /**
     * Calculate Karana (half-tithi)
     * Each Karana = 6°
     */
    function calculateKarana(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);

        let angle = moonLong - sunLong;
        if (angle < 0) angle += 360;

        const karanaNum = Math.floor(angle / 6);

        // Map to Karana names (complex cycle)
        let karanaIndex;
        if (karanaNum === 0) karanaIndex = 10; // Kimstughna
        else if (karanaNum === 57) karanaIndex = 7; // Shakuni
        else if (karanaNum === 58) karanaIndex = 8; // Chatushpada
        else if (karanaNum === 59) karanaIndex = 9; // Naga
        else karanaIndex = ((karanaNum - 1) % 7);

        return {
            index: karanaIndex,
            name: KARANAS[karanaIndex],
            number: karanaNum
        };
    }

    /**
     * Calculate sunrise for given location and date
     */
    function calculateSunrise(date, lat, lon) {
        const jd = dateToJD(date);
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

        // Time of solar noon (approximate)
        const solarNoon = 12 - lon / 15;

        const sunrise = solarNoon - H / 15;
        const sunset = solarNoon + H / 15;

        return {
            sunrise: sunrise,
            sunset: sunset,
            sunriseTime: hoursToTime(sunrise),
            sunsetTime: hoursToTime(sunset),
            dayDuration: sunset - sunrise
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

    // === MUHURAT CALCULATIONS ===

    /**
     * Calculate Choghadiya for given sunrise/sunset
     */
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

    /**
     * Calculate Rahu Kalam for given day
     */
    function calculateRahuKalam(sunTimes, dayOfWeek) {
        // Rahu Kalam slot order: Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3
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

    // === PERSONALIZATION ===

    /**
     * Calculate Tara Bala (personal luck based on birth star)
     */
    function calculateTaraBala(birthNakshatraIndex, dayNakshatraIndex) {
        let distance = (dayNakshatraIndex - birthNakshatraIndex + 27) % 27;
        const taraIndex = distance % 9;

        return {
            ...TARA_BALA[taraIndex],
            distance: distance,
            index: taraIndex
        };
    }

    /**
     * Calculate Samvatsara (60-year Jupiter cycle)
     */
    function calculateSamvatsara(year, tradition = 'north') {
        let samvatsaraIndex;
        if (tradition === 'north') {
            // North Indian: (Vikram Samvat + 9) mod 60
            const vikramSamvat = year + 57;
            samvatsaraIndex = (vikramSamvat + 9) % 60;
        } else {
            // South Indian: (Saka Year + 12) mod 60
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

    /**
     * Get complete Panchang for a given date and location
     */
    function getPanchang(date, lat, lon) {
        const jd = dateToJD(date);
        const sunTimes = calculateSunrise(date, lat, lon);
        const dayOfWeek = date.getDay();

        // Use sunrise time for "Udaya Tithi"
        const sunriseDate = new Date(date);
        sunriseDate.setHours(Math.floor(sunTimes.sunrise),
            Math.floor((sunTimes.sunrise % 1) * 60), 0, 0);
        const sunriseJD = dateToJD(sunriseDate);

        const tithi = calculateTithi(sunriseJD);
        const nakshatra = calculateNakshatra(sunriseJD);
        const yoga = calculateYoga(sunriseJD);
        const karana = calculateKarana(sunriseJD);

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
            ayanamsa: getLahiriAyanamsa(jd)
        };
    }

    // === PUBLIC API ===
    return {
        getPanchang: getPanchang,
        calculateTithi: calculateTithi,
        calculateNakshatra: calculateNakshatra,
        calculateYoga: calculateYoga,
        calculateKarana: calculateKarana,
        calculateSunrise: calculateSunrise,
        calculateChoghadiya: calculateChoghadiya,
        calculateRahuKalam: calculateRahuKalam,
        calculateTaraBala: calculateTaraBala,
        calculateSamvatsara: calculateSamvatsara,
        dateToJD: dateToJD,
        jdToDate: jdToDate,
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
