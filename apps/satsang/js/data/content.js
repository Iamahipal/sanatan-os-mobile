/**
 * Satsang App - Content Library Data
 * Video recordings and bhajan collections
 */

// Past Katha Recordings
export const recordings = [
    {
        id: 'rec-1',
        title: 'Bhagwat Katha Day 1 - Introduction',
        vachakId: 'devkinandan',
        thumbnail: 'https://i.ytimg.com/vi/EXAMPLE1/hqdefault.jpg',
        youtubeId: 'dQw4w9WgXcQ',
        duration: '2:45:00',
        views: '1.2M',
        date: '2026-01-15',
        category: 'bhagwat',
        language: 'hindi'
    },
    {
        id: 'rec-2',
        title: 'Ram Katha - Sundar Kand',
        vachakId: 'morari',
        thumbnail: 'https://i.ytimg.com/vi/EXAMPLE2/hqdefault.jpg',
        youtubeId: 'dQw4w9WgXcQ',
        duration: '3:15:00',
        views: '2.5M',
        date: '2026-01-10',
        category: 'ramkatha',
        language: 'hindi'
    },
    {
        id: 'rec-3',
        title: 'Shiv Mahapuran - Part 1',
        vachakId: 'jaya',
        thumbnail: 'https://i.ytimg.com/vi/EXAMPLE3/hqdefault.jpg',
        youtubeId: 'dQw4w9WgXcQ',
        duration: '1:55:00',
        views: '890K',
        date: '2026-01-05',
        category: 'bhagwat',
        language: 'hindi'
    }
];

// Bhajan Collection
export const bhajans = [
    {
        id: 'bhajan-1',
        title: 'Achyutam Keshavam',
        artist: 'Various',
        album: 'Morning Bhajans',
        duration: '5:30',
        audioUrl: null, // Would be actual audio URL
        youtubeId: 'dQw4w9WgXcQ',
        lyrics: `अच्युतम् केशवम् रामनारायणम्
कृष्णदामोदरम् वासुदेवम् हरिम्
श्रीधरम् माधवम् गोपिकावल्लभम्
जानकीनायकम् रामचन्द्रम् भजे`,
        category: 'morning',
        deity: 'krishna'
    },
    {
        id: 'bhajan-2',
        title: 'Hare Krishna Mahamantra',
        artist: 'Various',
        album: 'Kirtan Collection',
        duration: '11:00',
        audioUrl: null,
        youtubeId: 'dQw4w9WgXcQ',
        lyrics: `हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे
हरे राम हरे राम राम राम हरे हरे`,
        category: 'kirtan',
        deity: 'krishna'
    },
    {
        id: 'bhajan-3',
        title: 'Shiv Tandav Stotram',
        artist: 'Various',
        album: 'Shiv Bhajans',
        duration: '8:45',
        audioUrl: null,
        youtubeId: 'dQw4w9WgXcQ',
        lyrics: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥`,
        category: 'stotram',
        deity: 'shiva'
    },
    {
        id: 'bhajan-4',
        title: 'Hanuman Chalisa',
        artist: 'Various',
        album: 'Hanuman Bhajans',
        duration: '9:30',
        audioUrl: null,
        youtubeId: 'dQw4w9WgXcQ',
        lyrics: `श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।
बरनउं रघुबर बिमल जसु जो दायकु फल चारि॥`,
        category: 'chalisa',
        deity: 'hanuman'
    }
];

// Content categories
export const contentCategories = [
    { id: 'all', label: 'All', labelHi: 'सभी', icon: 'grid' },
    { id: 'bhagwat', label: 'Bhagwat', labelHi: 'भागवत', icon: 'book-open' },
    { id: 'ramkatha', label: 'Ram Katha', labelHi: 'राम कथा', icon: 'feather' },
    { id: 'kirtan', label: 'Kirtan', labelHi: 'कीर्तन', icon: 'music' },
    { id: 'stotram', label: 'Stotram', labelHi: 'स्तोत्रम्', icon: 'scroll' }
];

// Bhajan categories for filtering
export const bhajanCategories = [
    { id: 'all', label: 'All Bhajans' },
    { id: 'morning', label: 'Morning' },
    { id: 'evening', label: 'Evening' },
    { id: 'kirtan', label: 'Kirtan' },
    { id: 'stotram', label: 'Stotram' },
    { id: 'chalisa', label: 'Chalisa' }
];

// Get recordings by category
export function getRecordingsByCategory(category) {
    if (category === 'all') return recordings;
    return recordings.filter(r => r.category === category);
}

// Get bhajans by category
export function getBhajansByCategory(category) {
    if (category === 'all') return bhajans;
    return bhajans.filter(b => b.category === category);
}

// Get bhajans by deity
export function getBhajansByDeity(deity) {
    return bhajans.filter(b => b.deity === deity);
}
