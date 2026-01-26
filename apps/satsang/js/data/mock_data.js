/**
 * Satsang App - Real-World Data (Manual Entry Phase)
 * Updated: 26 Jan 2026
 */

export const vachaks = [
    {
        id: 'rajendradas',
        name: 'Swami Shri Rajendradas Devacharya Ji Maharaj',
        shortName: 'Rajendradas Ji',
        emoji: '🙏',
        specialty: 'श्रीमद्भागवत कथा & भक्तमाल',
        followers: 1200000,
        eventsCount: 850,
        bio: 'Anant Shri Vibhushit Shrimad Jagadguru Dwaracharya, Malook Peethadhishwar. Renowned for his deep, scholarly, and devotional exposition of Bhaktimal and Shrimad Bhagwat.',
        verified: true
    },
    {
        id: 'premanand',
        name: 'Pujya Shri Premanand Govind Sharan Ji Maharaj',
        shortName: 'Premanand Ji',
        emoji: '🙇',
        specialty: 'एकांतिक वार्ता & राधा नाम',
        followers: 15000000,
        eventsCount: 9999, // Daily
        bio: 'Revered saint of Vrindavan emphasizing "Radha Nam Kirtan" and absolute surrender to Priya-Priyatam. His Ekantik Varta guides millions.',
        verified: true
    },
    {
        id: 'bageshwar',
        name: 'Bageshwar Dham Sarkar',
        shortName: 'Bageshwar Ji',
        emoji: '🕉️',
        specialty: 'दिव्य दरबार',
        followers: 12000000,
        eventsCount: 450,
        bio: 'Pt. Dhirendra Krishna Shastri of Bageshwar Dham, known for his miraculous Divya Darbar and Sanatan Dharm prachar.',
        verified: true
    },
    {
        id: 'pradeep',
        name: 'Pt. Pradeep Mishra Ji',
        shortName: 'Pradeep Mishra',
        emoji: '🔱',
        specialty: 'शिव महापुराण',
        followers: 10000000,
        eventsCount: 600,
        bio: 'Sehore Wale Baba. His simple remedies (Upay) via Shiv Mahapuran have created a massive spiritual revolution.',
        verified: true
    },
    {
        id: 'jayakishori',
        name: 'Jaya Kishori',
        shortName: 'Jaya Kishori',
        emoji: '🎤',
        specialty: 'नानी बाई रो मायरा & कथा',
        followers: 8000000,
        eventsCount: 700,
        bio: 'Motivational speaker and spiritual singer connecting modern youth with ancient wisdom.',
        verified: true
    },
    {
        id: 'indresh',
        name: 'Pt. Indresh Upadhyay',
        shortName: 'Indresh Ji',
        emoji: '🪈',
        specialty: 'श्रीमद्भागवत कथा',
        followers: 500000,
        eventsCount: 300,
        bio: 'Blessed with a melodious voice, his Bhagwat Katha recitations are a treat for the soul.',
        verified: true
    }
];

export const events = [
    // RAJENDRADAS JI - NAGPUR (User Requested)
    {
        id: 'evt-raj-nagpur-2026',
        type: 'bhagwat',
        typeName: 'श्रीमद्भागवत कथा',
        title: 'Shrimad Bhagwat Katha - Nagpur',
        englishTitle: 'Shrimad Bhagwat Katha',
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
        features: {
            isLive: false, // Future
            isFree: true,
            hasLiveStream: true,
            hasPrasad: true,
            hasAccommodation: false
        },
        organizer: {
            name: 'Jadkhor Gaudham & Malook Peeth',
            contact: 'donation@jadkhor.org'
        },
        description: 'Prepare for a divine 7-day journey with Malook Peethadhishwar Swami Shri Rajendradas Ji Maharaj in Nagpur. Also graced by Param Pujya Shri Prajanand Ji Maharaj.',
        schedule: [
            { day: 1, title: 'Mahatmya & Shobha Yatra', time: '3:00 PM' },
            { day: 2, title: 'Kapil Devahuti Samvad', time: '3:00 PM' },
            { day: 3, title: 'Dhruv Charitra', time: '3:00 PM' },
            { day: 4, title: 'Shri Krishna Janmotsav', time: '3:00 PM' },
            { day: 5, title: 'Govardhan Pooja', time: '3:00 PM' },
            { day: 6, title: 'Rukmini Vivah', time: '3:00 PM' },
            { day: 7, title: 'Sudama Charitra & Vyas Pooja', time: '3:00 PM' }
        ]
    },

    // PREMANAND JI - VRINDAVAN (Recurring/Live pattern)
    {
        id: 'evt-prem-daily',
        type: 'satsang',
        typeName: 'एकांतिक वार्ता',
        title: 'Vrindavan Ekantik Varta',
        englishTitle: 'Daily Spiritual Discourse',
        vachakId: 'premanand',
        location: {
            city: 'vrindavan',
            cityName: 'Vrindavan, UP',
            venue: 'Shri Hit Radha Keli Kunj, Parikrama Marg'
        },
        dates: {
            start: '2026-01-26', // Today
            end: '2026-01-26', // Today
            duration: 1,
            timing: '02:00 AM - 04:00 AM'
        },
        features: {
            isLive: true,
            isFree: true,
            hasLiveStream: true,
            hasPrasad: false,
            hasAccommodation: false
        },
        organizer: {
            name: 'Radha Keli Kunj Trust',
            contact: 'YouTube: Bhajan Marg'
        },
        description: 'Amrit Varta by Pujya Maharaj Ji. Questions and answers clearing the path of devotion for seekers.',
        schedule: []
    },

    // BAGESHWAR DHAM - UPCOMING
    {
        id: 'evt-bag-feb-2026',
        type: 'darbar',
        typeName: 'दिव्य दरबार',
        title: 'Bageshwar Dham Divya Darbar',
        englishTitle: 'Divya Darbar',
        vachakId: 'bageshwar',
        location: {
            city: 'chhatarpur',
            cityName: 'Gada, MP',
            venue: 'Bageshwar Dham Sarkar'
        },
        dates: {
            start: '2026-02-10',
            end: '2026-02-12',
            duration: 3,
            timing: '12:00 PM - 08:00 PM'
        },
        features: {
            isLive: false,
            isFree: true,
            hasLiveStream: true,
            hasPrasad: true,
            hasAccommodation: true
        },
        organizer: {
            name: 'Bageshwar Dham Sewa Samiti',
            contact: ''
        },
        description: 'Grand Divya Darbar by Dhirendra Krishna Shastri Ji. Token distribution on 9th Feb.',
        schedule: []
    },

    // PRADEEP MISHRA - KUBERESHWAR
    {
        id: 'evt-pradeep-shiv-2026',
        type: 'shiv',
        typeName: 'रुद्राक्ष महोत्सव',
        title: 'Rudraksh Mahotsav & Shiv Puran',
        englishTitle: 'Rudraksh Festival',
        vachakId: 'pradeep',
        location: {
            city: 'sehore',
            cityName: 'Kubereshwar Dham, MP',
            venue: 'Chitawaliya Hema, Sehore'
        },
        dates: {
            start: '2026-03-01',
            end: '2026-03-07',
            duration: 7,
            timing: '01:00 PM - 05:00 PM'
        },
        features: {
            isLive: false,
            isFree: true,
            hasLiveStream: true,
            hasPrasad: true,
            hasAccommodation: true
        },
        organizer: {
            name: 'Vitthlesh Seva Samiti',
            contact: ''
        },
        description: 'The massive annual Rudraksh Mahotsav. Millions of devotees expected.',
        schedule: []
    },

    // JAYA KISHORI - KOLKATA
    {
        id: 'evt-jaya-kolkata',
        type: 'nani',
        typeName: 'नानी बाई रो मायरा',
        title: 'Nani Bai Ro Mayro',
        englishTitle: 'Musical Saga of Narsi Mehta',
        vachakId: 'jayakishori',
        location: {
            city: 'kolkata',
            cityName: 'Kolkata, WB',
            venue: 'Science City Auditorium'
        },
        dates: {
            start: '2026-02-15',
            end: '2026-02-17',
            duration: 3,
            timing: '04:00 PM - 08:00 PM'
        },
        features: {
            isLive: false,
            isFree: false, // Ticketed usually
            hasLiveStream: false,
            hasPrasad: false,
            hasAccommodation: false
        },
        organizer: {
            name: 'Kolkata Rajasthani Manch',
            contact: 'BookMyShow'
        },
        description: 'A soulful 3-day musical rendition of the legend of Narsi Mehta and Lord Krishna.',
        schedule: []
    }
];

export const cities = {
    all: { name: 'All India', emoji: '🇮🇳' },
    nagpur: { name: 'Nagpur', emoji: '🍊', state: 'MH' },
    vrindavan: { name: 'Vrindavan', emoji: '🏛️', state: 'UP' },
    sehore: { name: 'Sehore', emoji: '🔱', state: 'MP' },
    chhatarpur: { name: 'Bageshwar', emoji: '🕉️', state: 'MP' },
    kolkata: { name: 'Kolkata', emoji: '🌉', state: 'WB' },
    mumbai: { name: 'Mumbai', emoji: '🌆', state: 'MH' },
    delhi: { name: 'Delhi', emoji: '🏙️', state: 'Delhi' }
};

export const wisdomQuotes = [
    { text: 'सत्संग से ही मोक्ष की प्राप्ति होती है।', source: 'Sant Kabir' },
    { text: 'राधा कृष्न ही जीवन का सार हैं।', source: 'Premanand Ji' },
    { text: 'एक लोटा जल, सारी समस्या का हल।', source: 'Pradeep Mishra Ji' },
    { text: 'पर्चे पे जो लिख गया, वो होकर रहेगा।', source: 'Bageshwar Sarkar' }
];
