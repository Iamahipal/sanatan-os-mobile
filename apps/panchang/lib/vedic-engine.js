/**
 * Vedic Panchang Engine - High-Precision using astronomy-engine
 * Uses NASA/JPL-grade ephemeris calculations
 * Accuracy: ±1 arcminute for planetary positions
 * 
 * Reference: Drikpanchang methodology (Drik Ganita)
 * @author SanatanOS Team
 * @version 3.0.0
 */

const VedicEngine = (function () {
    'use strict';

    // Check if astronomy-engine is loaded
    if (typeof Astronomy === 'undefined') {
        console.error('astronomy-engine not loaded!');
        return null;
    }

    // === CONSTANTS ===
    const DEG_TO_RAD = Math.PI / 180;
    const RAD_TO_DEG = 180 / Math.PI;

    // === VEDIC DATA ===

    // 27 Nakshatras (13°20' each = 800 arcmin)
    const NAKSHATRAS = [
        { name: 'अश्विनी', nameEn: 'Ashwini', lord: 'केतु', deity: 'अश्विनी कुमार' },
        { name: 'भरणी', nameEn: 'Bharani', lord: 'शुक्र', deity: 'यम' },
        { name: 'कृत्तिका', nameEn: 'Krittika', lord: 'सूर्य', deity: 'अग्नि' },
        { name: 'रोहिणी', nameEn: 'Rohini', lord: 'चंद्र', deity: 'ब्रह्मा' },
        { name: 'मृगशिरा', nameEn: 'Mrigashira', lord: 'मंगल', deity: 'सोम' },
        { name: 'आर्द्रा', nameEn: 'Ardra', lord: 'राहु', deity: 'रुद्र' },
        { name: 'पुनर्वसु', nameEn: 'Punarvasu', lord: 'गुरु', deity: 'अदिति' },
        { name: 'पुष्य', nameEn: 'Pushya', lord: 'शनि', deity: 'बृहस्पति' },
        { name: 'आश्लेषा', nameEn: 'Ashlesha', lord: 'बुध', deity: 'सर्प' },
        { name: 'मघा', nameEn: 'Magha', lord: 'केतु', deity: 'पितृ' },
        { name: 'पूर्वाफाल्गुनी', nameEn: 'Purva Phalguni', lord: 'शुक्र', deity: 'भग' },
        { name: 'उत्तराफाल्गुनी', nameEn: 'Uttara Phalguni', lord: 'सूर्य', deity: 'अर्यमा' },
        { name: 'हस्त', nameEn: 'Hasta', lord: 'चंद्र', deity: 'सवितृ' },
        { name: 'चित्रा', nameEn: 'Chitra', lord: 'मंगल', deity: 'विश्वकर्मा' },
        { name: 'स्वाति', nameEn: 'Swati', lord: 'राहु', deity: 'वायु' },
        { name: 'विशाखा', nameEn: 'Vishakha', lord: 'गुरु', deity: 'इंद्राग्नि' },
        { name: 'अनुराधा', nameEn: 'Anuradha', lord: 'शनि', deity: 'मित्र' },
        { name: 'ज्येष्ठा', nameEn: 'Jyeshtha', lord: 'बुध', deity: 'इंद्र' },
        { name: 'मूल', nameEn: 'Mula', lord: 'केतु', deity: 'निऋति' },
        { name: 'पूर्वाषाढ़ा', nameEn: 'Purva Ashadha', lord: 'शुक्र', deity: 'अप्' },
        { name: 'उत्तराषाढ़ा', nameEn: 'Uttara Ashadha', lord: 'सूर्य', deity: 'विश्वेदेवा' },
        { name: 'श्रवण', nameEn: 'Shravana', lord: 'चंद्र', deity: 'विष्णु' },
        { name: 'धनिष्ठा', nameEn: 'Dhanishtha', lord: 'मंगल', deity: 'वसु' },
        { name: 'शतभिषा', nameEn: 'Shatabhisha', lord: 'राहु', deity: 'वरुण' },
        { name: 'पूर्वाभाद्रपद', nameEn: 'Purva Bhadrapada', lord: 'गुरु', deity: 'अजैकपाद' },
        { name: 'उत्तराभाद्रपद', nameEn: 'Uttara Bhadrapada', lord: 'शनि', deity: 'अहिर्बुध्न्य' },
        { name: 'रेवती', nameEn: 'Revati', lord: 'बुध', deity: 'पूषा' }
    ];

    // 30 Tithis
    const TITHIS = [
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
        'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
        'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
        'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
        'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या'
    ];

    const TITHIS_EN = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
    ];

    // 27 Yogas
    const YOGAS = [
        { name: 'विष्कुम्भ', nameEn: 'Vishkumbha', good: false },
        { name: 'प्रीति', nameEn: 'Priti', good: true },
        { name: 'आयुष्मान', nameEn: 'Ayushman', good: true },
        { name: 'सौभाग्य', nameEn: 'Saubhagya', good: true },
        { name: 'शोभन', nameEn: 'Shobhana', good: true },
        { name: 'अतिगण्ड', nameEn: 'Atiganda', good: false },
        { name: 'सुकर्मा', nameEn: 'Sukarma', good: true },
        { name: 'धृति', nameEn: 'Dhriti', good: true },
        { name: 'शूल', nameEn: 'Shula', good: false },
        { name: 'गण्ड', nameEn: 'Ganda', good: false },
        { name: 'वृद्धि', nameEn: 'Vriddhi', good: true },
        { name: 'ध्रुव', nameEn: 'Dhruva', good: true },
        { name: 'व्याघात', nameEn: 'Vyaghata', good: false },
        { name: 'हर्षण', nameEn: 'Harshana', good: true },
        { name: 'वज्र', nameEn: 'Vajra', good: false },
        { name: 'सिद्धि', nameEn: 'Siddhi', good: true },
        { name: 'व्यतीपात', nameEn: 'Vyatipata', good: false },
        { name: 'वरीयान', nameEn: 'Variyana', good: true },
        { name: 'परिघ', nameEn: 'Parigha', good: false },
        { name: 'शिव', nameEn: 'Shiva', good: true },
        { name: 'सिद्ध', nameEn: 'Siddha', good: true },
        { name: 'साध्य', nameEn: 'Sadhya', good: true },
        { name: 'शुभ', nameEn: 'Shubha', good: true },
        { name: 'शुक्ल', nameEn: 'Shukla', good: true },
        { name: 'ब्रह्म', nameEn: 'Brahma', good: true },
        { name: 'इन्द्र', nameEn: 'Indra', good: true },
        { name: 'वैधृति', nameEn: 'Vaidhriti', good: false }
    ];

    // 11 Karanas
    const KARANAS = [
        { name: 'किंस्तुघ्न', nameEn: 'Kimstughna', type: 'fixed' },
        { name: 'बव', nameEn: 'Bava', type: 'movable' },
        { name: 'बालव', nameEn: 'Balava', type: 'movable' },
        { name: 'कौलव', nameEn: 'Kaulava', type: 'movable' },
        { name: 'तैतिल', nameEn: 'Taitila', type: 'movable' },
        { name: 'गर', nameEn: 'Gara', type: 'movable' },
        { name: 'वणिज', nameEn: 'Vanija', type: 'movable' },
        { name: 'विष्टि', nameEn: 'Vishti', type: 'movable' },
        { name: 'शकुनि', nameEn: 'Shakuni', type: 'fixed' },
        { name: 'चतुष्पद', nameEn: 'Chatushpada', type: 'fixed' },
        { name: 'नाग', nameEn: 'Naga', type: 'fixed' }
    ];

    // Lunar months
    const CHANDRA_MONTHS = [
        { name: 'चैत्र', nameEn: 'Chaitra' },
        { name: 'वैशाख', nameEn: 'Vaishakha' },
        { name: 'ज्येष्ठ', nameEn: 'Jyeshtha' },
        { name: 'आषाढ़', nameEn: 'Ashadha' },
        { name: 'श्रावण', nameEn: 'Shravana' },
        { name: 'भाद्रपद', nameEn: 'Bhadrapada' },
        { name: 'आश्विन', nameEn: 'Ashwin' },
        { name: 'कार्तिक', nameEn: 'Kartika' },
        { name: 'मार्गशीर्ष', nameEn: 'Margashirsha' },
        { name: 'पौष', nameEn: 'Pausha' },
        { name: 'माघ', nameEn: 'Magha' },
        { name: 'फाल्गुन', nameEn: 'Phalguna' }
    ];

    // Weekdays
    const VARAS = [
        { name: 'रविवार', nameEn: 'Sunday', deity: 'सूर्य', color: '#FF6B35' },
        { name: 'सोमवार', nameEn: 'Monday', deity: 'चंद्र', color: '#E8E8E8' },
        { name: 'मंगलवार', nameEn: 'Tuesday', deity: 'मंगल', color: '#FF0000' },
        { name: 'बुधवार', nameEn: 'Wednesday', deity: 'बुध', color: '#4CAF50' },
        { name: 'गुरुवार', nameEn: 'Thursday', deity: 'गुरु', color: '#FFD700' },
        { name: 'शुक्रवार', nameEn: 'Friday', deity: 'शुक्र', color: '#E0E0E0' },
        { name: 'शनिवार', nameEn: 'Saturday', deity: 'शनि', color: '#1A237E' }
    ];

    // 60-Year Samvatsara cycle
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

    // === AYANAMSA - Using Lahiri (Chitrapaksha) ===
    // Lahiri Ayanamsa as of J2000.0 = 23°51'11" = 23.85305556°
    // Precession rate = 50.2564" per year

    function getAyanamsa(date) {
        const J2000 = new Date('2000-01-01T12:00:00Z');
        const yearsSinceJ2000 = (date - J2000) / (365.25 * 24 * 60 * 60 * 1000);
        const lahiriJ2000 = 23 + 51 / 60 + 11 / 3600; // 23°51'11" at J2000
        const precessionRate = 50.2564 / 3600; // arcsec to degrees per year
        return lahiriJ2000 + precessionRate * yearsSinceJ2000;
    }

    // === ASTRONOMY-ENGINE WRAPPERS ===

    function getSunLongitude(date) {
        const sun = Astronomy.SunPosition(date);
        return sun.elon; // Ecliptic longitude
    }

    function getMoonLongitude(date) {
        // Get Moon's geocentric ecliptic coordinates
        const moon = Astronomy.GeoMoon(date);
        const ecliptic = Astronomy.Ecliptic(moon);
        return ecliptic.elon;
    }

    function getSunMoonElongation(date) {
        const sunLong = getSunLongitude(date);
        const moonLong = getMoonLongitude(date);
        let elongation = moonLong - sunLong;
        if (elongation < 0) elongation += 360;
        return elongation;
    }

    function getSiderealMoon(date) {
        const moonLong = getMoonLongitude(date);
        const ayanamsa = getAyanamsa(date);
        let sidereal = moonLong - ayanamsa;
        if (sidereal < 0) sidereal += 360;
        return sidereal;
    }

    function getSiderealSun(date) {
        const sunLong = getSunLongitude(date);
        const ayanamsa = getAyanamsa(date);
        let sidereal = sunLong - ayanamsa;
        if (sidereal < 0) sidereal += 360;
        return sidereal;
    }

    // === HIGH-PRECISION SUNRISE/SUNSET ===

    function calculateSunTimes(date, lat, lon) {
        const observer = new Astronomy.Observer(lat, lon, 0);

        // Search for sunrise/sunset on this day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        let sunrise, sunset;

        try {
            // Search for sunrise (direction = +1 means rises above horizon)
            const sunriseResult = Astronomy.SearchRiseSet(
                Astronomy.Body.Sun,
                observer,
                +1, // rising
                startOfDay,
                1 // search 1 day ahead
            );
            sunrise = sunriseResult ? sunriseResult.date : null;

            // Search for sunset
            const sunsetResult = Astronomy.SearchRiseSet(
                Astronomy.Body.Sun,
                observer,
                -1, // setting
                startOfDay,
                1
            );
            sunset = sunsetResult ? sunsetResult.date : null;
        } catch (e) {
            console.error('Sunrise/sunset calculation error:', e);
            return null;
        }

        if (!sunrise || !sunset) {
            return null;
        }

        const sunriseHours = sunrise.getHours() + sunrise.getMinutes() / 60;
        const sunsetHours = sunset.getHours() + sunset.getMinutes() / 60;
        const solarNoonHours = (sunriseHours + sunsetHours) / 2;

        return {
            sunrise: sunriseHours,
            sunset: sunsetHours,
            sunriseDate: sunrise,
            sunsetDate: sunset,
            sunriseTime: formatTime(sunrise),
            sunsetTime: formatTime(sunset),
            dayDuration: sunsetHours - sunriseHours,
            solarNoon: solarNoonHours,
            solarNoonTime: hoursToTime(solarNoonHours)
        };
    }

    function calculateMoonTimes(date, lat, lon) {
        const observer = new Astronomy.Observer(lat, lon, 0);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        let moonrise, moonset;

        try {
            const moonriseResult = Astronomy.SearchRiseSet(
                Astronomy.Body.Moon,
                observer,
                +1,
                startOfDay,
                1
            );
            moonrise = moonriseResult ? moonriseResult.date : null;

            const moonsetResult = Astronomy.SearchRiseSet(
                Astronomy.Body.Moon,
                observer,
                -1,
                startOfDay,
                1
            );
            moonset = moonsetResult ? moonsetResult.date : null;
        } catch (e) {
            console.error('Moonrise/moonset error:', e);
        }

        return {
            moonrise: moonrise ? moonrise.getHours() + moonrise.getMinutes() / 60 : null,
            moonset: moonset ? moonset.getHours() + moonset.getMinutes() / 60 : null,
            moonriseTime: moonrise ? formatTime(moonrise) : '--:--',
            moonsetTime: moonset ? formatTime(moonset) : '--:--'
        };
    }

    // === PANCHANG CALCULATIONS ===

    function calculateTithi(date, sunriseDate) {
        const elongation = getSunMoonElongation(date);
        const tithiIndex = Math.floor(elongation / 12);
        const tithiProgress = (elongation % 12) / 12;

        // Calculate end time using binary search for precision
        const endTime = findTithiEndTime(date, tithiIndex);

        const paksha = tithiIndex < 15 ? 'शुक्ल' : 'कृष्ण';
        const pakshaEn = tithiIndex < 15 ? 'Shukla' : 'Krishna';

        return {
            index: tithiIndex,
            name: TITHIS[tithiIndex],
            nameEn: TITHIS_EN[tithiIndex],
            paksha,
            pakshaEn,
            fullName: `${paksha} ${TITHIS[tithiIndex]}`,
            progress: tithiProgress,
            elongation,
            endTime: formatTime(endTime),
            endTimeDate: endTime
        };
    }

    function findTithiEndTime(currentDate, currentTithiIndex) {
        // Binary search for when tithi changes
        let low = new Date(currentDate);
        let high = new Date(currentDate);
        high.setHours(high.getHours() + 30); // Max 30 hours ahead

        const targetElongation = (currentTithiIndex + 1) * 12;

        for (let i = 0; i < 20; i++) { // 20 iterations for ~1 second precision
            const mid = new Date((low.getTime() + high.getTime()) / 2);
            let elongation = getSunMoonElongation(mid);
            if (elongation < targetElongation - 180) elongation += 360;

            if (elongation < targetElongation) {
                low = mid;
            } else {
                high = mid;
            }
        }

        return high;
    }

    function calculateNakshatra(date) {
        const siderealMoon = getSiderealMoon(date);
        const nakshatraSpan = 360 / 27;
        const nakshatraIndex = Math.floor(siderealMoon / nakshatraSpan);
        const nakshatraProgress = (siderealMoon % nakshatraSpan) / nakshatraSpan;
        const pada = Math.floor((siderealMoon % nakshatraSpan) / (nakshatraSpan / 4)) + 1;

        // Find end time
        const endTime = findNakshatraEndTime(date, nakshatraIndex);

        const nakshatra = NAKSHATRAS[nakshatraIndex];

        return {
            index: nakshatraIndex,
            name: nakshatra.name,
            nameEn: nakshatra.nameEn,
            lord: nakshatra.lord,
            deity: nakshatra.deity,
            pada,
            progress: nakshatraProgress,
            longitude: siderealMoon,
            endTime: formatTime(endTime),
            endTimeDate: endTime
        };
    }

    function findNakshatraEndTime(currentDate, currentIndex) {
        const nakshatraSpan = 360 / 27;
        const targetLong = ((currentIndex + 1) * nakshatraSpan) % 360;

        let low = new Date(currentDate);
        let high = new Date(currentDate);
        high.setHours(high.getHours() + 30);

        for (let i = 0; i < 20; i++) {
            const mid = new Date((low.getTime() + high.getTime()) / 2);
            let moonLong = getSiderealMoon(mid);

            // Handle wrap-around at 360°
            let diff = targetLong - moonLong;
            if (diff < -180) diff += 360;
            if (diff > 180) diff -= 360;

            if (diff > 0) {
                low = mid;
            } else {
                high = mid;
            }
        }

        return high;
    }

    function calculateYoga(date) {
        const siderealSun = getSiderealSun(date);
        const siderealMoon = getSiderealMoon(date);
        let sum = (siderealSun + siderealMoon) % 360;

        const yogaSpan = 360 / 27;
        const yogaIndex = Math.floor(sum / yogaSpan);
        const yogaProgress = (sum % yogaSpan) / yogaSpan;

        const endTime = findYogaEndTime(date, yogaIndex);
        const yoga = YOGAS[yogaIndex];

        return {
            index: yogaIndex,
            name: yoga.name,
            nameEn: yoga.nameEn,
            good: yoga.good,
            progress: yogaProgress,
            endTime: formatTime(endTime),
            endTimeDate: endTime
        };
    }

    function findYogaEndTime(currentDate, currentIndex) {
        const yogaSpan = 360 / 27;
        const targetSum = ((currentIndex + 1) * yogaSpan) % 360;

        let low = new Date(currentDate);
        let high = new Date(currentDate);
        high.setHours(high.getHours() + 24);

        for (let i = 0; i < 20; i++) {
            const mid = new Date((low.getTime() + high.getTime()) / 2);
            let sum = (getSiderealSun(mid) + getSiderealMoon(mid)) % 360;

            let diff = targetSum - sum;
            if (diff < -180) diff += 360;
            if (diff > 180) diff -= 360;

            if (diff > 0) {
                low = mid;
            } else {
                high = mid;
            }
        }

        return high;
    }

    function calculateKarana(date) {
        const elongation = getSunMoonElongation(date);
        const karanaNum = Math.floor(elongation / 6);

        let karanaIndex;
        if (karanaNum === 0) karanaIndex = 0;
        else if (karanaNum === 57) karanaIndex = 8;
        else if (karanaNum === 58) karanaIndex = 9;
        else if (karanaNum === 59) karanaIndex = 10;
        else karanaIndex = ((karanaNum - 1) % 7) + 1;

        const karanaProgress = (elongation % 6) / 6;
        const endTime = findKaranaEndTime(date, karanaNum);

        const karana = KARANAS[karanaIndex];

        return {
            index: karanaIndex,
            number: karanaNum,
            name: karana.name,
            nameEn: karana.nameEn,
            type: karana.type,
            progress: karanaProgress,
            endTime: formatTime(endTime),
            endTimeDate: endTime,
            isBhadra: karanaIndex === 7
        };
    }

    function findKaranaEndTime(currentDate, currentKaranaNum) {
        const targetElongation = ((currentKaranaNum + 1) * 6) % 360;

        let low = new Date(currentDate);
        let high = new Date(currentDate);
        high.setHours(high.getHours() + 15);

        for (let i = 0; i < 18; i++) {
            const mid = new Date((low.getTime() + high.getTime()) / 2);
            let elongation = getSunMoonElongation(mid);

            let diff = targetElongation - elongation;
            if (diff < -180) diff += 360;
            if (diff > 180) diff -= 360;

            if (diff > 0) {
                low = mid;
            } else {
                high = mid;
            }
        }

        return high;
    }

    // === HINDU CALENDAR ===

    function calculateHinduMonth(date) {
        const siderealSun = getSiderealSun(date);
        const solarMonthIndex = Math.floor(siderealSun / 30);
        const lunarMonthIndex = solarMonthIndex;

        return {
            solar: { name: ['मेष', 'वृषभ', 'मिथुन', 'कर्कट', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][solarMonthIndex], index: solarMonthIndex },
            lunar: CHANDRA_MONTHS[lunarMonthIndex],
            lunarIndex: lunarMonthIndex
        };
    }

    function calculateAyana(date) {
        const siderealSun = getSiderealSun(date);
        // Uttarayana: Makara to Mithuna (270° to 90°)
        // Dakshinayana: Karka to Dhanu (90° to 270°)
        if (siderealSun >= 270 || siderealSun < 90) {
            return { name: 'उत्तरायण', nameEn: 'Uttarayana' };
        }
        return { name: 'दक्षिणायन', nameEn: 'Dakshinayana' };
    }

    function calculateSamvatsara(year) {
        const vikramSamvat = year + 57;
        const shakaSamvat = year - 78;
        const samvatsaraIndex = (vikramSamvat + 9) % 60;

        return {
            index: samvatsaraIndex,
            name: SAMVATSARAS[samvatsaraIndex],
            vikramSamvat,
            shakaSamvat
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
            slot,
            start,
            end,
            startTime: hoursToTime(start),
            endTime: hoursToTime(end)
        };
    }

    function calculateYamagandam(sunTimes, dayOfWeek) {
        const yamaSlots = [5, 4, 3, 2, 1, 7, 6];
        const slot = yamaSlots[dayOfWeek];
        const slotDuration = sunTimes.dayDuration / 8;
        const start = sunTimes.sunrise + (slot - 1) * slotDuration;
        const end = start + slotDuration;

        return {
            slot,
            start,
            end,
            startTime: hoursToTime(start),
            endTime: hoursToTime(end)
        };
    }

    function calculateGulikaKalam(sunTimes, dayOfWeek) {
        const gulikaSlots = [6, 5, 4, 3, 2, 1, 7];
        const slot = gulikaSlots[dayOfWeek];
        const slotDuration = sunTimes.dayDuration / 8;
        const start = sunTimes.sunrise + (slot - 1) * slotDuration;
        const end = start + slotDuration;

        return {
            slot,
            start,
            end,
            startTime: hoursToTime(start),
            endTime: hoursToTime(end)
        };
    }

    function calculateAuspiciousMuhurats(sunTimes) {
        // Brahma Muhurta: 1hr 36min before sunrise
        const brahmaMuhurtaStart = sunTimes.sunrise - 1.6;
        const brahmaMuhurtaEnd = sunTimes.sunrise - 0.8;

        // Abhijit Muhurta: 24 min around noon
        const abhijitStart = sunTimes.solarNoon - 0.4;
        const abhijitEnd = sunTimes.solarNoon + 0.4;

        // Godhuli: 24 min before sunset
        const godhuliStart = sunTimes.sunset - 0.4;
        const godhuliEnd = sunTimes.sunset;

        return {
            brahmaMuhurta: {
                start: brahmaMuhurtaStart,
                end: brahmaMuhurtaEnd,
                startTime: hoursToTime(brahmaMuhurtaStart),
                endTime: hoursToTime(brahmaMuhurtaEnd)
            },
            abhijitMuhurta: {
                start: abhijitStart,
                end: abhijitEnd,
                startTime: hoursToTime(abhijitStart),
                endTime: hoursToTime(abhijitEnd)
            },
            godhuliMuhurta: {
                start: godhuliStart,
                end: godhuliEnd,
                startTime: hoursToTime(godhuliStart),
                endTime: hoursToTime(godhuliEnd)
            }
        };
    }

    // === CHOGHADIYA ===

    function calculateChoghadiya(sunTimes, dayOfWeek) {
        const dayChogs = [
            { name: 'उद्वेग', nameEn: 'Udveg', good: false },
            { name: 'चल', nameEn: 'Chal', good: true },
            { name: 'लाभ', nameEn: 'Labh', good: true },
            { name: 'अमृत', nameEn: 'Amrit', good: true },
            { name: 'काल', nameEn: 'Kaal', good: false },
            { name: 'शुभ', nameEn: 'Shubh', good: true },
            { name: 'रोग', nameEn: 'Rog', good: false }
        ];

        const nightChogs = [
            { name: 'शुभ', nameEn: 'Shubh', good: true },
            { name: 'अमृत', nameEn: 'Amrit', good: true },
            { name: 'चल', nameEn: 'Chal', good: true },
            { name: 'रोग', nameEn: 'Rog', good: false },
            { name: 'काल', nameEn: 'Kaal', good: false },
            { name: 'लाभ', nameEn: 'Labh', good: true },
            { name: 'उद्वेग', nameEn: 'Udveg', good: false }
        ];

        const dayStartIndex = dayOfWeek;
        const daySlotDuration = sunTimes.dayDuration / 8;
        const nightDuration = 24 - sunTimes.dayDuration;
        const nightSlotDuration = nightDuration / 8;

        const daySlots = [];
        const nightSlots = [];

        for (let i = 0; i < 8; i++) {
            const dayChog = dayChogs[(dayStartIndex + i) % 7];
            const dayStart = sunTimes.sunrise + i * daySlotDuration;
            daySlots.push({
                ...dayChog,
                start: dayStart,
                end: dayStart + daySlotDuration,
                startTime: hoursToTime(dayStart),
                endTime: hoursToTime(dayStart + daySlotDuration)
            });

            const nightChog = nightChogs[(dayStartIndex + i) % 7];
            const nightStart = sunTimes.sunset + i * nightSlotDuration;
            nightSlots.push({
                ...nightChog,
                start: nightStart,
                end: nightStart + nightSlotDuration,
                startTime: hoursToTime(nightStart),
                endTime: hoursToTime(nightStart + nightSlotDuration)
            });
        }

        return { day: daySlots, night: nightSlots };
    }

    // === MOON ILLUMINATION ===

    function getMoonIllumination(date) {
        const illumination = Astronomy.Illumination(Astronomy.Body.Moon, date);
        const elongation = getSunMoonElongation(date);

        return {
            percentage: Math.round(illumination.phase_fraction * 100),
            phaseFraction: illumination.phase_fraction,
            isWaxing: elongation < 180,
            isWaning: elongation >= 180,
            phase: getPhaseNameFromElongation(elongation)
        };
    }

    function getPhaseNameFromElongation(elongation) {
        if (elongation < 22.5) return 'New Moon';
        if (elongation < 67.5) return 'Waxing Crescent';
        if (elongation < 112.5) return 'First Quarter';
        if (elongation < 157.5) return 'Waxing Gibbous';
        if (elongation < 202.5) return 'Full Moon';
        if (elongation < 247.5) return 'Waning Gibbous';
        if (elongation < 292.5) return 'Last Quarter';
        if (elongation < 337.5) return 'Waning Crescent';
        return 'New Moon';
    }

    // === UTILITY FUNCTIONS ===

    function formatTime(date) {
        if (!date) return '--:--';
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    function hoursToTime(hours) {
        if (hours < 0) hours += 24;
        if (hours >= 24) hours -= 24;
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    // === MAIN API ===

    // === DISHA SHOOL (Travel Prohibition) ===
    function getDishaShool(date) {
        const day = date.getDay(); // 0 = Sunday
        const rules = {
            1: { direction: 'East', directionHi: 'पूर्व', remedy: 'Eat Mirror/Sugar' }, // Mon
            6: { direction: 'East', directionHi: 'पूर्व', remedy: 'Eat Ginger/Urad' },  // Sat
            4: { direction: 'South', directionHi: 'दक्षिण', remedy: 'Eat Curd/Cumin' }, // Thu
            0: { direction: 'West', directionHi: 'पश्चिम', remedy: 'Eat Paan/Ghee' },   // Sun
            5: { direction: 'West', directionHi: 'पश्चिम', remedy: 'Eat Barley/Rai' },  // Fri
            2: { direction: 'North', directionHi: 'उत्तर', remedy: 'Eat Jaggery/Hari Dhaniya' }, // Tue
            3: { direction: 'North', directionHi: 'उत्तर', remedy: 'Eat Dhaniya/Sesame' },     // Wed
        };
        return rules[day];
    }

    // === PANCHAK (Inauspicious Period) ===
    function getPanchak(moonLong) {
        // Moon in Aquarius (300°) to Pisces (360°)
        // Specifically starts from Dhanishtha 3rd Pada (approx 293°20')?
        // Simpler rule: Moon in Kumbha (Aquarius) or Meena (Pisces)
        // Aquarius = 300-330, Pisces = 330-360
        // Actually Panchak is approx last 5 nakshatras:
        // Dhanishtha (1/2), Shatabhisha, P. Bhadrapada, U. Bhadrapada, Revati

        // Dhanishtha starts at 293°20'

        return moonLong >= 293.33 && moonLong < 360;
    }

    function getPanchang(date, lat, lon, options = {}) {
        try {
            const dateObj = new Date(date);
            const dayOfWeek = dateObj.getDay();

            // Calculate sunrise first (determines Vedic day)
            const sunTimes = calculateSunTimes(dateObj, lat, lon);
            if (!sunTimes) {
                return { error: 'Could not calculate sunrise for this location' };
            }

            // Use sunrise time for calculations (Udaya Tithi standard)
            const sunriseDate = sunTimes.sunriseDate;

            // Core Panchang elements
            const tithi = calculateTithi(sunriseDate, sunriseDate);
            const nakshatra = calculateNakshatra(sunriseDate);
            const yoga = calculateYoga(sunriseDate);
            const karana = calculateKarana(sunriseDate);

            // Calendar elements
            const hinduMonth = calculateHinduMonth(sunriseDate);
            const ayana = calculateAyana(sunriseDate);
            const samvatsara = calculateSamvatsara(dateObj.getFullYear());

            // Muhurat
            const rahuKalam = calculateRahuKalam(sunTimes, dayOfWeek);
            const yamagandam = calculateYamagandam(sunTimes, dayOfWeek);
            const gulikaKalam = calculateGulikaKalam(sunTimes, dayOfWeek);
            const auspiciousMuhurats = calculateAuspiciousMuhurats(sunTimes);

            // Choghadiya
            const choghadiya = calculateChoghadiya(sunTimes, dayOfWeek);

            // Moon info
            const moonTimes = calculateMoonTimes(dateObj, lat, lon);
            const moonIllumination = getMoonIllumination(sunriseDate);

            // Additional Calculations
            const dishaShool = getDishaShool(sunriseDate);
            const moonLong = getMoonLongitude(sunriseDate); // Needed for Panchak
            const isPanchak = getPanchak(moonLong);

            // Weekday
            const vara = VARAS[dayOfWeek];

            return {
                date: dateObj,
                sunriseDate,

                // Core elements
                tithi,
                nakshatra,
                yoga,
                karana,
                vara: {
                    index: dayOfWeek,
                    ...vara
                },

                // Calendar
                hinduMonth,
                ayana,
                samvatsara,

                // Times
                sunTimes,
                moonTimes,
                moonIllumination,

                // Muhurat
                rahuKalam,
                yamagandam,
                gulikaKalam,
                auspiciousMuhurats,
                choghadiya,

                // Guidance
                dishaShool,
                isPanchak,

                // Ayanamsa used
                ayanamsa: getAyanamsa(sunriseDate),
                ayanamsaSystem: 'Lahiri'
            };
        } catch (error) {
            console.error('Panchang calculation error:', error);
            return { error: error.message };
        }
    }

    // === PUBLIC API ===
    return {
        getPanchang,
        getSunLongitude,
        getMoonLongitude,
        getAyanamsa,
        calculateSunTimes,
        calculateMoonTimes,
        calculateTithi,
        calculateNakshatra,
        getMoonIllumination,
        NAKSHATRAS,
        TITHIS,
        YOGAS,
        KARANAS,
        VARAS,
        getSunLongitude,
        getMoonLongitude
    };

})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VedicEngine;
}
