/**
 * Shared social text parser (X / Facebook / Instagram-like posts)
 * Produces approximate event objects with strict keyword/date gating.
 */

const EVENT_KEYWORDS = [
  "katha",
  "satsang",
  "pravachan",
  "bhagwat",
  "ram katha",
  "darbar",
  "shiv",
  "mahapuran",
  "bhajan",
  "kirtan",
];

const CITY_HINTS = [
  "vrindavan",
  "mathura",
  "delhi",
  "mumbai",
  "ayodhya",
  "varanasi",
  "haridwar",
  "prayagraj",
  "chitrakoot",
];

export function parseSocialPostToEvent({
  idPrefix,
  postId,
  text,
  link,
  vachakId,
  fallbackType = "other",
  fallbackTypeName = "Satsang",
  source,
  publishedAt,
}) {
  const body = String(text || "").trim();
  if (!body || body.length < 20) return null;

  const lower = body.toLowerCase();
  const hasSignal = EVENT_KEYWORDS.some((k) => lower.includes(k));
  const parsedDate = extractDate(body);
  if (!hasSignal && !parsedDate) return null;

  const cityId = detectCity(lower);
  const cityName = cityId === "online" ? "Online" : toTitle(cityId);
  const type = detectType(lower, fallbackType);
  const typeName = type === "other" ? fallbackTypeName : toTypeName(type);
  const eventDate = parsedDate || parseDateSafe(publishedAt) || new Date();
  const dateText = formatDate(eventDate);
  const liveFlag = /\b(live|going live|watch live)\b/.test(lower) && isNearDate(eventDate, 1);

  return {
    id: `${idPrefix}-${postId}`,
    type,
    typeName,
    title: cleanTitle(body),
    vachakId,
    location: {
      city: cityId,
      cityName,
      venue: "See official social page",
    },
    dates: {
      start: dateText,
      end: dateText,
      duration: 1,
      timing: "See official social page",
    },
    features: {
      isLive: liveFlag,
      isFree: true,
      hasLiveStream: true,
      hasPrasad: false,
      hasAccommodation: false,
    },
    source,
    link,
    publishedAt: parseDateSafe(publishedAt)?.toISOString() || new Date().toISOString(),
    rawText: body.slice(0, 240),
  };
}

function extractDate(text) {
  const now = new Date();
  const numeric = text.match(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/);
  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]) - 1;
    let year = numeric[3] ? Number(numeric[3]) : now.getFullYear();
    if (year < 100) year += 2000;
    const d = new Date(year, month, day);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function detectType(text, fallback) {
  if (text.includes("ram")) return "ramkatha";
  if (text.includes("bhagwat") || text.includes("bhagavat")) return "bhagwat";
  if (text.includes("shiv")) return "shivpuran";
  if (text.includes("darbar")) return "darbar";
  if (text.includes("bhajan") || text.includes("kirtan")) return "kirtan";
  return fallback || "other";
}

function toTypeName(type) {
  const map = {
    bhagwat: "Shrimad Bhagwat Katha",
    ramkatha: "Ram Katha",
    shivpuran: "Shiv Mahapuran",
    darbar: "Divya Darbar",
    kirtan: "Kirtan",
    other: "Satsang",
  };
  return map[type] || "Satsang";
}

function detectCity(text) {
  for (const city of CITY_HINTS) {
    if (text.includes(city)) return city;
  }
  return "online";
}

function cleanTitle(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[|]+/g, " | ")
    .trim()
    .slice(0, 120);
}

function parseDateSafe(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function isNearDate(date, days) {
  const now = new Date();
  return Math.abs(now.getTime() - date.getTime()) <= days * 86400000;
}

function toTitle(value) {
  return String(value)
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
