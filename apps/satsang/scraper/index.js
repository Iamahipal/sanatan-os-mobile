/**
 * Satsang Scraper CLI v2
 * Usage:
 *   npm run scrape
 *   npm run scrape:youtube
 *   npm run scrape:websites
 *   npm run scrape:instagram
 *   npm run scrape:twitter
 *   npm run scrape:facebook
 *   node index.js --source=all --min-confidence=70
 */

import { fetchAllChannels } from './sources/youtube.js';
import { fetchAllWebsites } from './sources/websites.js';
import { fetchAllInstagram } from './sources/instagram.js';
import { fetchAllTwitter } from './sources/twitter.js';
import { fetchAllFacebook } from './sources/facebook.js';
import { normalizeEvents } from './normalizer.js';
import { processEvents } from './quality.js';
import {
  exportToJson,
  exportReviewQueue,
  exportReport,
  exportVachaks,
} from './export.js';
import { VACHAKS } from './config.js';

const args = process.argv.slice(2);
const source = getArg('source', 'all');
const minConfidence = Number(getArg('min-confidence', '65'));
const dryRun = hasFlag('dry-run');

async function main() {
  const startedAt = Date.now();
  let rawEvents = [];

  console.log('='.repeat(72));
  console.log('SATSANG SCRAPER CLI v2');
  console.log(`source=${source} minConfidence=${minConfidence} dryRun=${dryRun}`);
  console.log('='.repeat(72));

  try {
    if (source === 'all' || source === 'youtube') {
      const items = await fetchAllChannels();
      const events = normalizeEvents(items);
      rawEvents.push(...events);
      console.log(`YouTube normalized: ${events.length}`);
    }

    if (source === 'all' || source === 'websites') {
      const events = await fetchAllWebsites();
      rawEvents.push(...events);
      console.log(`Websites raw: ${events.length}`);
    }

    if (source === 'all' || source === 'instagram') {
      const events = await fetchAllInstagram();
      rawEvents.push(...events);
      console.log(`Instagram raw: ${events.length}`);
    }

    if (source === 'all' || source === 'twitter') {
      const events = await fetchAllTwitter();
      rawEvents.push(...events);
      console.log(`Twitter raw: ${events.length}`);
    }

    if (source === 'all' || source === 'facebook') {
      const events = await fetchAllFacebook();
      rawEvents.push(...events);
      console.log(`Facebook raw: ${events.length}`);
    }

    const processed = processEvents(rawEvents, { minConfidence });

    const report = {
      generatedAt: new Date().toISOString(),
      input: {
        source,
        minConfidence,
        dryRun,
        rawEvents: processed.totalInput,
        afterDedupe: processed.totalAfterDedupe,
      },
      output: {
        approved: processed.approved.length,
        review: processed.review.length,
      },
      stats: processed.stats,
      durationMs: Date.now() - startedAt,
    };

    if (!dryRun) {
      exportToJson(processed.approved, 'scraped_events.json');
      exportReviewQueue(processed.review, 'scraped_events_review.json');
      exportReport(report, 'scrape_report.json');
      exportVachaks(VACHAKS, 'vachaks_scraped_seed.json');
    }

    printSummary(report);
  } catch (error) {
    console.error('Scraper failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function getArg(name, fallback) {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function printSummary(report) {
  console.log('\n' + '='.repeat(72));
  console.log('SCRAPE SUMMARY');
  console.log('='.repeat(72));
  console.log(`raw: ${report.input.rawEvents}`);
  console.log(`after dedupe: ${report.input.afterDedupe}`);
  console.log(`approved: ${report.output.approved}`);
  console.log(`review: ${report.output.review}`);
  console.log(`duration: ${(report.durationMs / 1000).toFixed(2)}s`);

  console.log('\nBy source:');
  for (const [key, value] of Object.entries(report.stats.bySource || {})) {
    console.log(`  - ${key}: ${value}`);
  }

  console.log('\nBy vachak:');
  for (const [key, value] of Object.entries(report.stats.byVachak || {})) {
    console.log(`  - ${key}: ${value}`);
  }

  console.log('\nOutputs:');
  console.log('  - js/data/scraped_events.json');
  console.log('  - js/data/scraped_events_review.json');
  console.log('  - js/data/scrape_report.json');
  console.log('  - js/data/vachaks_scraped_seed.json');
}

main();
