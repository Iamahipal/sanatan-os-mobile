/**
 * Festival Calculator - Tithi-Based Festival Date Generation
 * Calculates Hindu festival dates dynamically based on astronomical conditions
 * 
 * @author SanatanOS Team
 * @version 2.0.0
 */

const FestivalCalculator = (function () {
    'use strict';

    // === FESTIVAL DEFINITIONS ===
    // Festivals are defined by their astronomical criteria, not fixed dates

    const FESTIVALS = {
        // === PAN-INDIAN FESTIVALS ===

        // SOLAR-BASED FESTIVALS (Sankranti)
        makar_sankranti: {
            name: 'मकर संक्रांति',
            nameEn: 'Makar Sankranti',
            type: 'solar',
            calculation: 'sun_enters_makara', // Sun enters Capricorn
            icon: '🪁',
            naivedya: 'Til Ladoo, Khichdi',
            significance: 'Sun begins its northward journey (Uttarayana)'
        },

        // TITHI-BASED FESTIVALS
        maha_shivaratri: {
            name: 'महाशिवरात्रि',
            nameEn: 'Maha Shivaratri',
            type: 'tithi',
            month: 'माघ', // Magha or Phalguna depending on calendar
            monthAlt: 'फाल्गुन',
            paksha: 'कृष्ण',
            tithi: 13, // Chaturdashi (14th tithi, but 0-indexed as 13)
            icon: '🔱',
            naivedya: 'Bel Patra, Milk, Bhang',
            significance: 'Night of Lord Shiva, most auspicious for Shiva worship'
        },

        holi: {
            name: 'होली',
            nameEn: 'Holi',
            type: 'tithi',
            month: 'फाल्गुन',
            paksha: 'शुक्ल',
            tithi: 14, // Purnima
            icon: '🎨',
            naivedya: 'Gujiya, Thandai',
            significance: 'Festival of colors celebrating spring'
        },

        holika_dahan: {
            name: 'होलिका दहन',
            nameEn: 'Holika Dahan',
            type: 'tithi',
            month: 'फाल्गुन',
            paksha: 'शुक्ल',
            tithi: 13, // Day before Purnima
            icon: '🔥',
            significance: 'Burning of Holika, victory of good over evil'
        },

        ram_navami: {
            name: 'राम नवमी',
            nameEn: 'Ram Navami',
            type: 'tithi',
            month: 'चैत्र',
            paksha: 'शुक्ल',
            tithi: 8, // Navami
            icon: '🏹',
            naivedya: 'Panakam, Kosambari',
            significance: 'Birthday of Lord Rama'
        },

        akshaya_tritiya: {
            name: 'अक्षय तृतीया',
            nameEn: 'Akshaya Tritiya',
            type: 'tithi',
            month: 'वैशाख',
            paksha: 'शुक्ल',
            tithi: 2, // Tritiya
            icon: '✨',
            significance: 'Most auspicious day for new beginnings'
        },

        buddha_purnima: {
            name: 'बुद्ध पूर्णिमा',
            nameEn: 'Buddha Purnima',
            type: 'tithi',
            month: 'वैशाख',
            paksha: 'शुक्ल',
            tithi: 14, // Purnima
            icon: '🪷',
            significance: 'Birth, Enlightenment, and Death of Buddha'
        },

        guru_purnima: {
            name: 'गुरु पूर्णिमा',
            nameEn: 'Guru Purnima',
            type: 'tithi',
            month: 'आषाढ़',
            paksha: 'शुक्ल',
            tithi: 14, // Purnima
            icon: '🙏',
            significance: 'Day to honor teachers and gurus'
        },

        raksha_bandhan: {
            name: 'रक्षा बंधन',
            nameEn: 'Raksha Bandhan',
            type: 'tithi',
            month: 'श्रावण',
            paksha: 'शुक्ल',
            tithi: 14, // Purnima
            icon: '🧵',
            significance: 'Sacred thread tying ceremony between siblings'
        },

        janmashtami: {
            name: 'श्री कृष्ण जन्माष्टमी',
            nameEn: 'Janmashtami',
            type: 'tithi',
            month: 'भाद्रपद',
            paksha: 'कृष्ण',
            tithi: 7, // Ashtami
            nakshatra: 'रोहिणी', // Ideally when Rohini nakshatra
            icon: '🎂',
            naivedya: 'Makhan Mishri, Panchamrit',
            significance: 'Birthday of Lord Krishna'
        },

        ganesh_chaturthi: {
            name: 'गणेश चतुर्थी',
            nameEn: 'Ganesh Chaturthi',
            type: 'tithi',
            month: 'भाद्रपद',
            paksha: 'शुक्ल',
            tithi: 3, // Chaturthi
            icon: '🐘',
            naivedya: 'Modak, Ladoo',
            significance: 'Birthday of Lord Ganesha'
        },

        anant_chaturdashi: {
            name: 'अनंत चतुर्दशी',
            nameEn: 'Anant Chaturdashi',
            type: 'tithi',
            month: 'भाद्रपद',
            paksha: 'शुक्ल',
            tithi: 13, // Chaturdashi
            icon: '🌊',
            significance: 'Ganesh Visarjan day'
        },

        navratri_start: {
            name: 'नवरात्रि प्रारंभ',
            nameEn: 'Navratri Begins',
            type: 'tithi',
            month: 'आश्विन',
            paksha: 'शुक्ल',
            tithi: 0, // Pratipada
            icon: '🙏',
            significance: 'Nine nights of Devi worship begin'
        },

        dussehra: {
            name: 'दशहरा',
            nameEn: 'Dussehra / Vijayadashami',
            type: 'tithi',
            month: 'आश्विन',
            paksha: 'शुक्ल',
            tithi: 9, // Dashami
            icon: '🏹',
            naivedya: 'Jalebi, Fafda',
            significance: 'Victory of Ram over Ravana'
        },

        karva_chauth: {
            name: 'करवा चौथ',
            nameEn: 'Karva Chauth',
            type: 'tithi',
            month: 'कार्तिक',
            paksha: 'कृष्ण',
            tithi: 3, // Chaturthi
            icon: '🌙',
            significance: 'Married women fast for husband\'s longevity'
        },

        dhanteras: {
            name: 'धनतेरस',
            nameEn: 'Dhanteras',
            type: 'tithi',
            month: 'कार्तिक',
            paksha: 'कृष्ण',
            tithi: 12, // Trayodashi
            icon: '💰',
            significance: 'Auspicious for buying gold and metals'
        },

        narak_chaturdashi: {
            name: 'नरक चतुर्दशी',
            nameEn: 'Narak Chaturdashi / Chhoti Diwali',
            type: 'tithi',
            month: 'कार्तिक',
            paksha: 'कृष्ण',
            tithi: 13, // Chaturdashi
            icon: '🪔',
            significance: 'Krishna defeated Narakasura'
        },

        diwali: {
            name: 'दीपावली',
            nameEn: 'Diwali',
            type: 'tithi',
            month: 'कार्तिक',
            paksha: 'कृष्ण',
            tithi: 14, // Amavasya
            icon: '🪔',
            naivedya: 'Mithai, Dry Fruits',
            significance: 'Festival of lights'
        },

        govardhan_puja: {
            name: 'गोवर्धन पूजा',
            nameEn: 'Govardhan Puja',
            type: 'tithi',
            month: 'कार्तिक',
            paksha: 'शुक्ल',
            tithi: 0, // Pratipada (day after Diwali)
            icon: '⛰️',
            significance: 'Krishna lifted Govardhan mountain'
        },

        bhai_dooj: {
            name: 'भाई दूज',
            nameEn: 'Bhai Dooj',
            type: 'tithi',
            month: 'कार्तिक',
            paksha: 'शुक्ल',
            tithi: 1, // Dwitiya
            icon: '👫',
            significance: 'Festival celebrating brother-sister bond'
        },

        dev_uthani_ekadashi: {
            name: 'देव उठनी एकादशी',
            nameEn: 'Dev Uthani Ekadashi',
            type: 'tithi',
            month: 'कार्तिक',
            paksha: 'शुक्ल',
            tithi: 10, // Ekadashi
            icon: '🛕',
            significance: 'Lord Vishnu wakes from cosmic sleep'
        }
    };

    // === EKADASHI DEFINITIONS ===
    const EKADASHIS = {
        papankusha: { month: 'आश्विन', paksha: 'शुक्ल', name: 'पापांकुशा एकादशी' },
        rama: { month: 'आश्विन', paksha: 'कृष्ण', name: 'रमा एकादशी' },
        prabodhini: { month: 'कार्तिक', paksha: 'शुक्ल', name: 'प्रबोधिनी एकादशी' },
        utpanna: { month: 'कार्तिक', paksha: 'कृष्ण', name: 'उत्पन्ना एकादशी' },
        mokshada: { month: 'मार्गशीर्ष', paksha: 'शुक्ल', name: 'मोक्षदा एकादशी' },
        saphala: { month: 'मार्गशीर्ष', paksha: 'कृष्ण', name: 'सफला एकादशी' },
        pausha_putrada: { month: 'पौष', paksha: 'शुक्ल', name: 'पुत्रदा एकादशी' },
        shattila: { month: 'पौष', paksha: 'कृष्ण', name: 'षट्तिला एकादशी' },
        jaya: { month: 'माघ', paksha: 'शुक्ल', name: 'जया एकादशी' },
        vijaya: { month: 'माघ', paksha: 'कृष्ण', name: 'विजया एकादशी' },
        amalaki: { month: 'फाल्गुन', paksha: 'शुक्ल', name: 'आमलकी एकादशी' },
        papamochani: { month: 'फाल्गुन', paksha: 'कृष्ण', name: 'पापमोचनी एकादशी' },
        kamada: { month: 'चैत्र', paksha: 'शुक्ल', name: 'कामदा एकादशी' },
        varuthini: { month: 'चैत्र', paksha: 'कृष्ण', name: 'वरुथिनी एकादशी' },
        mohini: { month: 'वैशाख', paksha: 'शुक्ल', name: 'मोहिनी एकादशी' },
        apara: { month: 'वैशाख', paksha: 'कृष्ण', name: 'अपरा एकादशी' },
        nirjala: { month: 'ज्येष्ठ', paksha: 'शुक्ल', name: 'निर्जला एकादशी' },
        yogini: { month: 'ज्येष्ठ', paksha: 'कृष्ण', name: 'योगिनी एकादशी' },
        devshayani: { month: 'आषाढ़', paksha: 'शुक्ल', name: 'देवशयनी एकादशी' },
        kamika: { month: 'आषाढ़', paksha: 'कृष्ण', name: 'कामिका एकादशी' },
        shravana_putrada: { month: 'श्रावण', paksha: 'शुक्ल', name: 'पुत्रदा एकादशी' },
        aja: { month: 'श्रावण', paksha: 'कृष्ण', name: 'अजा एकादशी' },
        parivartini: { month: 'भाद्रपद', paksha: 'शुक्ल', name: 'परिवर्तिनी एकादशी' },
        indira: { month: 'भाद्रपद', paksha: 'कृष्ण', name: 'इंदिरा एकादशी' }
    };

    // === REGIONAL FESTIVALS ===
    const REGIONAL_FESTIVALS = {
        maharashtra: {
            gudi_padwa: {
                name: 'गुढी पाडवा',
                nameEn: 'Gudi Padwa',
                month: 'चैत्र',
                paksha: 'शुक्ल',
                tithi: 0,
                icon: '🎊',
                naivedya: 'Shrikhand Puri',
                significance: 'Marathi New Year'
            },
            narali_purnima: {
                name: 'नारळी पौर्णिमा',
                nameEn: 'Narali Purnima',
                month: 'श्रावण',
                paksha: 'शुक्ल',
                tithi: 14,
                icon: '🥥',
                significance: 'Offering to Sea God Varuna'
            }
        },

        tamil: {
            pongal: {
                name: 'पोंगल',
                nameEn: 'Thai Pongal',
                type: 'solar',
                calculation: 'sun_enters_makara',
                icon: '🍚',
                naivedya: 'Sakkarai Pongal',
                significance: 'Tamil harvest festival'
            },
            tamil_new_year: {
                name: 'तमिल पुथांडु',
                nameEn: 'Tamil New Year',
                month: 'चैत्र',
                paksha: 'शुक्ल',
                tithi: 0,
                icon: '🎊',
                significance: 'Tamil New Year (Chithirai 1)'
            }
        },

        bengal: {
            durga_puja_shashti: {
                name: 'दुर्गा षष्ठी',
                nameEn: 'Durga Shashti',
                month: 'आश्विन',
                paksha: 'शुक्ल',
                tithi: 5,
                icon: '🔔',
                significance: 'Durga Puja begins'
            },
            durga_saptami: {
                name: 'महा सप्तमी',
                nameEn: 'Maha Saptami',
                month: 'आश्विन',
                paksha: 'शुक्ल',
                tithi: 6,
                icon: '🌺',
                significance: 'Navapatrika Snan'
            },
            durga_ashtami: {
                name: 'महा अष्टमी',
                nameEn: 'Maha Ashtami',
                month: 'आश्विन',
                paksha: 'शुक्ल',
                tithi: 7,
                icon: '⚔️',
                significance: 'Kumari Puja'
            },
            durga_navami: {
                name: 'महा नवमी',
                nameEn: 'Maha Navami',
                month: 'आश्विन',
                paksha: 'शुक्ल',
                tithi: 8,
                icon: '🎭',
                significance: 'Maha Aarti'
            },
            kali_puja: {
                name: 'काली पूजा',
                nameEn: 'Kali Puja',
                month: 'कार्तिक',
                paksha: 'कृष्ण',
                tithi: 14,
                icon: '🖤',
                significance: 'Worship of Goddess Kali'
            },
            poila_boishakh: {
                name: 'पोइला बोइशाख',
                nameEn: 'Poila Boishakh',
                month: 'वैशाख',
                paksha: 'शुक्ल',
                tithi: 0,
                icon: '🎊',
                significance: 'Bengali New Year'
            }
        },

        gujarat: {
            uttarayan: {
                name: 'उत्तरायण',
                nameEn: 'Uttarayan',
                type: 'solar',
                calculation: 'sun_enters_makara',
                icon: '🪁',
                significance: 'Kite flying festival'
            }
        }
    };

    // === CALCULATION FUNCTIONS ===

    /**
     * Find the Gregorian date when a specific tithi occurs in a given month
     */
    function findTithiDate(year, hinduMonth, paksha, tithiIndex, engine, lat, lon) {
        // Approximate start date based on Hindu month
        const monthMap = {
            'चैत्र': 2, 'वैशाख': 3, 'ज्येष्ठ': 4, 'आषाढ़': 5,
            'श्रावण': 6, 'भाद्रपद': 7, 'आश्विन': 8, 'कार्तिक': 9,
            'मार्गशीर्ष': 10, 'पौष': 11, 'माघ': 0, 'फाल्गुन': 1
        };

        let startMonth = monthMap[hinduMonth] || 0;
        let searchDate = new Date(year, startMonth, 1);

        // Adjust for paksha
        if (paksha === 'कृष्ण') {
            searchDate.setDate(16);
        }

        // Search for the tithi within 45 days
        for (let i = 0; i < 45; i++) {
            const panchang = engine.getPanchang(searchDate, lat, lon);

            if (panchang.tithi &&
                panchang.tithi.indexInPaksha === tithiIndex &&
                panchang.tithi.paksha === paksha &&
                panchang.hinduMonth.lunar.name === hinduMonth) {
                return new Date(searchDate);
            }

            searchDate.setDate(searchDate.getDate() + 1);
        }

        return null;
    }

    /**
     * Convert JS Date to Julian Day Number
     */
    function dateToJD(date) {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate() + (date.getHours() + date.getMinutes() / 60) / 24;
        let A, B, JD;
        let yr = y, mo = m;
        if (mo <= 2) { yr -= 1; mo += 12; }
        A = Math.floor(yr / 100);
        B = 2 - A + Math.floor(A / 4);
        JD = Math.floor(365.25 * (yr + 4716)) + Math.floor(30.6001 * (mo + 1)) + d + B - 1524.5;
        return JD;
    }

    /**
     * Find Makar Sankranti date (when Sun enters Capricorn)
     */
    function findMakarSankranti(year, engine, lat, lon) {
        // Sun typically enters Makara (Capricorn) around Jan 14-15
        for (let day = 13; day <= 16; day++) {
            const date = new Date(year, 0, day);
            const jd = dateToJD(date);

            // Get sidereal sun position
            const sunLong = getSiderealSunLong(jd);
            const prevDate = new Date(year, 0, day - 1);
            const prevJd = dateToJD(prevDate);
            const prevSunLong = getSiderealSunLong(prevJd);

            // Check if Sun crossed into Makara (270° - 300°)
            if (prevSunLong < 270 && sunLong >= 270) {
                return date;
            }
            if (prevSunLong > 270 && sunLong >= 270 && sunLong < prevSunLong) {
                return date;
            }
        }

        return new Date(year, 0, 14); // Default
    }

    /**
     * Lahiri ayanamsa approximation
     */
    function getLahiriAyanamsa(jd) {
        const J2000 = 2451545.0;
        const t = (jd - J2000) / 36525;
        // Lahiri ayanamsa: ~23.85° at J2000, precessing ~50.3"/year
        return 23.85 + (50.2564 / 3600) * t * 100;
    }

    function getSiderealSunLong(jd) {
        const tropicalSun = calculateTropicalSunLong(jd);
        const ayanamsa = getLahiriAyanamsa(jd);
        let sidereal = tropicalSun - ayanamsa;
        if (sidereal < 0) sidereal += 360;
        return sidereal;
    }

    function calculateTropicalSunLong(jd) {
        const J2000 = 2451545.0;
        const t = (jd - J2000) / 36525;
        let L0 = 280.4664567 + 360007.6982779 * t;
        let M = (357.5291092 + 35999.0502909 * t) * Math.PI / 180;
        const C = 1.9146 * Math.sin(M) + 0.02 * Math.sin(2 * M);
        let sunLong = L0 + C;
        sunLong = sunLong % 360;
        if (sunLong < 0) sunLong += 360;
        return sunLong;
    }

    /**
     * Get festivals for a specific date
     */
    function getFestivalsForDate(date, engine, lat, lon, region = 'all') {
        const festivals = [];
        const panchang = engine.getPanchang(date, lat, lon);

        if (!panchang || !panchang.tithi) return festivals;

        const { tithi, nakshatra, hinduMonth } = panchang;

        // Check all pan-Indian festivals
        for (const [id, festival] of Object.entries(FESTIVALS)) {
            if (matchesFestival(festival, tithi, nakshatra, hinduMonth)) {
                festivals.push({
                    id,
                    ...festival,
                    matchedDate: date
                });
            }
        }

        // Check Ekadashi
        if (tithi.indexInPaksha === 10) { // Ekadashi
            const ekadashiKey = findEkadashiName(hinduMonth.lunar.name, tithi.paksha);
            if (ekadashiKey && EKADASHIS[ekadashiKey]) {
                festivals.push({
                    id: ekadashiKey,
                    name: EKADASHIS[ekadashiKey].name,
                    nameEn: ekadashiKey.charAt(0).toUpperCase() + ekadashiKey.slice(1) + ' Ekadashi',
                    type: 'ekadashi',
                    icon: '🙏',
                    significance: 'Fasting day dedicated to Lord Vishnu'
                });
            }
        }

        // Check Purnima
        if (tithi.index === 14) {
            festivals.push({
                id: 'purnima',
                name: `${hinduMonth.lunar.name} पूर्णिमा`,
                nameEn: `${hinduMonth.lunar.nameEn} Purnima`,
                type: 'purnima',
                icon: '🌕',
                significance: 'Full Moon Day'
            });
        }

        // Check Amavasya
        if (tithi.index === 29) {
            festivals.push({
                id: 'amavasya',
                name: `${hinduMonth.lunar.name} अमावस्या`,
                nameEn: `${hinduMonth.lunar.nameEn} Amavasya`,
                type: 'amavasya',
                icon: '🌑',
                significance: 'New Moon Day - Pitru Tarpan'
            });
        }

        // Check regional festivals
        if (region !== 'all' && REGIONAL_FESTIVALS[region]) {
            for (const [id, festival] of Object.entries(REGIONAL_FESTIVALS[region])) {
                if (matchesFestival(festival, tithi, nakshatra, hinduMonth)) {
                    festivals.push({
                        id,
                        ...festival,
                        regional: region
                    });
                }
            }
        } else if (region === 'all') {
            // Include all regional festivals
            for (const [regionName, regionFestivals] of Object.entries(REGIONAL_FESTIVALS)) {
                for (const [id, festival] of Object.entries(regionFestivals)) {
                    if (matchesFestival(festival, tithi, nakshatra, hinduMonth)) {
                        festivals.push({
                            id,
                            ...festival,
                            regional: regionName
                        });
                    }
                }
            }
        }

        return festivals;
    }

    function matchesFestival(festival, tithi, nakshatra, hinduMonth) {
        if (festival.type === 'solar') {
            return false; // Solar festivals need separate handling
        }

        // Check month
        if (festival.month && festival.month !== hinduMonth.lunar.name) {
            if (!festival.monthAlt || festival.monthAlt !== hinduMonth.lunar.name) {
                return false;
            }
        }

        // Check paksha
        if (festival.paksha && festival.paksha !== tithi.paksha) {
            return false;
        }

        // Check tithi
        if (festival.tithi !== undefined && festival.tithi !== tithi.indexInPaksha) {
            return false;
        }

        // Check nakshatra (optional)
        if (festival.nakshatra && festival.nakshatra !== nakshatra.name) {
            return false;
        }

        return true;
    }

    function findEkadashiName(month, paksha) {
        for (const [key, ekadashi] of Object.entries(EKADASHIS)) {
            if (ekadashi.month === month && ekadashi.paksha === paksha) {
                return key;
            }
        }
        return null;
    }

    /**
     * Get all festivals for a given month
     */
    function getFestivalsForMonth(year, month, engine, lat, lon, region = 'all') {
        const festivals = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayFestivals = getFestivalsForDate(date, engine, lat, lon, region);

            dayFestivals.forEach(festival => {
                festivals.push({
                    ...festival,
                    gregorianDate: date,
                    dateString: formatDate(date)
                });
            });
        }

        // Add solar festivals
        if (month === 0) { // January
            const sankranti = findMakarSankranti(year, engine, lat, lon);
            if (sankranti.getMonth() === 0) {
                festivals.push({
                    ...FESTIVALS.makar_sankranti,
                    id: 'makar_sankranti',
                    gregorianDate: sankranti,
                    dateString: formatDate(sankranti)
                });
            }
        }

        return festivals.sort((a, b) => a.gregorianDate - b.gregorianDate);
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    /**
     * Check if Ekadashi should be observed (Arunodaya Viddhi)
     */
    function checkEkadashiViddhi(date, engine, lat, lon) {
        const panchang = engine.getPanchang(date, lat, lon);

        // Brahma Muhurta is 96 min before sunrise
        const brahmaMuhurtaStart = panchang.sunTimes.sunrise - 1.6;

        // Create date at Brahma Muhurta time
        const brahmaMuhurtaDate = new Date(date);
        brahmaMuhurtaDate.setHours(Math.floor(brahmaMuhurtaStart),
            Math.floor((brahmaMuhurtaStart % 1) * 60), 0, 0);

        const brahmaMuhurtaPanchang = engine.getPanchang(brahmaMuhurtaDate, lat, lon);

        // If Ekadashi tithi is present during Brahma Muhurta, observe today
        // Otherwise, observe tomorrow (Mahadvadashi)
        const isEkadashiAtBrahmaMuhurta = brahmaMuhurtaPanchang.tithi.indexInPaksha === 10;

        return {
            observeToday: isEkadashiAtBrahmaMuhurta,
            reason: isEkadashiAtBrahmaMuhurta
                ? 'Ekadashi tithi present during Brahma Muhurta'
                : 'Observe on next day (Mahadvadashi) as Ekadashi starts after Brahma Muhurta'
        };
    }

    // === PUBLIC API ===
    return {
        FESTIVALS,
        EKADASHIS,
        REGIONAL_FESTIVALS,
        getFestivalsForDate,
        getFestivalsForMonth,
        findTithiDate,
        findMakarSankranti,
        checkEkadashiViddhi
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FestivalCalculator;
}
