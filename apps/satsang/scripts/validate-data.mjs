import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DATA_FILE = resolve(process.cwd(), "js/data/scraped_events.json");

function main() {
  const raw = readFileSync(DATA_FILE, "utf-8");
  const events = JSON.parse(raw);

  const issues = [];
  const seen = new Set();
  const now = Date.now();

  for (const event of events) {
    const id = event?.id || "(missing-id)";
    const start = safeDate(event?.dates?.start);
    const end = safeDate(event?.dates?.end || event?.dates?.start);
    const title = String(event?.title || "").trim();
    const city = String(event?.location?.cityName || event?.location?.city || "").trim();
    const vachak = String(event?.vachakId || "").trim();
    const liveSignal = Boolean(event?.features?.isLive);

    if (!title) issues.push(`${id}: missing title`);
    if (!city) issues.push(`${id}: missing city`);
    if (!vachak) issues.push(`${id}: missing vachakId`);
    if (!start) issues.push(`${id}: invalid start date`);
    if (!end) issues.push(`${id}: invalid end date`);

    if (seen.has(id)) {
      issues.push(`${id}: duplicate id`);
    }
    seen.add(id);

    if (start && end) {
      const endOfEvent = new Date(end).setHours(23, 59, 59, 999);
      if (liveSignal && endOfEvent < now) {
        issues.push(`${id}: marked live but event is in past`);
      }
    }
  }

  if (issues.length) {
    console.error(`Data validation failed (${issues.length} issue(s)):`);
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log(`Data validation passed (${events.length} events checked).`);
}

function safeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

main();
