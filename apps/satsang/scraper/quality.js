/**
 * Scraper Quality Pipeline
 * - Deduplication
 * - Validation
 * - Confidence scoring
 * - Review bucket split
 */

const DEFAULTS = {
  minConfidence: 65,
  maxFutureDays: 365,
  maxPastDays: 14,
};

export function processEvents(events, options = {}) {
  const cfg = { ...DEFAULTS, ...options };
  const normalized = events.map((event) => enrichEvent(event, cfg));
  const deduped = dedupeEvents(normalized);

  const approved = [];
  const review = [];

  for (const event of deduped) {
    if (event.quality.isValid && event.quality.confidence >= cfg.minConfidence) {
      approved.push(event);
    } else {
      review.push(event);
    }
  }

  return {
    approved,
    review,
    totalInput: events.length,
    totalAfterDedupe: deduped.length,
    stats: summarize(deduped),
  };
}

function enrichEvent(event, cfg) {
  const cloned = structuredClone(event);

  const validation = validateEvent(cloned, cfg);
  const confidence = scoreEvent(cloned, validation);

  cloned.quality = {
    isValid: validation.errors.length === 0,
    confidence,
    errors: validation.errors,
    warnings: validation.warnings,
  };

  cloned.updatedAt = new Date().toISOString();

  return cloned;
}

function validateEvent(event, cfg) {
  const errors = [];
  const warnings = [];

  if (!event.id) errors.push("missing_id");
  if (!event.title || event.title.length < 5) errors.push("missing_or_short_title");
  if (!event.vachakId || event.vachakId === "unknown") errors.push("missing_vachak");
  if (!event.location?.city) warnings.push("missing_city");
  if (!event.dates?.start) errors.push("missing_start_date");

  const start = safeDate(event.dates?.start);
  if (!start) {
    errors.push("invalid_start_date");
  } else {
    const now = new Date();
    const pastDays = dayDiff(start, now);
    const futureDays = dayDiff(now, start);

    if (pastDays > cfg.maxPastDays) warnings.push("event_too_old");
    if (futureDays > cfg.maxFutureDays) warnings.push("event_too_far_future");
  }

  if (!event.link) warnings.push("missing_link");
  if (event.source === "instagram") warnings.push("instagram_unstable_source");

  return { errors, warnings };
}

function scoreEvent(event, validation) {
  let score = 100;

  score -= validation.errors.length * 30;
  score -= validation.warnings.length * 8;

  if (event.source === "youtube") score += 6;
  if (event.source === "website") score += 4;
  if (event.source === "instagram") score -= 8;

  if (event.features?.isLive) score += 4;
  if (event.features?.hasLiveStream) score += 3;
  if (event.location?.city && event.location?.city !== "online") score += 2;

  return Math.max(0, Math.min(100, score));
}

function dedupeEvents(events) {
  const seen = new Set();
  const out = [];

  for (const event of events) {
    const key = dedupeKey(event);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(event);
  }

  return out;
}

function dedupeKey(event) {
  const title = String(event.title || "").toLowerCase().replace(/\s+/g, " ").trim();
  const date = event.dates?.start || "";
  const vachak = event.vachakId || "";
  const link = event.link || "";

  if (link.includes("youtube.com/watch?v=")) return `yt:${extractVideoId(link)}`;
  return `${vachak}|${title}|${date}`;
}

function extractVideoId(link) {
  const match = link.match(/[?&]v=([a-zA-Z0-9_-]{8,})/);
  return match ? match[1] : link;
}

function summarize(events) {
  const bySource = {};
  const byVachak = {};

  for (const event of events) {
    bySource[event.source] = (bySource[event.source] || 0) + 1;
    byVachak[event.vachakId] = (byVachak[event.vachakId] || 0) + 1;
  }

  return { bySource, byVachak };
}

function safeDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function dayDiff(a, b) {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}
