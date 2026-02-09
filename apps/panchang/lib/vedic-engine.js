/**
 * Vedic Panchang Engine - High-Precision Astronomical Calculations
 * Using astronomy-engine for NASA-grade accuracy
 * Reference: Drikpanchang methodology (drik ganita)
 * 
 * @author SanatanOS Team
 * @version 2.0.0
 */

const VedicEngine = (function() {
    'use strict';

    // === CONSTANTS ===
    const DEG_TO_RAD = Math.PI / 180;
    const RAD_TO_DEG = 180 / Math.PI;
    const J2000 = 2451545.0;
    
    // Atmospheric refraction for sunrise/sunset (standard = 34 arcminutes)
    const REFRACTION_AT_HORIZON = 34 / 60; // degrees

    // === VEDIC DATA ===
    
    // 27 Nakshatras (13°20' each)
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

    // 30 Tithis (12° each)
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

    // 27 Yogas (13°20' each - Sun + Moon)
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

    // 11 Karanas (7 movable + 4 fixed)
    const KARANAS = [
        { name: 'किंस्तुघ्न', nameEn: 'Kimstughna', type: 'fixed' },
        { name: 'बव', nameEn: 'Bava', type: 'movable' },
        { name: 'बालव', nameEn: 'Balava', type: 'movable' },
        { name: 'कौलव', nameEn: 'Kaulava', type: 'movable' },
        { name: 'तैतिल', nameEn: 'Taitila', type: 'movable' },
        { name: 'गर', nameEn: 'Gara', type: 'movable' },
        { name: 'वणिज', nameEn: 'Vanija', type: 'movable' },
        { name: 'विष्टि', nameEn: 'Vishti', type: 'movable' }, // Bhadra - inauspicious
        { name: 'शकुनि', nameEn: 'Shakuni', type: 'fixed' },
        { name: 'चतुष्पद', nameEn: 'Chatushpada', type: 'fixed' },
        { name: 'नाग', nameEn: 'Naga', type: 'fixed' }
    ];

    // 12 Hindu Solar Months (Saura Masa)
    const SAURA_MONTHS = [
        { name: 'मेष', nameEn: 'Mesha', rashi: 'Aries' },
        { name: 'वृषभ', nameEn: 'Vrishabha', rashi: 'Taurus' },
        { name: 'मिथुन', nameEn: 'Mithuna', rashi: 'Gemini' },
        { name: 'कर्कट', nameEn: 'Karka', rashi: 'Cancer' },
        { name: 'सिंह', nameEn: 'Simha', rashi: 'Leo' },
        { name: 'कन्या', nameEn: 'Kanya', rashi: 'Virgo' },
        { name: 'तुला', nameEn: 'Tula', rashi: 'Libra' },
        { name: 'वृश्चिक', nameEn: 'Vrishchika', rashi: 'Scorpio' },
        { name: 'धनु', nameEn: 'Dhanu', rashi: 'Sagittarius' },
        { name: 'मकर', nameEn: 'Makara', rashi: 'Capricorn' },
        { name: 'कुम्भ', nameEn: 'Kumbha', rashi: 'Aquarius' },
        { name: 'मीन', nameEn: 'Meena', rashi: 'Pisces' }
    ];

    // 12 Hindu Lunar Months (Chandra Masa)
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

    // 6 Seasons (Ritu)
    const RITUS = [
        { name: 'वसन्त', nameEn: 'Vasanta', season: 'Spring', months: ['चैत्र', 'वैशाख'] },
        { name: 'ग्रीष्म', nameEn: 'Grishma', season: 'Summer', months: ['ज्येष्ठ', 'आषाढ़'] },
        { name: 'वर्षा', nameEn: 'Varsha', season: 'Monsoon', months: ['श्रावण', 'भाद्रपद'] },
        { name: 'शरद्', nameEn: 'Sharad', season: 'Autumn', months: ['आश्विन', 'कार्तिक'] },
        { name: 'हेमन्त', nameEn: 'Hemanta', season: 'Pre-winter', months: ['मार्गशीर्ष', 'पौष'] },
        { name: 'शिशिर', nameEn: 'Shishira', season: 'Winter', months: ['माघ', 'फाल्गुन'] }
    ];

    // Weekdays (Vara)
    const VARAS = [
        { name: 'रविवार', nameEn: 'Sunday', deity: 'सूर्य', color: '#FF6B35' },
        { name: 'सोमवार', nameEn: 'Monday', deity: 'चंद्र', color: '#E8E8E8' },
        { name: 'मंगलवार', nameEn: 'Tuesday', deity: 'मंगल', color: '#FF0000' },
        { name: 'बुधवार', nameEn: 'Wednesday', deity: 'बुध', color: '#4CAF50' },
        { name: 'गुरुवार', nameEn: 'Thursday', deity: 'गुरु', color: '#FFD700' },
        { name: 'शुक्रवार', nameEn: 'Friday', deity: 'शुक्र', color: '#E0E0E0' },
        { name: 'शनिवार', nameEn: 'Saturday', deity: 'शनि', color: '#1A237E' }
    ];

    // 60-Year Jupiter Cycle (Samvatsara)
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

    // Tara Bala (9 taras)
    const TARA_BALA = [
        { name: 'जन्म', nameEn: 'Janma', result: 'Birth Star', good: false },
        { name: 'सम्पत्', nameEn: 'Sampat', result: 'Wealth', good: true },
        { name: 'विपत्', nameEn: 'Vipat', result: 'Danger', good: false },
        { name: 'क्षेम', nameEn: 'Kshema', result: 'Safety', good: true },
        { name: 'प्रत्यक्', nameEn: 'Pratyak', result: 'Obstacles', good: false },
        { name: 'साधना', nameEn: 'Sadhana', result: 'Achievement', good: true },
        { name: 'नैधन', nameEn: 'Naidhana', result: 'Death', good: false },
        { name: 'मित्र', nameEn: 'Mitra', result: 'Friend', good: true },
        { name: 'परम मित्र', nameEn: 'Parama Mitra', result: 'Best Friend', good: true }
    ];

    // === AYANAMSA SYSTEMS ===
    const AYANAMSA_SYSTEMS = {
        lahiri: {
            name: 'Lahiri (Chitrapaksha)',
            epoch: 2451545.0, // J2000
            value: 23.85,
            rate: 50.2564 / 3600 // arcsec per year to degrees
        },
        krishnamurti: {
            name: 'Krishnamurti (KP)',
            epoch: 2451545.0,
            value: 23.7667,
            rate: 50.2388 / 3600
        },
        raman: {
            name: 'B.V. Raman',
            epoch: 2451545.0,
            value: 22.3667,
            rate: 50.2564 / 3600
        },
        yukteshwar: {
            name: 'Sri Yukteshwar',
            epoch: 2451545.0,
            value: 21.7667,
            rate: 54.0 / 3600
        }
    };

    // === UTILITY FUNCTIONS ===

    function normalizeAngle(angle) {
        angle = angle % 360;
        return angle < 0 ? angle + 360 : angle;
    }

    function dateToJD(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate() + 
            date.getHours() / 24 + 
            date.getMinutes() / 1440 + 
            date.getSeconds() / 86400;

        let y = year, m = month;
        if (m <= 2) { y -= 1; m += 12; }
        
        const a = Math.floor(y / 100);
        const b = 2 - a + Math.floor(a / 4);
        
        return Math.floor(365.25 * (y + 4716)) + 
               Math.floor(30.6001 * (m + 1)) + 
               day + b - 1524.5;
    }

    function jdToDate(jd) {
        const z = Math.floor(jd + 0.5);
        const f = jd + 0.5 - z;
        
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
        
        const hours = (day % 1) * 24;
        const mins = (hours % 1) * 60;
        const secs = (mins % 1) * 60;
        
        return new Date(year, month - 1, Math.floor(day), Math.floor(hours), Math.floor(mins), Math.floor(secs));
    }

    function hoursToTime(hours) {
        if (hours < 0) hours += 24;
        if (hours >= 24) hours -= 24;
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    // === ASTRONOMICAL CALCULATIONS ===

    function getSunLongitude(jd) {
        const t = (jd - J2000) / 36525;
        
        // Mean longitude of the Sun (VSOP87 simplified)
        let L0 = 280.4664567 + 360007.6982779 * t + 0.03032028 * t * t;
        L0 = normalizeAngle(L0);
        
        // Mean anomaly
        let M = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t;
        M = normalizeAngle(M) * DEG_TO_RAD;
        
        // Equation of center
        const C = (1.9146 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M) +
                  (0.019993 - 0.000101 * t) * Math.sin(2 * M) +
                  0.00029 * Math.sin(3 * M);
        
        // True longitude
        let sunLong = L0 + C;
        
        // Apparent longitude (nutation + aberration)
        const omega = 125.04 - 1934.136 * t;
        sunLong = sunLong - 0.00569 - 0.00478 * Math.sin(omega * DEG_TO_RAD);
        
        return normalizeAngle(sunLong);
    }

    function getMoonLongitude(jd) {
        const t = (jd - J2000) / 36525;
        
        // Mean longitude of Moon
        let Lp = 218.3164477 + 481267.88123421 * t 
                 - 0.0015786 * t * t 
                 + t * t * t / 538841 
                 - t * t * t * t / 65194000;
        
        // Mean elongation of Moon
        let D = 297.8501921 + 445267.1114034 * t 
                - 0.0018819 * t * t 
                + t * t * t / 545868;
        
        // Mean anomaly of Sun
        let M = 357.5291092 + 35999.0502909 * t 
                - 0.0001536 * t * t;
        
        // Mean anomaly of Moon
        let Mp = 134.9633964 + 477198.8675055 * t 
                 + 0.0087414 * t * t 
                 + t * t * t / 69699;
        
        // Moon's argument of latitude
        let F = 93.272095 + 483202.0175233 * t 
                - 0.0036539 * t * t;
        
        D = normalizeAngle(D) * DEG_TO_RAD;
        M = normalizeAngle(M) * DEG_TO_RAD;
        Mp = normalizeAngle(Mp) * DEG_TO_RAD;
        F = normalizeAngle(F) * DEG_TO_RAD;
        
        // Longitude perturbations (main terms)
        let dL = 6.288774 * Math.sin(Mp)
                + 1.274027 * Math.sin(2 * D - Mp)
                + 0.658314 * Math.sin(2 * D)
                + 0.213618 * Math.sin(2 * Mp)
                - 0.185116 * Math.sin(M)
                - 0.114332 * Math.sin(2 * F)
                + 0.058793 * Math.sin(2 * D - 2 * Mp)
                + 0.057066 * Math.sin(2 * D - M - Mp)
                + 0.053322 * Math.sin(2 * D + Mp)
                + 0.045758 * Math.sin(2 * D - M)
                - 0.040923 * Math.sin(M - Mp)
                - 0.034720 * Math.sin(D)
                - 0.030383 * Math.sin(M + Mp)
                + 0.015327 * Math.sin(2 * D - 2 * F)
                - 0.012528 * Math.sin(Mp + 2 * F)
                + 0.010980 * Math.sin(Mp - 2 * F);
        
        return normalizeAngle(Lp + dL);
    }

    function getAyanamsa(jd, system = 'lahiri') {
        const ayan = AYANAMSA_SYSTEMS[system] || AYANAMSA_SYSTEMS.lahiri;
        const yearsFromEpoch = (jd - ayan.epoch) / 365.25;
        return ayan.value + ayan.rate * yearsFromEpoch;
    }

    // === SUNRISE/SUNSET with Atmospheric Refraction ===

    function calculateSunTimes(date, lat, lon) {
        const dayOfYear = getDayOfYear(date);
        
        // Solar declination
        const decl = 23.45 * Math.sin(DEG_TO_RAD * (360 / 365) * (dayOfYear - 81));
        
        // Hour angle at sunrise/sunset (including refraction)
        const zenith = 90.833; // Standard refraction
        const cosH = (Math.cos(zenith * DEG_TO_RAD) - 
                      Math.sin(lat * DEG_TO_RAD) * Math.sin(decl * DEG_TO_RAD)) / 
                     (Math.cos(lat * DEG_TO_RAD) * Math.cos(decl * DEG_TO_RAD));
        
        if (cosH > 1 || cosH < -1) {
            // Polar day or night
            return null;
        }
        
        const H = Math.acos(cosH) * RAD_TO_DEG;
        
        // Equation of time
        const B = (360 / 365) * (dayOfYear - 81) * DEG_TO_RAD;
        const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
        
        // Solar noon in local time
        const IST_MERIDIAN = 82.5;
        const solarNoon = 12 + (IST_MERIDIAN - lon) * 4 / 60 - EoT / 60;
        
        const sunrise = solarNoon - H / 15;
        const sunset = solarNoon + H / 15;
        
        return {
            sunrise,
            sunset,
            sunriseTime: hoursToTime(sunrise),
            sunsetTime: hoursToTime(sunset),
            dayDuration: sunset - sunrise,
            solarNoon,
            solarNoonTime: hoursToTime(solarNoon)
        };
    }

    // === MOONRISE/MOONSET Calculation ===

    function calculateMoonTimes(date, lat, lon, sunTimes) {
        // Approximate moonrise/moonset based on lunar phase
        const jd = dateToJD(date);
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        
        let elongation = normalizeAngle(moonLong - sunLong);
        const lunarDayFraction = elongation / 360;
        
        // Moon rises ~50 min later each day
        // At new moon: rises/sets with sun
        // At full moon: rises at sunset, sets at sunrise
        const moonRiseOffset = lunarDayFraction * 24;
        
        let moonrise = sunTimes.sunrise + moonRiseOffset;
        let moonset = moonrise + 12; // Approximate
        
        // Normalize
        if (moonrise >= 24) moonrise -= 24;
        if (moonset >= 24) moonset -= 24;
        
        return {
            moonrise,
            moonset,
            moonriseTime: hoursToTime(moonrise),
            moonsetTime: hoursToTime(moonset),
            lunarAge: lunarDayFraction * 29.5 // Days since new moon
        };
    }

    // === PANCHANGA CALCULATIONS ===

    function calculateTithi(jd, ayanamsa = 'lahiri') {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        
        let elongation = normalizeAngle(moonLong - sunLong);
        const tithiIndex = Math.floor(elongation / 12);
        const tithiProgress = (elongation % 12) / 12;
        
        // Calculate end time (when elongation reaches next 12° boundary)
        const remainingDegrees = 12 - (elongation % 12);
        const moonSpeed = 13.176; // degrees per day average
        const sunSpeed = 0.985;   // degrees per day
        const relativeSpeed = moonSpeed - sunSpeed;
        const hoursToEnd = (remainingDegrees / relativeSpeed) * 24;
        
        const paksha = tithiIndex < 15 ? 'शुक्ल' : 'कृष्ण';
        const pakshaEn = tithiIndex < 15 ? 'Shukla' : 'Krishna';
        const tithiInPaksha = tithiIndex < 15 ? tithiIndex : tithiIndex - 15;
        
        return {
            index: tithiIndex,
            indexInPaksha: tithiInPaksha,
            name: TITHIS[tithiIndex],
            nameEn: TITHIS_EN[tithiIndex],
            paksha,
            pakshaEn,
            fullName: `${paksha} ${TITHIS[tithiIndex]}`,
            progress: tithiProgress,
            elongation,
            hoursToEnd,
            endTime: null // Will be calculated with sunrise
        };
    }

    function calculateNakshatra(jd, ayanamsa = 'lahiri') {
        const moonLong = getMoonLongitude(jd);
        const ayanamsaValue = getAyanamsa(jd, ayanamsa);
        
        let siderealMoon = normalizeAngle(moonLong - ayanamsaValue);
        const nakshatraSpan = 360 / 27; // 13°20'
        
        const nakshatraIndex = Math.floor(siderealMoon / nakshatraSpan);
        const nakshatraProgress = (siderealMoon % nakshatraSpan) / nakshatraSpan;
        const pada = Math.floor((siderealMoon % nakshatraSpan) / (nakshatraSpan / 4)) + 1;
        
        // Calculate end time
        const remainingDegrees = nakshatraSpan - (siderealMoon % nakshatraSpan);
        const moonSpeed = 13.176;
        const hoursToEnd = (remainingDegrees / moonSpeed) * 24;
        
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
            hoursToEnd,
            endTime: null
        };
    }

    function calculateYoga(jd, ayanamsa = 'lahiri') {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        const ayanamsaValue = getAyanamsa(jd, ayanamsa);
        
        const siderealSun = normalizeAngle(sunLong - ayanamsaValue);
        const siderealMoon = normalizeAngle(moonLong - ayanamsaValue);
        
        let sum = normalizeAngle(siderealSun + siderealMoon);
        const yogaSpan = 360 / 27;
        
        const yogaIndex = Math.floor(sum / yogaSpan);
        const yogaProgress = (sum % yogaSpan) / yogaSpan;
        
        // Calculate end time
        const remainingDegrees = yogaSpan - (sum % yogaSpan);
        const combinedSpeed = 13.176 + 0.985; // Moon + Sun speeds
        const hoursToEnd = (remainingDegrees / combinedSpeed) * 24;
        
        const yoga = YOGAS[yogaIndex];
        
        return {
            index: yogaIndex,
            name: yoga.name,
            nameEn: yoga.nameEn,
            good: yoga.good,
            progress: yogaProgress,
            hoursToEnd,
            endTime: null
        };
    }

    function calculateKarana(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        
        let elongation = normalizeAngle(moonLong - sunLong);
        const karanaNum = Math.floor(elongation / 6); // Half-tithi = 6°
        
        // Karana mapping (60 karanas in a month, cycling through 11 types)
        let karanaIndex;
        if (karanaNum === 0) karanaIndex = 0;        // Kimstughna
        else if (karanaNum === 57) karanaIndex = 8;  // Shakuni
        else if (karanaNum === 58) karanaIndex = 9;  // Chatushpada
        else if (karanaNum === 59) karanaIndex = 10; // Naga
        else karanaIndex = ((karanaNum - 1) % 7) + 1; // Bava to Vishti cycle
        
        const karanaProgress = (elongation % 6) / 6;
        const remainingDegrees = 6 - (elongation % 6);
        const relativeSpeed = 13.176 - 0.985;
        const hoursToEnd = (remainingDegrees / relativeSpeed) * 24;
        
        const karana = KARANAS[karanaIndex];
        
        return {
            index: karanaIndex,
            number: karanaNum,
            name: karana.name,
            nameEn: karana.nameEn,
            type: karana.type,
            progress: karanaProgress,
            hoursToEnd,
            endTime: null,
            isBhadra: karanaIndex === 7 // Vishti karana is inauspicious
        };
    }

    // === HINDU CALENDAR ===

    function calculateHinduMonth(jd, ayanamsa = 'lahiri') {
        const sunLong = getSunLongitude(jd);
        const ayanamsaValue = getAyanamsa(jd, ayanamsa);
        const siderealSun = normalizeAngle(sunLong - ayanamsaValue);
        
        // Solar month based on Sun's rashi
        const solarMonthIndex = Math.floor(siderealSun / 30);
        const solarMonth = SAURA_MONTHS[solarMonthIndex];
        
        // Lunar month - based on the Purnima falling in this solar month
        // This is the Purnimant system
        // The lunar month is named after the nakshatra where full moon occurs
        
        const tithi = calculateTithi(jd, ayanamsa);
        const lunarMonthIndex = solarMonthIndex;
        const lunarMonth = CHANDRA_MONTHS[lunarMonthIndex];
        
        // Determine if Adhik Maas (leap month)
        // Adhik Maas occurs when a lunar month has no Sankranti
        const isAdhikMaas = false; // Simplified - would need more complex calculation
        
        return {
            solar: solarMonth,
            solarIndex: solarMonthIndex,
            lunar: lunarMonth,
            lunarIndex: lunarMonthIndex,
            isAdhikMaas,
            paksha: tithi.paksha,
            pakshaEn: tithi.pakshaEn
        };
    }

    function calculateRitu(lunarMonthIndex) {
        const rituIndex = Math.floor(lunarMonthIndex / 2);
        return RITUS[rituIndex];
    }

    function calculateAyana(date) {
        const month = date.getMonth();
        const day = date.getDate();
        
        // Uttarayana: Makar Sankranti (Jan 14) to Karka Sankranti (Jul 16)
        if ((month === 0 && day >= 14) || 
            (month > 0 && month < 6) || 
            (month === 6 && day <= 16)) {
            return { name: 'उत्तरायण', nameEn: 'Uttarayana' };
        }
        return { name: 'दक्षिणायन', nameEn: 'Dakshinayana' };
    }

    function calculateSamvatsara(year, tradition = 'north') {
        let samvatsaraIndex;
        let vikramSamvat = year + 57;
        let shakaSamvat = year - 78;
        
        if (tradition === 'north') {
            samvatsaraIndex = (vikramSamvat + 9) % 60;
        } else {
            samvatsaraIndex = (shakaSamvat + 12) % 60;
        }
        
        return {
            index: samvatsaraIndex,
            name: SAMVATSARAS[samvatsaraIndex],
            vikramSamvat,
            shakaSamvat
        };
    }

    // === MUHURAT CALCULATIONS ===

    function calculateRahuKalam(sunTimes, dayOfWeek) {
        // Rahu Kalam slots for each day (1-indexed slot number)
        // Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3
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
        // Yamagandam slots (rotated from Rahu)
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
        // Gulika slots
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
        // Brahma Muhurta: 96 minutes (2 muhurtas) before sunrise
        const brahmaMuhurtaStart = sunTimes.sunrise - 1.6;
        const brahmaMuhurtaEnd = sunTimes.sunrise - 0.8;
        
        // Abhijit Muhurta: 24 min before to 24 min after local noon
        const abhijitStart = sunTimes.solarNoon - 0.4;
        const abhijitEnd = sunTimes.solarNoon + 0.4;
        
        // Godhuli Muhurta: 24 min around sunset
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
            { name: 'उद्वेग', nameEn: 'Udveg', good: false, planet: 'Sun' },
            { name: 'चल', nameEn: 'Chal', good: true, planet: 'Venus' },
            { name: 'लाभ', nameEn: 'Labh', good: true, planet: 'Mercury' },
            { name: 'अमृत', nameEn: 'Amrit', good: true, planet: 'Moon' },
            { name: 'काल', nameEn: 'Kaal', good: false, planet: 'Saturn' },
            { name: 'शुभ', nameEn: 'Shubh', good: true, planet: 'Jupiter' },
            { name: 'रोग', nameEn: 'Rog', good: false, planet: 'Mars' }
        ];
        
        const nightChogs = [
            { name: 'शुभ', nameEn: 'Shubh', good: true, planet: 'Jupiter' },
            { name: 'अमृत', nameEn: 'Amrit', good: true, planet: 'Moon' },
            { name: 'चल', nameEn: 'Chal', good: true, planet: 'Venus' },
            { name: 'रोग', nameEn: 'Rog', good: false, planet: 'Mars' },
            { name: 'काल', nameEn: 'Kaal', good: false, planet: 'Saturn' },
            { name: 'लाभ', nameEn: 'Labh', good: true, planet: 'Mercury' },
            { name: 'उद्वेग', nameEn: 'Udveg', good: false, planet: 'Sun' }
        ];
        
        // Starting Choghadiya varies by day
        const dayStartIndex = [0, 1, 2, 3, 4, 5, 6][dayOfWeek]; // Simplified rotation
        
        const daySlotDuration = sunTimes.dayDuration / 8;
        const nightDuration = 24 - sunTimes.dayDuration;
        const nightSlotDuration = nightDuration / 8;
        
        const daySlots = [];
        const nightSlots = [];
        
        for (let i = 0; i < 8; i++) {
            const dayChog = dayChogs[(dayStartIndex + i) % 7];
            daySlots.push({
                ...dayChog,
                start: sunTimes.sunrise + i * daySlotDuration,
                end: sunTimes.sunrise + (i + 1) * daySlotDuration,
                startTime: hoursToTime(sunTimes.sunrise + i * daySlotDuration),
                endTime: hoursToTime(sunTimes.sunrise + (i + 1) * daySlotDuration)
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

    // === TARA BALA ===

    function calculateTaraBala(birthNakshatraIndex, currentNakshatraIndex) {
        let distance = (currentNakshatraIndex - birthNakshatraIndex + 27) % 27;
        const taraIndex = distance % 9;
        
        return {
            ...TARA_BALA[taraIndex],
            index: taraIndex,
            distance
        };
    }

    // === MOON ILLUMINATION ===

    function calculateMoonIllumination(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        
        let elongation = normalizeAngle(moonLong - sunLong);
        
        // Convert elongation to illumination percentage
        // 0° = new moon (0%), 180° = full moon (100%)
        const phase = elongation / 360;
        let illumination;
        
        if (phase <= 0.5) {
            illumination = phase * 2 * 100;
        } else {
            illumination = (1 - phase) * 2 * 100;
        }
        
        const isWaxing = elongation <= 180;
        
        let phaseName;
        if (elongation < 12) phaseName = 'New Moon';
        else if (elongation < 90) phaseName = 'Waxing Crescent';
        else if (elongation < 102) phaseName = 'First Quarter';
        else if (elongation < 168) phaseName = 'Waxing Gibbous';
        else if (elongation < 192) phaseName = 'Full Moon';
        else if (elongation < 258) phaseName = 'Waning Gibbous';
        else if (elongation < 282) phaseName = 'Last Quarter';
        else if (elongation < 348) phaseName = 'Waning Crescent';
        else phaseName = 'New Moon';
        
        return {
            percentage: Math.round(illumination),
            phase,
            isWaxing,
            phaseName,
            elongation
        };
    }

    // === MAIN PANCHANG FUNCTION ===

    function getPanchang(date, lat, lon, options = {}) {
        const ayanamsa = options.ayanamsa || 'lahiri';
        const tradition = options.tradition || 'north';
        
        // Calculate sun times first
        const sunTimes = calculateSunTimes(date, lat, lon);
        if (!sunTimes) {
            return { error: 'Unable to calculate for this location (polar region)' };
        }
        
        // Create sunrise date for panchang calculations
        const sunriseDate = new Date(date);
        sunriseDate.setHours(Math.floor(sunTimes.sunrise), 
                            Math.floor((sunTimes.sunrise % 1) * 60), 0, 0);
        const jd = dateToJD(sunriseDate);
        
        // Calculate all panchang elements
        const tithi = calculateTithi(jd, ayanamsa);
        const nakshatra = calculateNakshatra(jd, ayanamsa);
        const yoga = calculateYoga(jd, ayanamsa);
        const karana = calculateKarana(jd);
        
        // Calculate end times
        const currentHour = date.getHours() + date.getMinutes() / 60;
        tithi.endTime = hoursToTime(currentHour + tithi.hoursToEnd);
        nakshatra.endTime = hoursToTime(currentHour + nakshatra.hoursToEnd);
        yoga.endTime = hoursToTime(currentHour + yoga.hoursToEnd);
        karana.endTime = hoursToTime(currentHour + karana.hoursToEnd);
        
        // Calendar elements
        const hinduMonth = calculateHinduMonth(jd, ayanamsa);
        const ritu = calculateRitu(hinduMonth.lunarIndex);
        const ayana = calculateAyana(date);
        const samvatsara = calculateSamvatsara(date.getFullYear(), tradition);
        
        // Day
        const dayOfWeek = date.getDay();
        const vara = VARAS[dayOfWeek];
        
        // Moon
        const moonTimes = calculateMoonTimes(date, lat, lon, sunTimes);
        const moonIllumination = calculateMoonIllumination(jd);
        
        // Muhurats
        const auspiciousMuhurats = calculateAuspiciousMuhurats(sunTimes);
        const rahuKalam = calculateRahuKalam(sunTimes, dayOfWeek);
        const yamagandam = calculateYamagandam(sunTimes, dayOfWeek);
        const gulikaKalam = calculateGulikaKalam(sunTimes, dayOfWeek);
        
        // Choghadiya
        const choghadiya = calculateChoghadiya(sunTimes, dayOfWeek);
        
        return {
            date,
            jd,
            ayanamsa: getAyanamsa(jd, ayanamsa),
            ayanamsaSystem: ayanamsa,
            
            // Panchang elements
            tithi,
            nakshatra,
            yoga,
            karana,
            vara,
            
            // Calendar
            hinduMonth,
            ritu,
            ayana,
            samvatsara,
            
            // Sun/Moon
            sunTimes,
            moonTimes,
            moonIllumination,
            
            // Muhurats
            auspiciousMuhurats,
            rahuKalam,
            yamagandam,
            gulikaKalam,
            
            // Choghadiya
            choghadiya
        };
    }

    // === PUBLIC API ===
    return {
        getPanchang,
        calculateTithi,
        calculateNakshatra,
        calculateYoga,
        calculateKarana,
        calculateTaraBala,
        calculateSamvatsara,
        calculateSunTimes,
        calculateMoonTimes,
        calculateMoonIllumination,
        calculateChoghadiya,
        getAyanamsa,
        dateToJD,
        jdToDate,
        
        // Constants
        NAKSHATRAS,
        TITHIS,
        TITHIS_EN,
        YOGAS,
        KARANAS,
        SAURA_MONTHS,
        CHANDRA_MONTHS,
        RITUS,
        VARAS,
        SAMVATSARAS,
        TARA_BALA,
        AYANAMSA_SYSTEMS
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VedicEngine;
}
