/**
 * Satsang Scraper - Official Website Scrapers
 * Parses event schedules from official vachak/organization websites
 * 
 * FREE: Uses standard HTTP requests + HTML parsing
 */

import * as cheerio from 'cheerio';
import { VACHAKS, WEBSITE_CONFIGS } from '../config.js';

/**
 * Fetch and parse all configured websites
 * @returns {Promise<Array>} Array of events
 */
export async function fetchAllWebsites() {
    const allEvents = [];

    console.log('🌐 Fetching Official Websites...\n');

    for (const config of WEBSITE_CONFIGS) {
        try {
            const events = await fetchWebsite(config);
            allEvents.push(...events);
            console.log(`✅ ${config.name}: ${events.length} events`);
        } catch (error) {
            console.error(`❌ ${config.name}: ${error.message}`);
        }
    }

    console.log(`\n📊 Total from websites: ${allEvents.length} events`);
    return allEvents;
}

/**
 * Fetch a single website
 * @param {Object} config - Website configuration
 */
async function fetchWebsite(config) {
    const response = await fetch(config.url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return config.parser(html, config);
}

// ============================================
// WEBSITE PARSERS
// ============================================

/**
 * Parse Jadkhor.org (Rajendradas Ji)
 */
export function parseJadkhor(html, config) {
    const $ = cheerio.load(html);
    const events = [];

    // Look for event sections
    // Note: Structure may vary, this is a template
    $('article, .event, .katha-schedule, .upcoming').each((i, el) => {
        try {
            const title = $(el).find('h2, h3, .title').first().text().trim();
            const dateText = $(el).find('.date, time, .schedule').first().text().trim();
            const location = $(el).find('.location, .venue, address').first().text().trim();

            if (title && title.length > 5) {
                events.push({
                    id: `web-jadkhor-${i}-${Date.now()}`,
                    type: detectEventType(title),
                    typeName: 'श्रीमद्भागवत कथा',
                    title: title,
                    vachakId: 'rajendradas',
                    location: {
                        city: extractCity(location) || 'vrindavan',
                        cityName: location || 'Vrindavan, UP',
                        venue: location || 'Jadkhor Gaudham'
                    },
                    dates: parseDateFromText(dateText),
                    features: {
                        isLive: false,
                        isFree: true,
                        hasLiveStream: true,
                        hasPrasad: true,
                        hasAccommodation: true
                    },
                    source: 'website',
                    link: config.url
                });
            }
        } catch (e) {
            // Skip malformed entries
        }
    });

    return events;
}

/**
 * Parse Chitrakutdhamtalgajarda.org (Morari Bapu)
 */
export function parseMorariBapu(html, config) {
    const $ = cheerio.load(html);
    const events = [];

    // Look for Ram Katha schedules
    $('.katha-details, .schedule-item, .event-card, tr').each((i, el) => {
        try {
            const text = $(el).text();

            // Look for date patterns
            const dateMatch = text.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
            const locationMatch = text.match(/(at|venue|location)[:\s]+([^,\n]+)/i);

            if (dateMatch) {
                events.push({
                    id: `web-morari-${i}-${Date.now()}`,
                    type: 'ramkatha',
                    typeName: 'राम कथा',
                    title: 'Ram Katha Manas',
                    vachakId: 'morari',
                    location: {
                        city: 'talgajarda',
                        cityName: locationMatch ? locationMatch[2].trim() : 'Chitrakoot Dham',
                        venue: 'Chitrakut Dham Talgajarda'
                    },
                    dates: parseDateFromText(dateMatch[1]),
                    features: {
                        isLive: false,
                        isFree: true,
                        hasLiveStream: true,
                        hasPrasad: true,
                        hasAccommodation: true
                    },
                    source: 'website',
                    link: config.url
                });
            }
        } catch (e) {
            // Skip
        }
    });

    return events;
}

/**
 * Generic website parser for simpler sites
 */
export function parseGenericSite(html, config) {
    const $ = cheerio.load(html);
    const events = [];

    // Look for common event patterns
    const eventSelectors = [
        '.event', '.katha', '.program', '.schedule',
        'article', '.card', '.item', 'tr'
    ];

    $(eventSelectors.join(', ')).each((i, el) => {
        const text = $(el).text().trim();

        // Must have date-like pattern
        if (text.match(/\d{1,2}[-\/]\d{1,2}/) && text.length > 20 && text.length < 500) {
            events.push({
                id: `web-generic-${i}-${Date.now()}`,
                type: 'bhagwat',
                typeName: 'सत्संग',
                title: text.substring(0, 50).trim(),
                vachakId: config.vachakId || 'unknown',
                location: {
                    city: 'online',
                    cityName: 'See website',
                    venue: 'Check Link'
                },
                dates: {
                    start: new Date().toISOString().split('T')[0],
                    end: new Date().toISOString().split('T')[0],
                    duration: 1,
                    timing: 'See website'
                },
                features: {
                    isLive: false,
                    isFree: true,
                    hasLiveStream: true
                },
                source: 'website',
                link: config.url,
                rawText: text
            });
        }
    });

    return events.slice(0, 5); // Limit to 5 per site
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function detectEventType(title) {
    const lower = title.toLowerCase();
    if (lower.includes('bhagwat') || lower.includes('भागवत')) return 'bhagwat';
    if (lower.includes('ram') || lower.includes('राम')) return 'ramkatha';
    if (lower.includes('shiv') || lower.includes('शिव')) return 'shivpuran';
    if (lower.includes('kirtan') || lower.includes('कीर्तन')) return 'kirtan';
    if (lower.includes('darbar') || lower.includes('दरबार')) return 'darbar';
    return 'bhagwat';
}

function extractCity(text) {
    const lower = text.toLowerCase();
    const cities = ['vrindavan', 'mathura', 'mumbai', 'delhi', 'varanasi', 'ayodhya'];
    for (const city of cities) {
        if (lower.includes(city)) return city;
    }
    return 'online';
}

function parseDateFromText(text) {
    const today = new Date();
    // Try to parse common date formats
    const match = text.match(/(\d{1,2})[-\/](\d{1,2})[-\/]?(\d{2,4})?/);

    if (match) {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = match[3] ? parseInt(match[3]) : today.getFullYear();
        const fullYear = year < 100 ? 2000 + year : year;

        const date = new Date(fullYear, month, day);
        return {
            start: date.toISOString().split('T')[0],
            end: date.toISOString().split('T')[0],
            duration: 7,
            timing: 'See website'
        };
    }

    return {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
        duration: 1,
        timing: text || 'TBD'
    };
}
