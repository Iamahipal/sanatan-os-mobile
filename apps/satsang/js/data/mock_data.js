/**
 * Satsang App - Real-World Data (Manual Entry Phase)
 * Updated: 26 Jan 2026
 * Source: User Verified Schedule
 */

export const vachaks = [
    {
        id: 'rajendradas',
        name: 'Swami Shri Rajendradas Devacharya Ji Maharaj',
        shortName: 'Rajendradas Ji',
        emoji: '🙏',
        image: './assets/images/rajendradas.png',
        specialty: 'श्रीमद्भागवत कथा & भक्तमाल',
        followers: 1200000,
        eventsCount: 850,
        bio: 'Anant Shri Vibhushit Shrimad Jagadguru Dwaracharya, Malook Peethadhishwar. Renowned for his deep, scholarly, and devotional exposition of Bhaktimal and Shrimad Bhagwat.',
        verified: true
    },
    {
        id: 'pundrik',
        name: 'Pujya Pundrik Goswami Ji',
        shortName: 'Pundrik Goswami',
        emoji: '🪷',
        image: './assets/images/pundrik.png',
        specialty: 'श्रीमद्भागवत कथा',
        followers: 400000,
        eventsCount: 200,
        bio: 'Continuing the glorious lineage of Shri Radharaman Temple, Vrindavan. His discourses blend tradition with modern relevance.',
        verified: true
    },
    {
        id: 'morari',
        name: 'Pujya Morari Bapu',
        shortName: 'Morari Bapu',
        emoji: '📿',
        image: './assets/images/morari.png',
        specialty: 'राम कथा',
        followers: 5000000,
        eventsCount: 900,
        bio: 'Internationally renowned exponent of Ram Charit Manas. He has been reciting Ram Katha for over 60 years across the globe.',
        verified: true
    },
    {
        id: 'jayakishori',
        name: 'Jaya Kishori',
        shortName: 'Jaya Kishori',
        emoji: '🎤',
        image: './assets/images/jayakishori.png',
        specialty: 'Satsang & Motivational',
        followers: 10000000,
        eventsCount: 700,
        bio: 'Renowned spiritual orator and motivational speaker, inspiring youth through "Divine Concerts" and Katha.',
        verified: true
    },
    {
        id: 'premanand',
        name: 'Pujya Shri Premanand Govind Sharan Ji Maharaj',
        shortName: 'Premanand Ji',
        emoji: '🙇',
        image: './assets/images/premanand.png',
        specialty: 'एकांतिक वार्ता',
        followers: 15000000,
        eventsCount: 9999,
        bio: 'Revered saint of Vrindavan emphasizing absolute surrender to Priya-Priyatam. (Note: He does not travel; Darshan only in Vrindavan).',
        verified: true
    },
    {
        id: 'bageshwar',
        name: 'Bageshwar Dham Sarkar',
        shortName: 'Bageshwar Ji',
        emoji: '🕉️',
        image: './assets/images/bageshwar.png',
        specialty: 'दिव्य दरबार',
        followers: 12000000,
        eventsCount: 450,
        bio: 'Pt. Dhirendra Krishna Shastri of Bageshwar Dham.',
        verified: true
    },
    {
        id: 'pradeep',
        name: 'Pt. Pradeep Mishra Ji',
        shortName: 'Pradeep Mishra',
        emoji: '🔱',
        image: './assets/images/pradeep.png',
        specialty: 'शिव महापुराण',
        followers: 11000000,
        eventsCount: 600,
        bio: 'Sehore Wale Baba. Famous for Shiv Mahapuran and Rudraksh Mahotsav.',
        verified: true
    },
    {
        id: 'indresh',
        name: 'Pt. Indresh Upadhyay',
        shortName: 'Indresh Ji',
        emoji: '🪈',
        image: './assets/images/indresh.png',
        specialty: 'श्रीमद्भागवत कथा',
        followers: 500000,
        eventsCount: 300,
        bio: 'Blessed with a melodious voice, his Bhagwat Katha recitations are a treat for the soul.',
        verified: true
    }
];

export const events = [
    // --- RAJENDRADAS JI ---
    {
        id: 'evt-raj-mathura',
        type: 'ramkatha',
        typeName: 'श्री राम कथा',
        title: 'Shree Ram Katha - Mathura',
        vachakId: 'rajendradas',
        location: {
            city: 'mathura',
            cityName: 'Mathura, UP',
            venue: 'Thakur Shree Brij Bhushan Mandir, Village Kotvan'
        },
        dates: {
            start: '2026-01-22',
            end: '2026-01-28',
            duration: 7,
            timing: 'Current Event'
        },
        features: { isLive: true, isFree: true, hasLiveStream: true, hasPrasad: true, hasAccommodation: false },
        organizer: { name: 'Brij Bhushan Mandir Samiti', contact: '' },
        description: 'Ongoing Ram Katha in the holy land of Braj.',
        schedule: []
    },
    {
        id: 'evt-raj-nagpur-2026',
        type: 'bhagwat',
        typeName: 'श्रीमद्भागवत कथा',
        title: 'Shrimad Bhagwat Katha - Nagpur',
        vachakId: 'rajendradas',
        location: {
            city: 'nagpur',
            cityName: 'Nagpur, MH',
            venue: 'Vrindavan Dham, Swaminarayan Mandir Chowk, Wathoda Ring Road'
        },
        dates: {
            start: '2026-01-29',
            end: '2026-02-04',
            duration: 7,
            timing: '03:00 PM - 07:00 PM'
        },
        features: { isLive: false, isFree: true, hasLiveStream: true, hasPrasad: true, hasAccommodation: false },
        organizer: { name: 'Jadkhor Gaudham', contact: 'donation@jadkhor.org' },
        description: 'A divine gathering in Nagpur with Malook Peethadhishwar.',
        schedule: []
    },

    // --- PUNDRIK GOSWAMI JI ---
    {
        id: 'evt-pundrik-mumbai',
        type: 'bhagwat',
        typeName: 'ब्रज भागवत कथा',
        title: 'Shri Braj Bhagwat - Mumbai',
        vachakId: 'pundrik',
        location: {
            city: 'mumbai',
            cityName: 'Mumbai, MH',
            venue: 'Azad Maidan, Fort'
        },
        dates: {
            start: '2026-01-27',
            end: '2026-02-02',
            duration: 7,
            timing: '04:00 PM - 08:00 PM'
        },
        features: { isLive: false, isFree: true, hasLiveStream: true, hasPrasad: false, hasAccommodation: false },
        organizer: { name: 'Braj Ras Rasik Mandal', contact: '' },
        description: 'Experience the bliss of Braj in the heart of Mumbai with Pundrik Goswami Ji.',
        schedule: []
    },
    {
        id: 'evt-pundrik-jalandhar',
        type: 'ramkatha',
        typeName: 'श्री राम कथा',
        title: 'Shri Ram Katha - Jalandhar',
        vachakId: 'pundrik',
        location: {
            city: 'jalandhar',
            cityName: 'Jalandhar, Punjab',
            venue: 'Mall Road, Model Town'
        },
        dates: {
            start: '2026-02-05',
            end: '2026-02-12',
            duration: 8,
            timing: '03:00 PM - 07:00 PM'
        },
        features: { isLive: false, isFree: true, hasLiveStream: true, hasPrasad: true, hasAccommodation: false },
        organizer: { name: 'Ram Rajya Samiti', contact: '' },
        description: 'Divine Ram Katha in Punjab.',
        schedule: []
    },

    // --- MORARI BAPU ---
    {
        id: 'evt-morari-dwarka',
        type: 'ramkatha',
        typeName: 'राम कथा',
        title: 'Ram Katha - Dwarka',
        vachakId: 'morari',
        location: {
            city: 'dwarka',
            cityName: 'Dwarka, Gujarat',
            venue: 'Dwarkadhish Dham'
        },
        dates: {
            start: '2026-02-05',
            end: '2026-02-13',
            duration: 9,
            timing: '09:30 AM - 01:30 PM'
        },
        features: { isLive: false, isFree: true, hasLiveStream: true, hasPrasad: true, hasAccommodation: true },
        organizer: { name: 'Ram Katha Aayojan Samiti', contact: '' },
        description: 'Manas Dwarka - A 9-day spiritual journey at the abode of Lord Krishna.',
        schedule: []
    },
    {
        id: 'evt-morari-bagasara',
        type: 'ramkatha',
        typeName: 'राम कथा',
        title: 'Ram Katha - Bagasara',
        vachakId: 'morari',
        location: {
            city: 'bagasara',
            cityName: 'Bagasara, Gujarat',
            venue: 'Bagasara Grounds'
        },
        dates: {
            start: '2026-03-07',
            end: '2026-03-15',
            duration: 9,
            timing: '04:00 PM - 08:00 PM'
        },
        features: { isLive: false, isFree: true, hasLiveStream: true, hasPrasad: true, hasAccommodation: false },
        organizer: { name: 'Local Organizers', contact: '' },
        description: 'Ram Katha in Bagasara.',
        schedule: []
    },

    // --- JAYA KISHORI (CONCERT SERIES) ---
    {
        id: 'evt-jaya-indore',
        type: 'concert',
        typeName: 'Divine Concert',
        title: 'Divine Concert - Indore',
        vachakId: 'jayakishori',
        location: {
            city: 'indore',
            cityName: 'Indore, MP',
            venue: 'Phoenix Citadel Mall'
        },
        dates: {
            start: '2026-02-21',
            end: '2026-02-21',
            duration: 1,
            timing: '06:00 PM onwards'
        },
        features: { isLive: false, isFree: false, hasLiveStream: false, hasPrasad: false, hasAccommodation: false },
        organizer: { name: 'Event Management', contact: 'BookMyShow' },
        description: 'An evening of spirituality and motivation.',
        schedule: []
    },
    {
        id: 'evt-jaya-jaipur',
        type: 'concert',
        typeName: 'Divine Concert',
        title: 'Divine Concert - Jaipur',
        vachakId: 'jayakishori',
        location: {
            city: 'jaipur',
            cityName: 'Jaipur, RJ',
            venue: 'JECC'
        },
        dates: {
            start: '2026-02-22',
            end: '2026-02-22',
            duration: 1,
            timing: '06:00 PM onwards'
        },
        features: { isLive: false, isFree: false, hasLiveStream: false, hasPrasad: false, hasAccommodation: false },
        organizer: { name: 'Event Management', contact: 'BookMyShow' },
        description: 'Live in Jaipur.',
        schedule: []
    },

    // --- BAGESHWAR DHAM ---
    {
        id: 'evt-bag-meerut',
        type: 'darbar',
        typeName: 'दिव्य दरबार',
        title: 'Divya Darbar - Meerut',
        vachakId: 'bageshwar',
        location: {
            city: 'meerut',
            cityName: 'Meerut, UP',
            venue: 'Venue TBD'
        },
        dates: {
            start: '2026-03-25',
            end: '2026-03-29',
            duration: 5,
            timing: 'TBD'
        },
        features: { isLive: false, isFree: true, hasLiveStream: true, hasPrasad: true, hasAccommodation: false },
        organizer: { name: 'Bageshwar Dham Sewa Samiti', contact: '' },
        description: 'Tentative Schedule: Grand Divya Darbar in Meerut. Please duplicate check official channel before travel.',
        schedule: []
    }
];

export const cities = {
    all: { name: 'All India', emoji: '🇮🇳' },
    nagpur: { name: 'Nagpur', emoji: '🍊', state: 'MH' },
    vrindavan: { name: 'Vrindavan', emoji: '🏛️', state: 'UP' },
    mumbai: { name: 'Mumbai', emoji: '🌆', state: 'MH' },
    dwarka: { name: 'Dwarka', emoji: '🐚', state: 'GJ' },
    indore: { name: 'Indore', emoji: '🏙️', state: 'MP' },
    delhi: { name: 'Delhi', emoji: '🏙️', state: 'DL' }
};

export const wisdomQuotes = [
    { text: 'सत्संग से ही मोक्ष की प्राप्ति होती है।', source: 'Sant Kabir' },
    { text: 'सिया राम मय सब जग जानी।', source: 'Tulsidas' },
    { text: 'कर्म ही पूजा है।', source: 'Gita' }
];
