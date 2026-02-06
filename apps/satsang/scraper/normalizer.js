/**
 * Satsang Scraper - Data Normalizer
 * Converts raw source items into event schema with better signal quality.
 */

import { EVENT_TYPE_KEYWORDS, CITY_KEYWORDS } from './config.js';

const MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Normalize raw items to Event schema.
 */
export function normalizeEvents(rawItems) {
  return rawItems.map((item) => normalizeItem(item)).filter(Boolean);
}

function normalizeItem(item) {
  try {
    const videoId = extractVideoId(item);
    if (videoId === 'unknown') return null;

    const title = String(item.title || 'Untitled').trim();
    const description = String(item.contentSnippet || item.content || '').trim();
    const text = `${title} ${description}`;

    const publishedDate = item.isoDate ? new Date(item.isoDate) : new Date();
    const eventDate = extractEventDate(text) || publishedDate;

    const eventType = detectEventType(text);
    if (eventType.type === 'other') {
      return null;
    }
    if (!isReligiousProgram(text, eventType.type)) {
      return null;
    }
    const city = detectCity(text);
    const liveSignal = detectLiveSignal(title, description, item, eventDate);
    const cleanedTitle = cleanTitle(title);
    const finalTitle =
      cleanedTitle && cleanedTitle.length >= 5
        ? cleanedTitle
        : buildFallbackTitle(eventType.name, item.vachak?.shortName, eventDate, liveSignal);

    return {
      id: `yt-${videoId}`,
      type: eventType.type,
      typeName: eventType.name,
      title: finalTitle,
      verifiedSource: Boolean(item.vachak?.verified),
      vachakId: item.vachak?.id || 'unknown',
      location: {
        city: city.id,
        cityName: city.name,
        venue: city.id === 'online' ? 'YouTube Live' : 'See official details',
      },
      dates: {
        start: formatDate(eventDate),
        end: formatDate(eventDate),
        duration: 1,
        timing: liveSignal ? 'Live / Scheduled Live' : 'See YouTube details',
      },
      features: {
        isLive: liveSignal,
        isFree: true,
        hasLiveStream: true,
        hasPrasad: false,
        hasAccommodation: false,
      },
      source: 'youtube',
      link: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail:
        item.mediaGroup?.['media:thumbnail']?.[0]?.['$']?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: publishedDate.toISOString(),
      rawSignals: {
        usedPublishedDate: !extractEventDate(text),
        cityDetected: city.id,
        typeDetected: eventType.type,
        liveSignal,
      },
    };
  } catch (error) {
    console.warn(`normalize failed: ${error.message}`);
    return null;
  }
}

function extractVideoId(item) {
  if (item.videoId) return item.videoId;
  if (item.id) {
    const match = String(item.id).match(/yt:video:([^\s]+)/);
    if (match) return match[1];
  }
  if (item.link) {
    const match = String(item.link).match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
  }
  return 'unknown';
}

function isReligiousProgram(text, detectedType) {
  const lower = text.toLowerCase();

  // Strong positive signals (word-boundary oriented).
  const positivePatterns = [
    /\bram\s*katha\b/,
    /\bbhagwat\b/,
    /\bbhagavat\b/,
    /\bshrimad\b/,
    /\bsatsang\b/,
    /\bpravachan\b/,
    /\bbhajan\b/,
    /\bkirtan\b/,
    /\bdarbar\b/,
    /\bmahapuran\b/,
    /\bshivpuran\b/,
    /\bhanuman\s*katha\b/,
    /\bhanumat\s*katha\b/,
    /\bkatha\b/,
  ];
  const hasPrimary = positivePatterns.some((rx) => rx.test(lower));

  // Exclude generic uploads that are usually not event listings.
  const negativeKeywords = [
    'shorts', '#shorts', 'reaction', 'trailer', 'teaser', 'vlog',
    'podcast', 'interview', 'news', 'breaking', 'debate', 'comedy',
    'gaming', 'movie', 'song promo', 'kathak'
  ];
  const hasNegative = negativeKeywords.some((kw) => lower.includes(kw));

  if (hasNegative) return false;
  if (detectedType !== 'other') return true;
  return hasPrimary;
}

function detectEventType(text) {
  const lowerText = text.toLowerCase();

  for (const [type, keywords] of Object.entries(EVENT_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return { type, name: getTypeName(type) };
      }
    }
  }

  return { type: 'other', name: 'Satsang' };
}

function getTypeName(type) {
  const names = {
    bhagwat: 'Shrimad Bhagwat Katha',
    ramkatha: 'Ram Katha',
    kirtan: 'Kirtan',
    darbar: 'Divya Darbar',
    shivpuran: 'Shiv Mahapuran',
    concert: 'Live Concert',
    other: 'Satsang',
  };
  return names[type] || names.other;
}

function detectCity(text) {
  const lowerText = text.toLowerCase();

  for (const [cityId, keywords] of Object.entries(CITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return { id: cityId, name: getCityName(cityId) };
      }
    }
  }

  return { id: 'online', name: 'Online Streaming' };
}

function getCityName(cityId) {
  const names = {
    vrindavan: 'Vrindavan, UP',
    mathura: 'Mathura, UP',
    mumbai: 'Mumbai, MH',
    delhi: 'New Delhi',
    ayodhya: 'Ayodhya, UP',
    varanasi: 'Varanasi, UP',
    haridwar: 'Haridwar, UK',
    prayagraj: 'Prayagraj, UP',
    chitrakoot: 'Chitrakoot, MP',
    online: 'Online Streaming',
  };
  return names[cityId] || 'India';
}

function cleanTitle(title) {
  return title
    .replace(/\s*[|\-]\s*[^|]+$/, '')
    .replace(/\bLIVE\b\s*:?\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildFallbackTitle(typeName, vachakShortName, eventDate, liveSignal) {
  const label = typeName || 'Satsang';
  const by = vachakShortName ? ` with ${vachakShortName}` : '';
  const date = eventDate ? ` · ${eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : '';
  const live = liveSignal ? 'Live ' : '';
  return `${live}${label}${by}${date}`.trim();
}

function detectLiveSignal(title, description, item, eventDate) {
  const text = `${title} ${description}`.toLowerCase();
  const hasLiveKeyword = /\b(live|livestream|streaming|going live|watch live)\b/.test(text);
  const hasUpcomingKeyword = /\b(upcoming|premiere|scheduled)\b/.test(text);
  const publishRecent = item.isoDate ? isWithinDays(new Date(item.isoDate), 1) : false;
  const eventSoon = eventDate ? isWithinDays(eventDate, 1) : false;
  const eventNotOld = eventDate ? !isOlderThanDays(eventDate, 1) : false;

  if (!eventNotOld) return false;
  if (hasLiveKeyword && (publishRecent || eventSoon)) return true;
  if (hasUpcomingKeyword && eventSoon) return true;
  return false;
}

function extractEventDate(text) {
  const now = new Date();

  // dd/mm/yyyy or dd-mm-yy
  const numeric = text.match(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/);
  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]) - 1;
    let year = numeric[3] ? Number(numeric[3]) : now.getFullYear();
    if (year < 100) year += 2000;
    const dt = new Date(year, month, day);
    if (!Number.isNaN(dt.getTime())) return dt;
  }

  // 12 Jan 2026
  const alpha = text.match(/\b(\d{1,2})\s+([A-Za-z]{3,9})(?:\s+(\d{4}))?\b/);
  if (alpha) {
    const day = Number(alpha[1]);
    const month = MONTHS[alpha[2].toLowerCase()];
    if (month !== undefined) {
      const year = alpha[3] ? Number(alpha[3]) : now.getFullYear();
      const dt = new Date(year, month, day);
      if (!Number.isNaN(dt.getTime())) return dt;
    }
  }

  return null;
}

function isWithinDays(date, days) {
  const now = new Date();
  return Math.abs(now.getTime() - date.getTime()) <= days * 86400000;
}

function isOlderThanDays(date, days) {
  const now = new Date();
  return now.getTime() - date.getTime() > days * 86400000;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}
