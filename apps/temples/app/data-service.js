const DATA_ROOT = "./data";

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load: ${path}`);
  }
  return response.json();
}

function normalizePath(path) {
  if (!path || typeof path !== "string") return "";
  return path.startsWith("/") ? `.${path}` : `./${path}`;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toSafeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeIndexItem(item) {
  const source = toSafeObject(item);
  return {
    id: toSafeString(source.id),
    name: toSafeString(source.name, "Temple"),
    name_local: toSafeString(source.name_local),
    location: toSafeString(source.location, "India"),
    thumbnail: normalizePath(toSafeString(source.thumbnail)),
    short_desc: toSafeString(source.short_desc),
    category: toSafeString(source.category, "other"),
    order: Number.isFinite(source.order) ? source.order : Number.MAX_SAFE_INTEGER
  };
}

function validateIndex(items) {
  const warnings = [];
  const normalized = [];

  for (const item of toArray(items)) {
    const clean = normalizeIndexItem(item);
    if (!clean.id) {
      warnings.push("Skipped temple with missing id in index.");
      continue;
    }
    if (!clean.thumbnail) {
      warnings.push(`Temple ${clean.id} missing thumbnail path.`);
    }
    normalized.push(clean);
  }

  return { normalized, warnings };
}

function normalizeManifest(value) {
  const manifest = toSafeObject(value);
  const location = toSafeObject(manifest.location);
  const coords = Array.isArray(location.coords) && location.coords.length === 2
    ? location.coords
    : null;

  return {
    ...manifest,
    id: toSafeString(manifest.id),
    name: toSafeString(manifest.name, "Temple"),
    name_local: toSafeString(manifest.name_local),
    description: toSafeString(manifest.description),
    hero_image: normalizePath(toSafeString(manifest.hero_image)),
    location: {
      ...location,
      city: toSafeString(location.city),
      state: toSafeString(location.state),
      access: toSafeString(location.access),
      coords
    },
    stats: toSafeObject(manifest.stats),
    deity: toSafeObject(manifest.deity)
  };
}

function normalizeDeity(value) {
  const deity = toSafeObject(value);
  return {
    ...deity,
    name: toSafeString(deity.name),
    meaning: toSafeString(deity.meaning),
    mythology: toSafeObject(deity.mythology)
  };
}

function normalizeFacts(value) {
  return toArray(value).map((fact) => {
    const item = toSafeObject(fact);
    return {
      id: toSafeString(item.id),
      category: toSafeString(item.category, "Insight"),
      title: toSafeString(item.title, "Untitled"),
      hook: toSafeString(item.hook),
      full_story: toSafeString(item.full_story),
      image: normalizePath(toSafeString(item.image))
    };
  });
}

function normalizeWhyVisit(value) {
  const data = toSafeObject(value);
  const practical = toSafeObject(data.practical_guide);
  return {
    ...data,
    spiritual_invitation: toSafeString(data.spiritual_invitation),
    spiritual_benefits: toArray(data.spiritual_benefits).map((item) => {
      const benefit = toSafeObject(item);
      return {
        blessing: toSafeString(benefit.blessing),
        significance: toSafeString(benefit.significance),
        experience: toSafeString(benefit.experience)
      };
    }),
    practical_guide: {
      ...practical,
      sacred_rituals: toArray(practical.sacred_rituals).filter((item) => typeof item === "string")
    }
  };
}

function normalizeMedia(value) {
  return toArray(value).map((item) => {
    const media = toSafeObject(item);
    return {
      type: toSafeString(media.type, "image"),
      url: normalizePath(toSafeString(media.url)),
      caption: toSafeString(media.caption)
    };
  }).filter((item) => item.url);
}

function validateBundle(bundle) {
  const warnings = [];
  if (!bundle.manifest?.id) warnings.push("Manifest missing id.");
  if (!bundle.manifest?.description) warnings.push("Manifest missing description.");
  if (!bundle.media.length) warnings.push("Media list is empty.");
  if (!bundle.facts.length) warnings.push("Facts list is empty.");
  return warnings;
}

export async function loadTempleIndex() {
  const index = await fetchJson(`${DATA_ROOT}/index.json`);
  const { normalized, warnings } = validateIndex(index);

  return {
    items: normalized
      .slice()
      .sort((a, b) => a.order - b.order),
    warnings
  };
}

export async function loadTempleBundle(templeId) {
  const files = {
    manifest: `${DATA_ROOT}/temples/${templeId}/manifest.json`,
    deity: `${DATA_ROOT}/temples/${templeId}/deity.json`,
    facts: `${DATA_ROOT}/temples/${templeId}/facts.json`,
    whyVisit: `${DATA_ROOT}/temples/${templeId}/why_visit.json`,
    media: `${DATA_ROOT}/temples/${templeId}/media.json`
  };

  const entries = Object.entries(files);
  const results = await Promise.allSettled(entries.map(([, path]) => fetchJson(path)));

  const raw = {};
  const warnings = [];

  entries.forEach(([name, path], index) => {
    const result = results[index];
    if (result.status === "fulfilled") {
      raw[name] = result.value;
    } else {
      raw[name] = null;
      warnings.push(`Missing or invalid file: ${path}`);
    }
  });

  const bundle = {
    manifest: normalizeManifest(raw.manifest),
    deity: normalizeDeity(raw.deity),
    facts: normalizeFacts(raw.facts),
    whyVisit: normalizeWhyVisit(raw.whyVisit),
    media: normalizeMedia(raw.media),
    qualityWarnings: []
  };

  bundle.qualityWarnings = [...warnings, ...validateBundle(bundle)];
  return bundle;
}

export function prefetchTempleBundle(templeId) {
  if (!templeId) return;
  loadTempleBundle(templeId).catch(() => null);
}

export function prefetchImages(urls) {
  toArray(urls)
    .filter((url) => typeof url === "string" && url)
    .forEach((url) => {
      const image = new Image();
      image.decoding = "async";
      image.loading = "eager";
      image.src = url;
    });
}
