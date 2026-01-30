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
        handle: 'RajendraDasJiMaharaj',
        specialty: 'श्रीमद्भागवत कथा',
        emoji: '🙏'
    },
    {
        id: 'pundrik',
        name: 'Shri Pundrik Goswami Ji Maharaj',
        shortName: 'Pundrik Goswami',
        handle: 'PundrikGoswami',
        specialty: 'श्रीमद्भागवत कथा',
        emoji: '📿'
    },
    {
        id: 'morari',
        name: 'Morari Bapu',
        shortName: 'Morari Bapu',
        handle: 'moraboripuramakatha',
        specialty: 'राम कथा',
        emoji: '🙏'
    },
    {
        id: 'jayakishori',
        name: 'Jaya Kishori',
        shortName: 'Jaya Kishori',
        handle: 'iamjayakishori',
        specialty: 'भजन & कथा',
        emoji: '🎤'
    },
    {
        id: 'premanand',
        name: 'Pujya Premanand Ji Maharaj',
        shortName: 'Premanand Ji',
        handle: 'PremanandJiMaharaj',
        specialty: 'श्रीमद्भागवत कथा',
        emoji: '🙏'
    },
    {
        id: 'bageshwar',
        name: 'Bageshwar Dham Sarkar',
        shortName: 'Bageshwar Dham',
        handle: 'BageshwarDhamSarkar',
        specialty: 'दरबार',
        emoji: '✨'
    },
    {
        id: 'pradeep',
        name: 'Pandit Pradeep Mishra',
        shortName: 'Pradeep Mishra Ji',
        handle: 'PanditPradeepMishra',
        specialty: 'शिव महापुराण',
        emoji: '🙏'
    },
    {
        id: 'indresh',
        name: 'Acharya Indresh Upadhyay',
        shortName: 'Indresh Upadhyay',
        handle: 'IndreshUpadhyay',
        specialty: 'श्रीमद्भागवत कथा',
        emoji: '📿'
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
