/**
 * Satsang - Event Data
 * Sample data for spiritual events
 */

// Popular Katha Vachaks
const vachaks = [
    {
        id: 'indresh',
        name: 'Pt. Indresh Upadhyay',
        shortName: 'Indresh Ji',
        emoji: '🙏',
        specialty: 'श्रीमद्भागवत कथा',
        followers: 250000,
        events: 500,
        bio: 'Renowned Bhagwat Katha exponent, spreading the divine message of Lord Krishna across India and abroad.',
        verified: true
    },
    {
        id: 'morari',
        name: 'Morari Bapu',
        shortName: 'Morari Bapu',
        emoji: '📿',
        specialty: 'राम कथा',
        followers: 5000000,
        events: 900,
        bio: 'One of the most revered spiritual leaders, known for Ram Katha recitations across the world.',
        verified: true
    },
    {
        id: 'devkinandan',
        name: 'Devkinandan Thakur Ji',
        shortName: 'Devkinandan Ji',
        emoji: '🙏',
        specialty: 'श्रीमद्भागवत कथा',
        followers: 800000,
        events: 400,
        bio: 'Popular Bhagwat Katha speaker inspiring millions with stories of Lord Krishna.',
        verified: true
    },
    {
        id: 'jayakishori',
        name: 'Jaya Kishori',
        shortName: 'Jaya Kishori',
        emoji: '🎤',
        specialty: 'भजन & कथा',
        followers: 3000000,
        events: 600,
        bio: 'Young spiritual singer and speaker captivating youth with devotional music and discourse.',
        verified: true
    },
    {
        id: 'bageshwar',
        name: 'Bageshwar Dham Sarkar',
        shortName: 'Bageshwar Ji',
        emoji: '🕉️',
        specialty: 'दरबार & सत्संग',
        followers: 10000000,
        events: 300,
        bio: 'Dhirendra Krishna Shastri, head of Bageshwar Dham, conducting spiritual darbars across India.',
        verified: true
    },
    {
        id: 'prempuri',
        name: 'Prem Puri Ji',
        shortName: 'Prem Puri',
        emoji: '🙏',
        specialty: 'शिव महापुराण',
        followers: 150000,
        events: 200,
        bio: 'Expert in Shiv Puran discourses, spreading devotion to Lord Shiva.',
        verified: true
    }
];

// Sample Events
const events = [
    {
        id: 'event1',
        type: 'bhagwat',
        typeName: 'श्रीमद्भागवत कथा',
        title: 'श्रीमद्भागवत सप्ताह',
        englishTitle: 'Shrimad Bhagwat Saptah',
        vachakId: 'indresh',
        vachakName: 'Pt. Indresh Upadhyay',
        location: 'Vrindavan, UP',
        city: 'vrindavan',
        venue: 'Shri Radha Rani Mandir, Barsana Road',
        startDate: '2024-12-15',
        endDate: '2024-12-21',
        duration: 7,
        timing: '4:00 PM - 8:00 PM',
        isLive: true,
        isFree: true,
        hasLiveStream: true,
        bhandara: true,
        accommodation: true,
        organizer: 'Shri Krishna Seva Samiti',
        contact: '+91 9876543210',
        description: 'Join us for a divine 7-day discourse on Shrimad Bhagwat Puran by respected Pt. Indresh Upadhyay. Experience the nectar of Krishna Leela in the sacred land of Vrindavan.',
        schedule: [
            { day: 1, title: 'Mangalacharan & Parikrama', time: '4:00 PM - 8:00 PM' },
            { day: 2, title: 'Bhagwan Shri Krishna Prakat', time: '4:00 PM - 8:00 PM' },
            { day: 3, title: 'Gopal Leela', time: '4:00 PM - 8:00 PM' },
            { day: 4, title: 'Rasa Leela', time: '4:00 PM - 8:00 PM' },
            { day: 5, title: 'Uddhav Gopi Samvad', time: '4:00 PM - 8:00 PM' },
            { day: 6, title: 'Dwarka Leela', time: '4:00 PM - 8:00 PM' },
            { day: 7, title: 'Maha Abhishek & Completion', time: '3:00 PM - 9:00 PM' }
        ]
    },
    {
        id: 'event2',
        type: 'ramkatha',
        typeName: 'राम कथा',
        title: 'श्री राम कथा नवाह',
        englishTitle: 'Shri Ram Katha Navah',
        vachakId: 'morari',
        vachakName: 'Morari Bapu',
        location: 'Talgajarda, Gujarat',
        city: 'ahmedabad',
        venue: 'Chitrakoot Dham, Talgajarda',
        startDate: '2024-12-20',
        endDate: '2024-12-28',
        duration: 9,
        timing: '5:00 PM - 9:00 PM',
        isLive: false,
        isFree: true,
        hasLiveStream: true,
        bhandara: true,
        accommodation: true,
        organizer: 'Chitrakoot Dham Trust',
        contact: '+91 9876543211',
        description: 'The annual Ram Katha at Morari Bapu\'s ashram in Talgajarda. A spiritual gathering like no other.',
        schedule: []
    },
    {
        id: 'event3',
        type: 'bhagwat',
        typeName: 'श्रीमद्भागवत कथा',
        title: 'भागवत महापर्व',
        englishTitle: 'Bhagwat Mahaparva',
        vachakId: 'devkinandan',
        vachakName: 'Devkinandan Thakur Ji',
        location: 'Haridwar, UK',
        city: 'haridwar',
        venue: 'Ganga Ghat, Har Ki Pauri',
        startDate: '2024-12-25',
        endDate: '2024-12-31',
        duration: 7,
        timing: '3:00 PM - 7:00 PM',
        isLive: false,
        isFree: true,
        hasLiveStream: true,
        bhandara: true,
        accommodation: false,
        organizer: 'Haridwar Dharma Sabha',
        contact: '+91 9876543212',
        description: 'Experience the divine Bhagwat Katha on the banks of sacred Ganga in Haridwar.',
        schedule: []
    },
    {
        id: 'event4',
        type: 'satsang',
        typeName: 'दरबार',
        title: 'बागेश्वर धाम दरबार',
        englishTitle: 'Bageshwar Dham Darbar',
        vachakId: 'bageshwar',
        vachakName: 'Bageshwar Dham Sarkar',
        location: 'Chhatarpur, MP',
        city: 'delhi',
        venue: 'Bageshwar Dham, Gada',
        startDate: '2024-12-18',
        endDate: '2024-12-18',
        duration: 1,
        timing: '10:00 AM - 6:00 PM',
        isLive: false,
        isFree: true,
        hasLiveStream: true,
        bhandara: true,
        accommodation: true,
        organizer: 'Bageshwar Dham Trust',
        contact: '+91 9876543213',
        description: 'Attend the divine Darbar of Dhirendra Krishna Shastri at the holy Bageshwar Dham.',
        schedule: []
    },
    {
        id: 'event5',
        type: 'shiv',
        typeName: 'शिव महापुराण',
        title: 'शिव महापुराण कथा',
        englishTitle: 'Shiv Mahapuran Katha',
        vachakId: 'prempuri',
        vachakName: 'Prem Puri Ji',
        location: 'Varanasi, UP',
        city: 'varanasi',
        venue: 'Kashi Vishwanath Temple Complex',
        startDate: '2025-01-05',
        endDate: '2025-01-11',
        duration: 7,
        timing: '4:00 PM - 8:00 PM',
        isLive: false,
        isFree: true,
        hasLiveStream: false,
        bhandara: true,
        accommodation: false,
        organizer: 'Kashi Vishwanath Trust',
        contact: '+91 9876543214',
        description: 'Seven-day discourse on Shiv Mahapuran in the holy city of Kashi.',
        schedule: []
    },
    {
        id: 'event6',
        type: 'bhagwat',
        typeName: 'भजन संध्या',
        title: 'भजन संध्या & कथा',
        englishTitle: 'Bhajan Sandhya',
        vachakId: 'jayakishori',
        vachakName: 'Jaya Kishori',
        location: 'Jaipur, Rajasthan',
        city: 'delhi',
        venue: 'Birla Mandir, JLN Marg',
        startDate: '2025-01-10',
        endDate: '2025-01-10',
        duration: 1,
        timing: '6:00 PM - 10:00 PM',
        isLive: false,
        isFree: false,
        hasLiveStream: true,
        bhandara: false,
        accommodation: false,
        organizer: 'Jaipur Bhakti Mandal',
        contact: '+91 9876543215',
        description: 'An evening of divine bhajans and spiritual discourse by the beloved Jaya Kishori.',
        schedule: []
    }
];

// Daily verse of wisdom
const wisdomQuotes = [
    { text: 'सत्संग से ही मोक्ष की प्राप्ति होती है।', source: 'Sant Kabir' },
    { text: 'मन चंगा तो कठौती में गंगा।', source: 'Sant Ravidas' },
    { text: 'राम नाम जप जगत गुरु।', source: 'Tulsidas' },
    { text: 'हरि को भजे सो हरि का होई।', source: 'Meera Bai' }
];

// Cities data
const cities = {
    all: { name: 'All India', emoji: '🇮🇳' },
    vrindavan: { name: 'Vrindavan', emoji: '🏛️', state: 'UP' },
    haridwar: { name: 'Haridwar', emoji: '🌊', state: 'UK' },
    varanasi: { name: 'Varanasi', emoji: '🕉️', state: 'UP' },
    ayodhya: { name: 'Ayodhya', emoji: '🛕', state: 'UP' },
    puri: { name: 'Puri', emoji: '🐚', state: 'Odisha' },
    delhi: { name: 'Delhi NCR', emoji: '🏙️', state: 'Delhi' },
    mumbai: { name: 'Mumbai', emoji: '🌆', state: 'MH' },
    ahmedabad: { name: 'Ahmedabad', emoji: '🏛️', state: 'GJ' }
};

// Export for use
window.vachaks = vachaks;
window.events = events;
window.wisdomQuotes = wisdomQuotes;
window.cities = cities;
