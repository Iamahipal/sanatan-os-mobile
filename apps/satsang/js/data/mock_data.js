/**
 * Golden Data Source
 * Verified manually. Used for initial hydration.
 */

export const vachaks = [
    {
        id: 'rajendradas',
        name: 'Swami Shri Rajendradas Devacharya Ji Maharaj',
        shortName: 'Rajendradas Ji',
        image: 'assets/images/rajendradas.png',
        specialty: 'Bhaktimal',
        bio: 'Malook Peethadhishwar, Vrindavan.'
    },
    {
        id: 'pundrik',
        name: 'Pundrik Goswami Ji',
        shortName: 'Pundrik Goswami',
        image: 'assets/images/pundrik.png',
        specialty: 'Bhagwat Katha',
        bio: 'Radharaman Peeth, Vrindavan.'
    },
    {
        id: 'morari',
        name: 'Morari Bapu',
        shortName: 'Morari Bapu',
        image: 'assets/images/morari.png',
        specialty: 'Ram Katha',
        bio: 'Expounder of Ram Charit Manas.'
    },
    {
        id: 'indresh',
        name: 'Pt. Indresh Upadhyay',
        shortName: 'Indresh Ji',
        image: 'assets/images/indresh.png',
        specialty: 'Bhagwat Katha',
        bio: 'Rasik Saint of Vrindavan.'
    }
];

export const events = [
    {
        id: 'evt-1',
        title: 'Shrimad Bhagwat Katha',
        vachakId: 'indresh',
        location: 'Vrindavan, UP',
        date: 'Live Now',
        type: 'live',
        image: 'assets/images/event-bg-1.jpg'
    },
    {
        id: 'evt-2',
        title: 'Shri Ram Katha',
        vachakId: 'rajendradas',
        location: 'Mathura, UP',
        date: 'Jan 22 - Jan 28',
        type: 'upcoming'
    },
    {
        id: 'evt-3',
        title: 'Braj Bhagwat',
        vachakId: 'pundrik',
        location: 'Mumbai, MH',
        date: 'Jan 27 - Feb 02',
        type: 'upcoming'
    }
];

export const categories = [
    { id: 'all', label: 'All', icon: 'infinity' },
    { id: 'bhagwat', label: 'Bhagwat', icon: 'book-open' },
    { id: 'ramkatha', label: 'Ram Katha', icon: 'feather' },
    { id: 'kirtan', label: 'Kirtan', icon: 'music' }
];
