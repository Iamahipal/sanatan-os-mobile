/**
 * Satsang Scraper - Export Module
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getOutputDir() {
  const outputDir = join(__dirname, '..', 'js', 'data');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

export function exportToJson(events, filename = 'scraped_events.json') {
  const outputPath = join(getOutputDir(), filename);

  const sorted = [...events].sort((a, b) => {
    const ad = new Date(a.dates?.start || a.publishedAt || 0).getTime();
    const bd = new Date(b.dates?.start || b.publishedAt || 0).getTime();
    return ad - bd;
  });

  writeFileSync(outputPath, JSON.stringify(sorted, null, 2));
  console.log(`Exported ${events.length} events -> ${outputPath}`);
  return outputPath;
}

export function exportReviewQueue(events, filename = 'scraped_events_review.json') {
  const outputPath = join(getOutputDir(), filename);
  writeFileSync(outputPath, JSON.stringify(events, null, 2));
  console.log(`Review queue ${events.length} events -> ${outputPath}`);
  return outputPath;
}

export function exportReport(report, filename = 'scrape_report.json') {
  const outputPath = join(getOutputDir(), filename);
  writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Report -> ${outputPath}`);
  return outputPath;
}

export function mergeWithManual(scrapedEvents, manualPath) {
  try {
    const manualData = JSON.parse(readFileSync(manualPath, 'utf-8'));
    const manualEvents = Array.isArray(manualData) ? manualData : (manualData.events || []);

    const ids = new Set(scrapedEvents.map((e) => e.id));
    const merged = [...scrapedEvents];

    for (const event of manualEvents) {
      if (!ids.has(event.id)) {
        merged.push(event);
      }
    }

    console.log(`Merged scraped(${scrapedEvents.length}) + manual(${manualEvents.length}) = ${merged.length}`);
    return merged;
  } catch (error) {
    console.warn(`Manual merge skipped: ${error.message}`);
    return scrapedEvents;
  }
}

export function exportVachaks(vachaks, filename = 'vachaks_scraped_seed.json') {
  const outputPath = join(getOutputDir(), filename);

  const enhanced = vachaks.map((v) => ({
    id: v.id,
    name: v.name,
    shortName: v.shortName,
    specialty: v.specialty,
    emoji: v.emoji,
    verified: true,
    socials: {
      youtube: v.handle ? `https://www.youtube.com/@${v.handle}` : null,
    },
  }));

  writeFileSync(outputPath, JSON.stringify(enhanced, null, 2));
  console.log(`Vachak seed exported ${enhanced.length} -> ${outputPath}`);
  return outputPath;
}
