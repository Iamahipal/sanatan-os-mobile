/**
 * Satsang Scraper - Export Module
 * Writes events to JSON file and optional Firestore
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Export events to JSON file
 * @param {Array} events - Normalized events
 * @param {string} filename - Output filename
 */
export function exportToJson(events, filename = 'scraped_events.json') {
    const outputDir = join(__dirname, '..', 'js', 'data');
    const outputPath = join(outputDir, filename);

    // Ensure directory exists
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    // Sort by publish date (newest first)
    const sorted = events.sort((a, b) =>
        new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // Write file
    writeFileSync(outputPath, JSON.stringify(sorted, null, 2));
    console.log(`\n📁 Exported ${events.length} events to: ${outputPath}`);

    return outputPath;
}

/**
 * Merge scraped events with manual events
 * @param {Array} scrapedEvents - Events from scraper
 * @param {string} manualPath - Path to manual events JSON
 * @returns {Array} Merged events
 */
export function mergeWithManual(scrapedEvents, manualPath) {
    try {
        const manualData = JSON.parse(readFileSync(manualPath, 'utf-8'));
        const manualEvents = manualData.events || manualData || [];

        // Create ID set for deduplication
        const ids = new Set(scrapedEvents.map(e => e.id));

        // Add manual events that don't conflict
        const merged = [...scrapedEvents];
        for (const event of manualEvents) {
            if (!ids.has(event.id)) {
                merged.push(event);
            }
        }

        console.log(`🔀 Merged: ${scrapedEvents.length} scraped + ${manualEvents.length} manual = ${merged.length} total`);
        return merged;
    } catch (error) {
        console.warn(`⚠️ No manual events found: ${error.message}`);
        return scrapedEvents;
    }
}

/**
 * Generate vachaks data from config
 */
export function exportVachaks(vachaks, filename = 'vachaks.json') {
    const outputDir = join(__dirname, '..', 'js', 'data');
    const outputPath = join(outputDir, filename);

    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    // Enhance vachak data
    const enhanced = vachaks.map(v => ({
        id: v.id,
        name: v.name,
        shortName: v.shortName,
        emoji: v.emoji,
        image: null, // Add manually
        specialty: v.specialty,
        bio: `Renowned spiritual leader specializing in ${v.specialty}.`,
        followers: 0,
        eventsCount: 0,
        socials: {
            youtube: `https://www.youtube.com/channel/${v.channelId}`
        },
        verified: true
    }));

    writeFileSync(outputPath, JSON.stringify(enhanced, null, 2));
    console.log(`📁 Exported ${vachaks.length} vachaks to: ${outputPath}`);

    return outputPath;
}
