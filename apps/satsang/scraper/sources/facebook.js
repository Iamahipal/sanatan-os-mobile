/**
 * Facebook Source
 * Uses official pages + Meta Graph API token.
 *
 * Env:
 * - FB_GRAPH_TOKEN=<token>
 */

import { OFFICIAL_FACEBOOK_PAGES } from "../config.js";
import { parseSocialPostToEvent } from "./social-common.js";
import {
  readIdentityCache,
  writeIdentityCache,
  upsertFacebookIdentity,
} from "./identity-cache.js";

const API = "https://graph.facebook.com/v20.0";

export async function fetchAllFacebook() {
  const token = process.env.FB_GRAPH_TOKEN;
  const strictIdentity = process.env.SOCIAL_STRICT_IDENTITY === "1";
  if (!token) {
    console.log("Skipping Facebook source: FB_GRAPH_TOKEN not set.");
    return [];
  }

  const identityCache = readIdentityCache();
  const events = [];
  console.log(`Fetching Facebook posts from official pages... strictIdentity=${strictIdentity}`);

  for (const page of OFFICIAL_FACEBOOK_PAGES) {
    try {
      const pageMeta = await resolveFacebookPage(page.page, token);
      const idMatch = page.expectedPageId ? pageMeta.id === String(page.expectedPageId) : null;
      upsertFacebookIdentity(identityCache, page.page, {
        resolvedPageId: pageMeta.id,
        resolvedName: pageMeta.name || null,
        resolvedUsername: pageMeta.username || null,
        expectedPageId: page.expectedPageId || null,
        matched: idMatch,
      });

      if (strictIdentity && !page.expectedPageId) {
        throw new Error("missing expectedPageId in config");
      }
      if (strictIdentity && idMatch !== true) {
        throw new Error(`identity mismatch expected=${page.expectedPageId} got=${pageMeta.id}`);
      }

      const posts = await fetchRecentPosts(page.page, token);
      let accepted = 0;
      for (const post of posts) {
        const event = parseSocialPostToEvent({
          idPrefix: "fb",
          postId: post.id,
          text: post.message || "",
          link: post.permalink_url || `https://www.facebook.com/${page.page}`,
          vachakId: page.vachakId,
          source: "facebook",
          publishedAt: post.created_time,
        });
        if (event) {
          events.push(event);
          accepted += 1;
        }
      }
      console.log(`OK ${page.page}: ${accepted} candidate events`);
    } catch (error) {
      console.error(`FAIL ${page.page}: ${error.message}`);
    }
  }

  writeIdentityCache(identityCache);
  console.log(`Facebook total events: ${events.length}`);
  return events;
}

async function resolveFacebookPage(page, token) {
  const fields = encodeURIComponent("id,name,username");
  const url = `${API}/${encodeURIComponent(page)}?fields=${fields}&access_token=${encodeURIComponent(token)}`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    throw new Error(`Graph page resolve HTTP ${response.status}`);
  }
  const json = await response.json();
  if (!json.id) throw new Error("Graph page resolve: no id");
  return json;
}

async function fetchRecentPosts(page, token) {
  const fields = encodeURIComponent("id,message,created_time,permalink_url");
  const url = `${API}/${encodeURIComponent(page)}/posts?fields=${fields}&limit=10&access_token=${encodeURIComponent(token)}`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    throw new Error(`Graph API HTTP ${response.status}`);
  }
  const json = await response.json();
  return json.data || [];
}
