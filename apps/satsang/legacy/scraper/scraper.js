/**
 * Satsang YouTube Scraper
 * AUTOMATION: Fetches latest videos from Vachak RSS feeds and updates Firestore
 */

const Parser = require('rss-parser');
const { initFirebase, admin } = require('./firebase-config');

const parser = new Parser();
const db = initFirebase();

// Vachak Channel Mapping (Manual Map for MVP)
// ideally this comes from the 'vachaks' collection in Firestore
const VACHAK_CHANNELS = [
    { id: 'rajendradas', name: 'Rajendradas Ji', channelId: 'UC_CHANNEL_ID_HERE' }, // Needs real ID
    { id: 'pundrik', name: 'Pundrik Goswami', channelId: 'UC_CHANNEL_ID_HERE' },
    { id: 'morari', name: 'Morari Bapu', channelId: 'UC_CHANNEL_ID_HERE' },
    { id: 'premanand', name: 'Premanand Ji', channelId: 'UC_CHANNEL_ID_HERE' },
    { id: 'jayakishori', name: 'Jaya Kishori', channelId: 'UC_CHANNEL_ID_HERE' }
];

async function runScraper() {
    if (!db) return;

    console.log('Starting Scraper Job... 🚀');

    for (const vachak of VACHAK_CHANNELS) {
        if (vachak.channelId === 'UC_CHANNEL_ID_HERE') {
            console.log(`⚠️ Skipping ${vachak.name}: No Channel ID configured`);
            continue;
        }

        try {
            console.log(`Fetching feed for: ${vachak.name}...`);
            const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${vachak.channelId}`);

            // Process latest 5 videos
            for (const item of feed.items.slice(0, 5)) {
                await processVideoItem(vachak, item);
            }

        } catch (error) {
            console.error(`Error scraping ${vachak.name}:`, error.message);
        }
    }

    console.log('Scraper Job Finished ✨');
}

async function processVideoItem(vachak, item) {
    // Check if duplicate exists
    const videoId = item.id.split(':')[2]; // yt:video:ID
    const docRef = db.collection('events').doc(`yt-${videoId}`);
    const doc = await docRef.get();

    if (doc.exists) {
        // Already exists, maybe update status if needed
        return;
    }

    // Heuristics to determine if it's a "Katha" or "Live"
    const isLive = true; // RSS doesn't strictly say live, but usually latest items are.
    // Real App would use YouTube Data API for 'liveStreamingDetails'

    const eventData = {
        id: `yt-${videoId}`,
        type: 'youtube_feed',
        source: 'scraper',
        title: item.title,
        description: item.contentSnippet || '',
        vachakId: vachak.id,
        link: item.link,
        publishedAt: admin.firestore.Timestamp.fromDate(new Date(item.isoDate)),
        features: {
            isLive: isLive,
            hasLiveStream: true,
            isFree: true
        },
        // Default location/dates until we have AI parser
        location: { cityName: 'Online Channel', city: 'online' },
        dates: {
            start: item.isoDate,
            timing: 'Streaming Now'
        }
    };

    await docRef.set(eventData);
    console.log(`   + Added Event: ${item.title}`);
}

// Run
runScraper();
