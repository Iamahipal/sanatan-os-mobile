import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = join(__dirname, "..", ".cache", "official-identity-cache.json");

export function readIdentityCache() {
  try {
    if (!existsSync(CACHE_PATH)) return { twitter: {}, facebook: {} };
    const parsed = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
    return {
      twitter: parsed.twitter || {},
      facebook: parsed.facebook || {},
    };
  } catch {
    return { twitter: {}, facebook: {} };
  }
}

export function writeIdentityCache(cache) {
  const dir = dirname(CACHE_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export function upsertTwitterIdentity(cache, handle, record) {
  cache.twitter ||= {};
  cache.twitter[handle] = {
    ...cache.twitter[handle],
    ...record,
    checkedAt: new Date().toISOString(),
  };
}

export function upsertFacebookIdentity(cache, page, record) {
  cache.facebook ||= {};
  cache.facebook[page] = {
    ...cache.facebook[page],
    ...record,
    checkedAt: new Date().toISOString(),
  };
}
