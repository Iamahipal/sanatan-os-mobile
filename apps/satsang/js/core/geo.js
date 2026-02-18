// Lightweight geo helpers used for "Near me" filtering.
// Note: event locations are typically city-level; distance is approximate.

export const CITY_COORDS = {
  delhi: { lat: 28.6139, lon: 77.209 },
  "new-delhi": { lat: 28.6139, lon: 77.209 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  pune: { lat: 18.5204, lon: 73.8567 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  lucknow: { lat: 26.8467, lon: 80.9462 },
  indore: { lat: 22.7196, lon: 75.8577 },
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  surat: { lat: 21.1702, lon: 72.8311 },
  kanpur: { lat: 26.4499, lon: 80.3319 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  prayagraj: { lat: 25.4358, lon: 81.8463 },
  vrindavan: { lat: 27.58, lon: 77.7 },
  mathura: { lat: 27.4924, lon: 77.6737 },
  haridwar: { lat: 29.9457, lon: 78.1642 },
  rishikesh: { lat: 30.0869, lon: 78.2676 },
  ayodhya: { lat: 26.799, lon: 82.204 },
  ujjain: { lat: 23.1765, lon: 75.7885 },
};

export function getCityCoords(citySlug, cityName = "") {
  const slug = String(citySlug || "").toLowerCase();
  if (CITY_COORDS[slug]) return CITY_COORDS[slug];
  const nameKey = String(cityName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return CITY_COORDS[nameKey] || null;
}

// Haversine distance in KM between two lat/lon points.
export function haversineKm(a, b) {
  if (!a || !b) return Number.NaN;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sin1 = Math.sin(dLat / 2);
  const sin2 = Math.sin(dLon / 2);
  const h = sin1 * sin1 + Math.cos(lat1) * Math.cos(lat2) * sin2 * sin2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

