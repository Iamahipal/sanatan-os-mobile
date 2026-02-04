const DATA_ROOT = "./data";

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load: ${path}`);
  }
  return response.json();
}

function normalizePath(path) {
  if (!path) return "";
  return path.startsWith("/") ? `.${path}` : `./${path}`;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export function formatImage(path, fallback = "") {
  return path ? normalizePath(path) : fallback;
}

export async function loadTempleIndex() {
  const index = await fetchJson(`${DATA_ROOT}/index.json`);
  return toArray(index)
    .slice()
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    .map((item) => ({
      ...item,
      thumbnail: normalizePath(item.thumbnail),
    }));
}

export async function loadTempleBundle(templeId) {
  const files = {
    manifest: `${DATA_ROOT}/temples/${templeId}/manifest.json`,
    deity: `${DATA_ROOT}/temples/${templeId}/deity.json`,
    facts: `${DATA_ROOT}/temples/${templeId}/facts.json`,
    whyVisit: `${DATA_ROOT}/temples/${templeId}/why_visit.json`,
    media: `${DATA_ROOT}/temples/${templeId}/media.json`,
  };

  const entries = Object.entries(files);
  const results = await Promise.allSettled(entries.map(([, path]) => fetchJson(path)));

  const bundle = {};
  entries.forEach(([name], index) => {
    const result = results[index];
    bundle[name] = result.status === "fulfilled" ? result.value : null;
  });

  bundle.facts = toArray(bundle.facts);
  bundle.media = toArray(bundle.media).map((item) => ({
    ...item,
    url: normalizePath(item.url),
  }));

  if (bundle.manifest?.hero_image) {
    bundle.manifest.hero_image = normalizePath(bundle.manifest.hero_image);
  }

  return bundle;
}
