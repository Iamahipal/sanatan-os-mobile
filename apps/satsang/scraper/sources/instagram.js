/**
 * Satsang Scraper - Instagram Scraper
 * Parses public Instagram profiles for event announcements
 * 
 * FREE: Uses public profile page HTML (no API key needed)
 * Note: Instagram may block excessive requests - use sparingly
 */

import * as cheerio from 'cheerio';
import { VACHAKS, INSTAGRAM_HANDLES } from '../config.js';

const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests

/**
 * Fetch and parse all configured Instagram profiles
 * @returns {Promise<Array>} Array of events from Instagram
 */
export async function fetchAllInstagram() {
    const allEvents = [];

    console.log('📸 Fetching Instagram Profiles...\n');

    for (const handle of Object.keys(INSTAGRAM_HANDLES)) {
        try {
            // Rate limiting
            await sleep(RATE_LIMIT_DELAY);

            const events = await fetchInstagramProfile(handle);
            allEvents.push(...events);
            console.log(`✅ @${handle}: ${events.length} announcements`);
        } catch (error) {
            console.error(`❌ @${handle}: ${error.message}`);
        }
    }

    console.log(`\n📊 Total from Instagram: ${allEvents.length} events`);
    return allEvents;
}

/**
 * Fetch a single Instagram profile (public page)
 * @param {string} handle - Instagram username (without @)
 */
async function fetchInstagramProfile(handle) {
    const config = INSTAGRAM_HANDLES[handle];
    const url = `https://www.instagram.com/${handle}/`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        return parseInstagramPage(html, handle, config);

    } catch (error) {
        // Instagram often blocks scrapers
        if (error.message.includes('403') || error.message.includes('429')) {
            console.warn(`   ⚠️ Rate limited or blocked for @${handle}`);
        }
        throw error;
    }
}

/**
 * Parse Instagram page HTML for event data
 * Instagram's HTML often contains JSON-LD or embedded data
 */
function parseInstagramPage(html, handle, config) {
    const events = [];
    const $ = cheerio.load(html);

    // Try to find JSON-LD data (Instagram sometimes includes this)
    const jsonLd = $('script[type="application/ld+json"]').html();
    if (jsonLd) {
        try {
            const data = JSON.parse(jsonLd);
            // Parse structured data if available
            if (data.description) {
                const eventData = extractEventFromText(data.description, handle, config);
                if (eventData) events.push(eventData);
            }
        } catch (e) {
            // JSON parse failed, continue
        }
    }

    // Try to find shared data (Instagram's internal state)
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/);
    if (sharedDataMatch) {
        try {
            const sharedData = JSON.parse(sharedDataMatch[1]);
            const user = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user;

            if (user?.biography) {
                const bioEvent = extractEventFromText(user.biography, handle, config);
                if (bioEvent) events.push(bioEvent);
            }

            // Check recent posts
            const edges = user?.edge_owner_to_timeline_media?.edges || [];
            for (const edge of edges.slice(0, 3)) {
                const caption = edge.node?.edge_media_to_caption?.edges?.[0]?.node?.text;
                if (caption) {
                    const postEvent = extractEventFromText(caption, handle, config);
                    if (postEvent) events.push(postEvent);
                }
            }
        } catch (e) {
            // Parse failed
        }
    }

    // Fallback: look for meta description
    const metaDesc = $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content');

    if (metaDesc && events.length === 0) {
        const metaEvent = extractEventFromText(metaDesc, handle, config);
        if (metaEvent) events.push(metaEvent);
    }

    return events;
}

/**
 * Extract event data from text content
 */
function extractEventFromText(text, handle, config) {
    if (!text || text.length < 20) return null;

    // Look for date patterns
    const datePatterns = [
        /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(\d{4})?/gi,
        /(\d{1,2})[-\/](\d{1,2})[-\/]?(\d{2,4})?/g,
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{1,2})/gi
    ];

    let dateMatch = null;
    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
            dateMatch = match[0];
            break;
        }
    }

    // Look for location patterns
    const locationPatterns = [
        /(?:at|venue|location|📍|in)\s*[:\-]?\s*([^,\n]{5,50})/i,
        /(vrindavan|mathura|mumbai|delhi|varanasi|ayodhya|haridwar)/i
    ];

    let location = 'See Instagram';
    for (const pattern of locationPatterns) {
        const match = text.match(pattern);
        if (match) {
            location = match[1].trim();
            break;
        }
    }

    // Look for event type keywords
    const keywords = ['katha', 'darbar', 'concert', 'satsang', 'kirtan', 'bhajan', 'live'];
    const hasEventKeyword = keywords.some(k => text.toLowerCase().includes(k));

    // Only create event if we found a date or event keyword
    if (!dateMatch && !hasEventKeyword) return null;

    return {
        id: `ig-${handle}-${Date.now()}`,
        type: detectEventType(text),
        typeName: config.specialty || 'सत्संग',
        title: extractTitle(text),
        vachakId: config.vachakId,
        location: {
            city: extractCityId(location),
            cityName: location,
            venue: 'See Instagram'
        },
        dates: parseDateFromText(dateMatch || ''),
        features: {
            isLive: text.toLowerCase().includes('live'),
            isFree: !text.toLowerCase().includes('ticket'),
            hasLiveStream: true
        },
        source: 'instagram',
        link: `https://instagram.com/${handle}`,
        rawText: text.substring(0, 200)
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function detectEventType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('bhagwat') || lower.includes('भागवत')) return 'bhagwat';
    if (lower.includes('ram') || lower.includes('राम')) return 'ramkatha';
    if (lower.includes('shiv') || lower.includes('शिव')) return 'shivpuran';
    if (lower.includes('kirtan') || lower.includes('भजन')) return 'kirtan';
    if (lower.includes('darbar') || lower.includes('दरबार')) return 'darbar';
    if (lower.includes('concert')) return 'concert';
    return 'bhagwat';
}

function extractTitle(text) {
    // Try to find a title-like phrase
    const titleMatch = text.match(/^([^\n.!?]{10,60})/);
    if (titleMatch) {
        return titleMatch[1].trim();
    }
    return text.substring(0, 50).trim() + '...';
}

function extractCityId(location) {
    const lower = location.toLowerCase();
    const cities = {
        'vrindavan': 'vrindavan',
        'mathura': 'mathura',
        'mumbai': 'mumbai',
        'delhi': 'delhi',
        'varanasi': 'varanasi',
        'ayodhya': 'ayodhya',
        'haridwar': 'haridwar',
        'chitrakoot': 'chitrakoot'
    };

    for (const [name, id] of Object.entries(cities)) {
        if (lower.includes(name)) return id;
    }
    return 'online';
}

function parseDateFromText(text) {
    const today = new Date();

    // Try month name format
    const monthMatch = text.match(/(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
    if (monthMatch) {
        const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
        const day = parseInt(monthMatch[1]);
        const month = months[monthMatch[2].toLowerCase()];
        const year = today.getFullYear();

        const date = new Date(year, month, day);
        return {
            start: date.toISOString().split('T')[0],
            end: date.toISOString().split('T')[0],
            duration: 1,
            timing: 'See Instagram'
        };
    }

    // Try numeric format
    const numMatch = text.match(/(\d{1,2})[-\/](\d{1,2})[-\/]?(\d{2,4})?/);
    if (numMatch) {
        const day = parseInt(numMatch[1]);
        const month = parseInt(numMatch[2]) - 1;
        const year = numMatch[3] ? parseInt(numMatch[3]) : today.getFullYear();
        const fullYear = year < 100 ? 2000 + year : year;

        const date = new Date(fullYear, month, day);
        return {
            start: date.toISOString().split('T')[0],
            end: date.toISOString().split('T')[0],
            duration: 1,
            timing: 'Check Instagram'
        };
    }

    return {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
        duration: 1,
        timing: 'TBD'
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
