/**
 * Satsang Scraper v1.1 - Multi-Platform CLI
 * Usage: 
 *   npm run scrape              # All sources
 *   npm run scrape:youtube      # YouTube only
 *   npm run scrape:websites     # Websites only
 *   npm run scrape:instagram    # Instagram only
 * 
 * All sources are FREE (no paid APIs)
 */

import { fetchAllChannels } from './sources/youtube.js';
import { fetchAllWebsites } from './sources/websites.js';
import { fetchAllInstagram } from './sources/instagram.js';
import { normalizeEvents } from './normalizer.js';
import { exportToJson, exportVachaks, mergeWithManual } from './export.js';
import { VACHAKS } from './config.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const sourceArg = args.find(a => a.startsWith('--source='));
const source = sourceArg ? sourceArg.split('=')[1] : 'all';

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   🕉️  SATSANG MULTI-PLATFORM SCRAPER v1.1');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Mode: ${source.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    const startTime = Date.now();
    let allEvents = [];

    try {
        // ========================================
        // SOURCE 1: YouTube RSS (if enabled)
        // ========================================
        if (source === 'all' || source === 'youtube') {
            console.log('\n📺 SOURCE 1: YouTube RSS Feeds');
            console.log('────────────────────────────────────────────\n');

            try {
                const rawItems = await fetchAllChannels();
                if (rawItems.length > 0) {
                    const events = normalizeEvents(rawItems);
                    allEvents.push(...events);
                    console.log(`   ✓ Got ${events.length} events from YouTube`);
                }
            } catch (err) {
                console.log(`   ⚠️ YouTube failed: ${err.message}`);
            }
        }

        // ========================================
        // SOURCE 2: Official Websites (if enabled)
        // ========================================
        if (source === 'all' || source === 'websites') {
            console.log('\n🌐 SOURCE 2: Official Websites');
            console.log('────────────────────────────────────────────\n');

            try {
                const websiteEvents = await fetchAllWebsites();
                allEvents.push(...websiteEvents);
                console.log(`   ✓ Got ${websiteEvents.length} events from websites`);
            } catch (err) {
                console.log(`   ⚠️ Websites failed: ${err.message}`);
            }
        }

        // ========================================
        // SOURCE 3: Instagram (if enabled)
        // ========================================
        if (source === 'all' || source === 'instagram') {
            console.log('\n📸 SOURCE 3: Instagram Profiles');
            console.log('────────────────────────────────────────────\n');

            try {
                const igEvents = await fetchAllInstagram();
                allEvents.push(...igEvents);
                console.log(`   ✓ Got ${igEvents.length} events from Instagram`);
            } catch (err) {
                console.log(`   ⚠️ Instagram failed: ${err.message}`);
            }
        }

        // ========================================
        // FALLBACK: Manual Events
        // ========================================
        console.log('\n📁 FALLBACK: Manual Events');
        console.log('────────────────────────────────────────────\n');

        const manualPath = join(__dirname, 'data', 'manual.json');

        if (existsSync(manualPath)) {
            try {
                const manualData = JSON.parse(readFileSync(manualPath, 'utf-8'));
                const manualEvents = manualData.events || [];

                // Deduplicate
                const ids = new Set(allEvents.map(e => e.id));
                let added = 0;
                for (const evt of manualEvents) {
                    if (!ids.has(evt.id)) {
                        allEvents.push(evt);
                        added++;
                    }
                }
                console.log(`   ✓ Added ${added} manual events (${manualEvents.length - added} duplicates skipped)`);
            } catch (err) {
                console.log(`   ⚠️ Manual JSON error: ${err.message}`);
            }
        } else {
            console.log('   ℹ️ No manual.json found');
        }

        // ========================================
        // EXPORT
        // ========================================
        console.log('\n💾 EXPORTING TO JSON');
        console.log('────────────────────────────────────────────\n');

        if (allEvents.length === 0) {
            console.log('   ⚠️ No events to export');
        } else {
            exportToJson(allEvents, 'scraped_events.json');
            exportVachaks(VACHAKS, 'vachaks.json');
        }

        // ========================================
        // SUMMARY
        // ========================================
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n═══════════════════════════════════════════════════════════');
        console.log(`   ✅ SCRAPER COMPLETE in ${duration}s`);
        console.log('───────────────────────────────────────────────────────────');
        console.log(`   📊 Total Events: ${allEvents.length}`);
        console.log(`   📺 YouTube:      ${source === 'all' || source === 'youtube' ? 'Attempted' : 'Skipped'}`);
        console.log(`   🌐 Websites:     ${source === 'all' || source === 'websites' ? 'Attempted' : 'Skipped'}`);
        console.log(`   📸 Instagram:    ${source === 'all' || source === 'instagram' ? 'Attempted' : 'Skipped'}`);
        console.log('═══════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ SCRAPER FAILED:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run
main();
