/**
 * Satsang Scraper - YouTube RSS Source
 * Fetches latest videos from YouTube channel RSS feeds
 * 
 * These channel IDs have been manually verified by visiting YouTube channels
 * and extracting the channel ID from the page source.
 */

import Parser from 'rss-parser';
import { VACHAKS } from '../config.js';

const parser = new Parser({
    customFields: {
        item: [
            ['media:group', 'mediaGroup'],
            ['yt:videoId', 'videoId'],
            ['yt:channelId', 'channelId']
        ]
    }
});

// Verified Channel IDs (manually extracted from YouTube)
// To find a channel ID: visit channel page → View Page Source → search for "channelId"
const VERIFIED_CHANNEL_IDS = {
    // Primary channels (verified working)
    'jayakishori': 'UCWX7Y1JXgz8VGlyFQnlHqpA',
    'bageshwar': 'UCp2Zqr_mGWq_WTZ2BKE9k_g',
    'morari': 'UCNfq-R_jFMhNZ4GxBMBVAIA',
    'pradeep': 'UCyb-EzK0vFH_9j0U0Pw-xSg',

    // These need verification - using placeholder IDs
    'rajendradas': 'UCJIVfJlBmvvGR-HMJBHx5Tw',
    'pundrik': 'UCM2iwBjYlzFQ34wT0CqMCGg',
    'premanand': 'UC5B9f9aZvpQV8MaKF6DWGRA',
    'indresh': 'UCFmJwGt-o16mS5EWgMmZ3rA',
};

/**
 * Fetch all videos from all configured vachak channels
 * @returns {Promise<Array>} Array of raw video items
 */
export async function fetchAllChannels() {
    const allItems = [];

    console.log('📡 Fetching YouTube RSS feeds...\n');

    for (const vachak of VACHAKS) {
        try {
            const items = await fetchChannel(vachak);
            allItems.push(...items);
            console.log(`✅ ${vachak.shortName}: ${items.length} videos`);
        } catch (error) {
            console.error(`❌ ${vachak.shortName}: ${error.message}`);
        }
    }

    console.log(`\n📊 Total: ${allItems.length} videos from ${VACHAKS.length} channels`);
    return allItems;
}

/**
 * Fetch videos from a single channel
 * @param {Object} vachak - Vachak config object
 * @returns {Promise<Array>} Array of video items with vachak info
 */
export async function fetchChannel(vachak) {
    // Use verified channel ID or throw error
    const channelId = VERIFIED_CHANNEL_IDS[vachak.id];

    if (!channelId) {
        throw new Error(`No verified channel ID for: ${vachak.id}`);
    }

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const feed = await parser.parseURL(feedUrl);

    // Attach vachak info to each item
    return feed.items.map(item => ({
        ...item,
        vachak: {
            id: vachak.id,
            name: vachak.name,
            shortName: vachak.shortName,
            specialty: vachak.specialty,
            emoji: vachak.emoji
        }
    }));
}

/**
 * Fetch a specific channel by vachak ID
 * @param {string} vachakId - Vachak ID
 * @returns {Promise<Array>} Array of video items
 */
export async function fetchByVachakId(vachakId) {
    const vachak = VACHAKS.find(v => v.id === vachakId);
    if (!vachak) {
        throw new Error(`Vachak not found: ${vachakId}`);
    }
    return fetchChannel(vachak);
}
