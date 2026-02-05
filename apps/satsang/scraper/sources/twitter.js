/**
 * X (Twitter) Source
 * Uses official handles + X API bearer token.
 *
 * Env:
 * - X_BEARER_TOKEN=<token>
 */

import { OFFICIAL_X_HANDLES } from "../config.js";
import { parseSocialPostToEvent } from "./social-common.js";
import {
  readIdentityCache,
  writeIdentityCache,
  upsertTwitterIdentity,
} from "./identity-cache.js";

const API = "https://api.twitter.com/2";
const MAX_RESULTS = 10;

export async function fetchAllTwitter() {
  const token = process.env.X_BEARER_TOKEN;
  const strictIdentity = process.env.SOCIAL_STRICT_IDENTITY === "1";
  if (!token) {
    console.log("Skipping X source: X_BEARER_TOKEN not set.");
    return [];
  }

  const identityCache = readIdentityCache();
  const events = [];
  console.log(`Fetching X posts from official handles... strictIdentity=${strictIdentity}`);

  for (const entry of OFFICIAL_X_HANDLES) {
    try {
      const profile = await resolveXUser(entry.handle, token);
      const idMatch = entry.expectedUserId ? profile.id === String(entry.expectedUserId) : null;
      upsertTwitterIdentity(identityCache, entry.handle, {
        resolvedUserId: profile.id,
        resolvedUsername: profile.username,
        resolvedName: profile.name,
        expectedUserId: entry.expectedUserId || null,
        matched: idMatch,
      });

      if (strictIdentity && !entry.expectedUserId) {
        throw new Error("missing expectedUserId in config");
      }
      if (strictIdentity && idMatch !== true) {
        throw new Error(`identity mismatch expected=${entry.expectedUserId} got=${profile.id}`);
      }

      const tweets = await fetchRecentTweets(entry.handle, token);
      let accepted = 0;

      for (const tweet of tweets) {
        const event = parseSocialPostToEvent({
          idPrefix: "x",
          postId: tweet.id,
          text: tweet.text,
          link: `https://x.com/${entry.handle}/status/${tweet.id}`,
          vachakId: entry.vachakId,
          source: "twitter",
          publishedAt: tweet.created_at,
        });
        if (event) {
          events.push(event);
          accepted += 1;
        }
      }
      console.log(`OK @${entry.handle}: ${accepted} candidate events`);
    } catch (error) {
      console.error(`FAIL @${entry.handle}: ${error.message}`);
    }
  }

  writeIdentityCache(identityCache);
  console.log(`X total events: ${events.length}`);
  return events;
}

async function resolveXUser(handle, token) {
  const url = `${API}/users/by/username/${encodeURIComponent(handle)}?user.fields=id,username,name,verified`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`X user resolve HTTP ${response.status}`);
  const json = await response.json();
  if (!json.data?.id) throw new Error("X user resolve: no user data");
  return json.data;
}

async function fetchRecentTweets(handle, token) {
  const query = encodeURIComponent(`from:${handle} -is:retweet`);
  const url = `${API}/tweets/search/recent?query=${query}&max_results=${MAX_RESULTS}&tweet.fields=created_at`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`X API HTTP ${response.status}`);
  }

  const json = await response.json();
  return json.data || [];
}
