/**
 * Satsang Scraper - Data Normalizer
 * Converts raw RSS items to Event schema
 */

import { EVENT_TYPE_KEYWORDS, CITY_KEYWORDS } from './config.js';

/**
 * Normalize raw YouTube items to Event schema
 * @param {Array} rawItems - Raw RSS items
 * @returns {Array} Normalized events
 */
export function normalizeEvents(rawItems) {
    return rawItems.map(item => normalizeItem(item)).filter(Boolean);
}

/**
 * Normalize a single RSS item to Event schema
 * @param {Object} item - Raw RSS item
 * @returns {Object} Normalized event
 */
function normalizeItem(item) {
    try {
        const videoId = extractVideoId(item);
        const title = item.title || 'Untitled';
        const description = item.contentSnippet || item.content || '';
        const publishedDate = item.isoDate ? new Date(item.isoDate) : new Date();

        // Detect event type from title/description
        const eventType = detectEventType(title + ' ' + description);

        // Detect city from title/description
        const city = detectCity(title + ' ' + description);

        // Check if likely live/recent
        const isRecent = isWithinDays(publishedDate, 7);

        return {
            id: `yt-${videoId}`,
            type: eventType.type,
            typeName: eventType.name,
            title: cleanTitle(title),
            vachakId: item.vachak?.id || 'unknown',
            location: {
                city: city.id,
                cityName: city.name,
                venue: 'YouTube Live'
            },
            dates: {
                start: formatDate(publishedDate),
                end: formatDate(publishedDate),
                duration: 1,
                timing: isRecent ? 'Recent Upload' : formatDate(publishedDate)
            },
            features: {
                isLive: isRecent,
                isFree: true,
                hasLiveStream: true,
                hasPrasad: false,
                hasAccommodation: false
            },
            source: 'youtube',
            link: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: item.mediaGroup?.['media:thumbnail']?.[0]?.['$']?.url ||
                `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            publishedAt: publishedDate.toISOString()
        };
    } catch (error) {
        console.warn(`⚠️ Failed to normalize item: ${error.message}`);
        return null;
    }
}

/**
 * Extract video ID from RSS item
 */
function extractVideoId(item) {
    if (item.videoId) return item.videoId;
    if (item.id) {
        const match = item.id.match(/yt:video:(.+)/);
        if (match) return match[1];
    }
    if (item.link) {
        const match = item.link.match(/watch\?v=(.+)/);
        if (match) return match[1];
    }
    return 'unknown';
}

/**
 * Detect event type from text
 */
function detectEventType(text) {
    const lowerText = text.toLowerCase();

    for (const [type, keywords] of Object.entries(EVENT_TYPE_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                return {
                    type,
                    name: getTypeName(type)
                };
            }
        }
    }

    return { type: 'other', name: 'सत्संग' };
}

/**
 * Get Hindi name for event type
 */
function getTypeName(type) {
    const names = {
        'bhagwat': 'श्रीमद्भागवत कथा',
        'ramkatha': 'राम कथा',
        'kirtan': 'कीर्तन',
        'darbar': 'दिव्य दरबार',
        'shivpuran': 'शिव महापुराण',
        'concert': 'Live Concert',
        'other': 'सत्संग'
    };
    return names[type] || names['other'];
}

/**
 * Detect city from text
 */
function detectCity(text) {
    const lowerText = text.toLowerCase();

    for (const [cityId, keywords] of Object.entries(CITY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                return {
                    id: cityId,
                    name: getCityName(cityId)
                };
            }
        }
    }

    return { id: 'online', name: 'Online Streaming' };
}

/**
 * Get display name for city
 */
function getCityName(cityId) {
    const names = {
        'vrindavan': 'Vrindavan, UP',
        'mathura': 'Mathura, UP',
        'mumbai': 'Mumbai, MH',
        'delhi': 'New Delhi',
        'ayodhya': 'Ayodhya, UP',
        'varanasi': 'Varanasi, UP',
        'haridwar': 'Haridwar, UK',
        'prayagraj': 'Prayagraj, UP',
        'chitrakoot': 'Chitrakoot, MP',
        'online': 'Online Streaming'
    };
    return names[cityId] || 'India';
}

/**
 * Clean video title (remove channel name suffixes, etc.)
 */
function cleanTitle(title) {
    return title
        .replace(/\s*[\|\-]\s*[^|]+$/, '') // Remove suffix after | or -
        .replace(/LIVE\s*:?\s*/gi, '')     // Remove LIVE prefix
        .replace(/\s+/g, ' ')              // Normalize spaces
        .trim();
}

/**
 * Check if date is within N days of today
 */
function isWithinDays(date, days) {
    const now = new Date();
    const diff = now - date;
    return diff < days * 24 * 60 * 60 * 1000;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
