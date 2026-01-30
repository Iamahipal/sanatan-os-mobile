/**
 * Satsang Scraper - CLI Entry Point
 * Usage: npm run scrape
 * 
 * Note: If YouTube RSS is blocked, this will use manual.json fallback
 */

import { fetchAllChannels } from './sources/youtube.js';
import { normalizeEvents } from './normalizer.js';
import { exportToJson, exportVachaks, mergeWithManual } from './export.js';
import { VACHAKS } from './config.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('   🕉️  SATSANG EVENT SCRAPER v1.0');
    console.log('═══════════════════════════════════════════\n');

    const startTime = Date.now();
    let events = [];

    try {
        // Step 1: Try to fetch from YouTube RSS
        console.log('📡 STEP 1: Fetching YouTube RSS Feeds...\n');

        try {
            const rawItems = await fetchAllChannels();

            if (rawItems.length > 0) {
                // Step 2: Normalize to Event schema
                console.log('\n🔄 STEP 2: Normalizing to Event Schema...');
                events = normalizeEvents(rawItems);
                console.log(`   Normalized ${events.length} events`);
            }
        } catch (fetchError) {
            console.log(`\n⚠️ RSS fetch failed: ${fetchError.message}`);
            console.log('   Falling back to manual data...\n');
        }

        // Step 3: Merge with manual events
        console.log('\n🔀 STEP 3: Loading Manual Events...');
        const manualPath = join(__dirname, 'data', 'manual.json');

        if (existsSync(manualPath)) {
            try {
                const manualData = JSON.parse(readFileSync(manualPath, 'utf-8'));
                const manualEvents = manualData.events || [];

                // If no scraped events, use all manual events
                if (events.length === 0) {
                    events = manualEvents;
                    console.log(`   Using ${events.length} manual events (RSS unavailable)`);
                } else {
                    // Merge, avoiding duplicates
                    const ids = new Set(events.map(e => e.id));
                    for (const evt of manualEvents) {
                        if (!ids.has(evt.id)) {
                            events.push(evt);
                        }
                    }
                    console.log(`   Merged: ${events.length} total events`);
                }
            } catch (err) {
                console.log(`   ⚠️ Could not load manual.json: ${err.message}`);
            }
        }

        if (events.length === 0) {
            console.log('\n⚠️ No events found. Add events to scraper/data/manual.json');
        }

        // Step 4: Export to JSON
        console.log('\n💾 STEP 4: Exporting to JSON...');
        exportToJson(events, 'scraped_events.json');
        exportVachaks(VACHAKS, 'vachaks.json');

        // Summary
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log('\n═══════════════════════════════════════════');
        console.log(`   ✅ COMPLETE in ${duration}s`);
        console.log(`   📊 ${events.length} events exported`);
        console.log('═══════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ SCRAPER FAILED:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run
main();
