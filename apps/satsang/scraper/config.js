/**
 * Satsang Scraper - Configuration
 * YouTube Channel Handles (@ usernames) and settings
 */

// Vachak YouTube Channel Mapping
// Using handles (@username) which are more reliable
export const VACHAKS = [
    {
        id: 'rajendradas',
        name: 'Swami Shri Rajendradas Ji Maharaj',
        shortName: 'Rajendradas Ji',
        handle: 'rajendradasjimaharaj',
        officialSite: 'https://jadkhor.org',
        specialty: 'Bhagwat Katha',
        emoji: '🙏'
    },
    {
        id: 'pundrik',
        name: 'Shri Pundrik Goswami Ji Maharaj',
        shortName: 'Pundrik Goswami',
        handle: 'sripundrik',
        specialty: 'Bhagwat Katha',
        emoji: '📿'
    },
    {
        id: 'morari',
        name: 'Morari Bapu',
        shortName: 'Morari Bapu',
        handle: 'moraribapu',
        officialSite: 'https://chitrakutdhamtalgajarda.org',
        specialty: 'Ram Katha',
        emoji: '🙏'
    },
    {
        id: 'jayakishori',
        name: 'Jaya Kishori',
        shortName: 'Jaya Kishori',
        handle: 'iamjayakishori',
        specialty: 'Bhajan and Katha',
        emoji: '🎤'
    },
    {
        id: 'premanand',
        name: 'Pujya Premanand Ji Maharaj',
        shortName: 'Premanand Ji',
        handle: 'BhajanMarg',
        specialty: 'Bhagwat Katha',
        emoji: '🙏'
    },
    {
        id: 'bageshwar',
        name: 'Bageshwar Dham Sarkar',
        shortName: 'Bageshwar Dham',
        handle: 'BageshwarDhamSarkar',
        officialSite: 'https://bageshwardham.co.in',
        specialty: 'Darbar',
        emoji: '✨'
    },
    {
        id: 'pradeepmishra',
        name: 'Pandit Pradeep Mishra',
        shortName: 'Pradeep Mishra Ji',
        handle: 'PradeepMishra',
        specialty: 'Shiv Mahapuran',
        emoji: '🙏'
    },
    {
        id: 'indresh',
        name: 'Acharya Indresh Upadhyay',
        shortName: 'Indresh Upadhyay',
        handle: 'BhaktiPath',
        officialSite: 'https://bhaktipaths.com',
        specialty: 'Bhagwat Katha',
        emoji: '📿'
    },
    {
        id: 'devkinandan',
        name: 'Pujya Devkinandan Thakur Ji',
        shortName: 'Devkinandan Ji',
        handle: 'DevkinandanThakurJi',
        specialty: 'Bhagwat Katha',
        emoji: '🙏'
    },
    {
        id: 'aniruddhacharya',
        name: 'Pujya Shri Aniruddhacharya Ji Maharaj',
        shortName: 'Aniruddhacharya Ji',
        handle: 'Aniruddhacharyaji',
        officialSite: 'https://en.aniruddhacharya.com',
        specialty: 'Bhagwat Katha',
        emoji: '🎤'
    },
    {
        id: 'rajanji',
        name: 'Pujya Rajan Ji Maharaj',
        shortName: 'Rajan Ji',
        handle: 'pujyarajanjee',
        specialty: 'Ram Katha',
        emoji: '🎶'
    },
    {
        id: 'vijaykaushal',
        name: 'Swami Vijay Kaushal Ji Maharaj',
        shortName: 'Vijay Kaushal Ji',
        handle: 'VIJAYKAUSHALJIMAHARAJ',
        specialty: 'Bhagwat Katha',
        emoji: '🙏',
        disabled: true
    },
    {
        id: 'prembhushan',
        name: 'Swami Prembhushan Ji Maharaj',
        shortName: 'Prembhushan Ji',
        handle: 'PujyaPrembhushanjiMaharaj',
        specialty: 'Ram Katha',
        emoji: '🎤'
    },
    {
        id: 'rameshoza',
        name: 'Bhaishree Rameshbhai Oza',
        shortName: 'Ramesh Oza',
        handle: 'PujyaBhaishriRameshbhaiOza',
        specialty: 'Bhagwat Katha',
        emoji: '📿',
        disabled: true
    },
    {
        id: 'srisri',
        name: 'Gurudev Sri Sri Ravi Shankar',
        shortName: 'Sri Sri',
        handle: 'SriSriRaviShankar',
        specialty: 'Satsang and Spiritual Talks',
        emoji: '✨'
    },
    {
        id: 'sadhguru',
        name: 'Sadhguru Jaggi Vasudev',
        shortName: 'Sadhguru',
        handle: 'sadhguru',
        officialSite: 'https://isha.sadhguru.org',
        specialty: 'Spiritual Talks',
        emoji: '🧘'
    },
    {
        id: 'mukundananda',
        name: 'Swami Mukundananda',
        shortName: 'Mukundananda Ji',
        handle: 'SwamiMukundananda',
        officialSite: 'https://www.swamimukundananda.org',
        specialty: 'Gita and Bhakti',
        emoji: '🙏'
    },
    {
        id: 'radhanath_swami',
        name: 'Radhanath Swami',
        shortName: 'Radhanath Swami',
        handle: 'radhanathswami',
        specialty: 'Bhakti and Satsang',
        emoji: '🙏'
    },
    {
        id: 'gaurgopaldas',
        name: 'Gaur Gopal Das',
        shortName: 'Gaur Gopal Das',
        handle: 'gaurgopaldas',
        officialSite: 'https://gaurgopaldas.in',
        specialty: 'Practical Spiritual Guidance',
        emoji: '🎤'
    },
    {
        id: 'gaurangdas',
        name: 'Gauranga Das Prabhu',
        shortName: 'Gauranga Das',
        handle: 'gaurangadas',
        specialty: 'Bhagavad Gita Talks',
        emoji: '📿'
    },
    {
        id: 'chinmaya',
        name: 'Chinmaya Mission',
        shortName: 'Chinmaya Mission',
        handle: 'ChinmayaChannel',
        officialSite: 'https://www.chinmayamission.com',
        specialty: 'Vedanta Talks',
        emoji: '📿'
    },
    {
        id: 'amma',
        name: 'Mata Amritanandamayi (Amma)',
        shortName: 'Amma',
        handle: 'amma',
        officialSite: 'https://amma.org',
        specialty: 'Satsang and Spiritual Teachings',
        emoji: '🙏'
    },
    {
        id: 'baps_betterliving',
        name: 'BAPS Better Living',
        shortName: 'BAPS Better Living',
        handle: 'BAPSBetterLiving',
        specialty: 'Spiritual Discourses',
        emoji: '🕉️'
    },
    {
        id: 'artofliving',
        name: 'The Art of Living',
        shortName: 'Art of Living',
        handle: 'artofliving-official',
        officialSite: 'https://www.artofliving.org',
        specialty: 'Meditation and Spiritual Guidance',
        emoji: '🕊️'
    }
];

// Event type keywords detection
export const EVENT_TYPE_KEYWORDS = {
    'bhagwat': ['भागवत', 'bhagwat', 'bhagavat', 'bhagavatam', 'srimad'],
    'ramkatha': ['राम कथा', 'ram katha', 'ramkatha', 'ramayan', 'रामायण'],
    'kirtan': ['कीर्तन', 'kirtan', 'bhajan', 'भजन', 'sankirtan'],
    'darbar': ['दरबार', 'darbar', 'live session', 'divya darbar'],
    'shivpuran': ['शिव', 'shiv', 'mahapuran', 'महापुराण'],
    'concert': ['concert', 'live performance', 'stage show']
};

// City detection keywords
export const CITY_KEYWORDS = {
    'vrindavan': ['vrindavan', 'vrndavan', 'वृंदावन', 'brindavan'],
    'mathura': ['mathura', 'मथुरा'],
    'mumbai': ['mumbai', 'मुंबई', 'bombay'],
    'delhi': ['delhi', 'दिल्ली', 'new delhi'],
    'ayodhya': ['ayodhya', 'अयोध्या'],
    'varanasi': ['varanasi', 'वाराणसी', 'banaras', 'kashi'],
    'haridwar': ['haridwar', 'हरिद्वार'],
    'prayagraj': ['prayagraj', 'प्रयागराज', 'allahabad'],
    'chitrakoot': ['chitrakoot', 'चित्रकूट'],
    'online': ['online', 'live', 'streaming']
};

// Export path for generated events
export const OUTPUT_PATH = '../js/data/scraped_events.json';

// ============================================
// OFFICIAL WEBSITE CONFIGURATIONS
// ============================================

import { parseJadkhor, parseMorariBapu, parseGenericSite } from './sources/websites.js';

export const WEBSITE_CONFIGS = [
    {
        id: 'jadkhor',
        name: 'Jadkhor Gaudham',
        url: 'https://jadkhor.org',
        vachakId: 'rajendradas',
        parser: parseJadkhor
    },
    {
        id: 'chitrakutdham',
        name: 'Chitrakut Dham Talgajarda',
        url: 'https://chitrakutdhamtalgajarda.org',
        vachakId: 'morari',
        parser: parseMorariBapu
    },
    {
        id: 'bageshwardham',
        name: 'Bageshwar Dham Official',
        url: 'https://bageshwardham.co.in/en',
        fallbackUrls: ['https://bageshwardham.co.in'],
        vachakId: 'bageshwar',
        parser: parseGenericSite
    }
];

// ============================================
// INSTAGRAM HANDLE CONFIGURATIONS
// ============================================

export const INSTAGRAM_HANDLES = {
    'iamjayakishori': {
        vachakId: 'jayakishori',
        specialty: 'Bhajan and Katha',
        priority: 1
    },
    'bageshwardhamsarkar': {
        vachakId: 'bageshwar',
        specialty: 'Divya Darbar',
        priority: 1
    },
    'sripundrik': {
        vachakId: 'pundrik',
        specialty: 'Bhagwat Katha',
        priority: 2
    },
    'panditpradeep.mishra': {
        vachakId: 'pradeepmishra',
        specialty: 'Shiv Mahapuran',
        priority: 2
    },
    'rajendradasjimaharaj': {
        vachakId: 'rajendradas',
        specialty: 'Bhagwat Katha',
        priority: 2
    },
    'devkinandanthakurji': {
        vachakId: 'devkinandan',
        specialty: 'Bhagwat Katha',
        priority: 2
    },
    'aniruddhacharyajimaharaj': {
        vachakId: 'aniruddhacharya',
        specialty: 'Bhagwat Katha',
        priority: 2
    },
    'pujyarajanjee': {
        vachakId: 'rajanji',
        specialty: 'Ram Katha',
        priority: 2
    },
    'gaurgopaldas': {
        vachakId: 'gaurgopaldas',
        specialty: 'Spiritual Talks',
        priority: 3
    },
    'gaurangadas': {
        vachakId: 'gaurangdas',
        specialty: 'Gita Talks',
        priority: 3
    },
    'gurudev': {
        vachakId: 'srisri',
        specialty: 'Satsang',
        priority: 2
    },
    'sadhguru': {
        vachakId: 'sadhguru',
        specialty: 'Spiritual Talks',
        priority: 2
    },
    'mataamritanandamayi': {
        vachakId: 'amma',
        specialty: 'Satsang and Spiritual Teachings',
        priority: 2
    },
    'baps_betterliving': {
        vachakId: 'baps_betterliving',
        specialty: 'Spiritual Discourses',
        priority: 3
    },
    'artofliving': {
        vachakId: 'artofliving',
        specialty: 'Meditation and Spiritual Guidance',
        priority: 2
    }
};
