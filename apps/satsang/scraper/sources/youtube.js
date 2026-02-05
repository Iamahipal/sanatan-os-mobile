/**
 * YouTube RSS Source
 * - Uses verified channel ID map
 * - Falls back to resolving channelId from @handle page HTML
 */

import Parser from 'rss-parser';
import { VACHAKS } from '../config.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'mediaGroup'],
      ['yt:videoId', 'videoId'],
      ['yt:channelId', 'channelId'],
    ],
  },
});
const FEED_TIMEOUT_MS = 25000;
const HANDLE_TIMEOUT_MS = 8000;

const VERIFIED_CHANNEL_IDS = {
  rajendradas: 'UCXly_daYmaRFjYFIb_lfsiA',
  pundrik: 'UCB5X11vjfDvgvEcgm26y1Vg',
  morari: 'UCnePvOdQ-uBSWSIgRoG55gA',
  jayakishori: 'UCCR5eciEJIMvX2o1tiYOUKQ',
  premanand: 'UC_fmMgNql89jbFI8TNcq9Vg',
  bageshwar: 'UC6WcxjGtzDxtdWvWWj3aM5w',
  pradeepmishra: 'UCiWB2Ucdmkj4GqmWMrka1RA',
  indresh: 'UC03aV1e7XdXm2Za_K856duQ',
};

const resolvedCache = new Map();

export async function fetchAllChannels() {
  const allItems = [];
  const maxConcurrent = 3;
  const activeVachaks = VACHAKS.filter((v) => !v.disabled);
  const skipped = VACHAKS.filter((v) => v.disabled);

  console.log('Fetching YouTube RSS feeds...');
  if (skipped.length) {
    console.log(`Skipping ${skipped.length} disabled channels: ${skipped.map((v) => v.shortName).join(', ')}`);
  }

  await runWithConcurrency(activeVachaks, maxConcurrent, async (vachak) => {
    try {
      const items = await fetchChannel(vachak);
      allItems.push(...items);
      console.log(`OK ${vachak.shortName}: ${items.length}`);
    } catch (error) {
      console.error(`FAIL ${vachak.shortName}: ${error.message}`);
    }
  });

  console.log(`YouTube total items: ${allItems.length}`);
  return allItems;
}

export async function fetchChannel(vachak) {
  const candidates = await resolveChannelCandidates(vachak);
  const fallbackFeedUrls = vachak.handle
    ? [
        `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(vachak.handle)}`,
        `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(vachak.handle.toLowerCase())}`,
      ]
    : [];

  let lastError = null;
  for (const channelId of candidates) {
    try {
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const feed = await parseFeedWithTimeout(feedUrl);

      resolvedCache.set(vachak.id, channelId);
      return (feed.items || []).map((item) => ({
        ...item,
        vachak: {
          id: vachak.id,
          name: vachak.name,
          shortName: vachak.shortName,
          specialty: vachak.specialty,
          emoji: vachak.emoji,
        },
      }));
    } catch (err) {
      lastError = err;
    }
  }

  for (const feedUrl of fallbackFeedUrls) {
    try {
      const feed = await parseFeedWithTimeout(feedUrl);
      return (feed.items || []).map((item) => ({
        ...item,
        vachak: {
          id: vachak.id,
          name: vachak.name,
          shortName: vachak.shortName,
          specialty: vachak.specialty,
          emoji: vachak.emoji,
        },
      }));
    } catch (err) {
      lastError = err;
    }
  }

  if (candidates.length === 0 && fallbackFeedUrls.length === 0) {
    throw new Error(`No channel candidates for ${vachak.id}`);
  }
  throw new Error(lastError?.message || `All channel candidates failed for ${vachak.id}`);
}

export async function fetchByVachakId(vachakId) {
  const vachak = VACHAKS.find((v) => v.id === vachakId);
  if (!vachak) {
    throw new Error(`Vachak not found: ${vachakId}`);
  }
  return fetchChannel(vachak);
}

async function resolveChannelCandidates(vachak) {
  const candidates = [];

  if (resolvedCache.has(vachak.id)) {
    candidates.push(resolvedCache.get(vachak.id));
  }

  if (VERIFIED_CHANNEL_IDS[vachak.id]) {
    candidates.push(VERIFIED_CHANNEL_IDS[vachak.id]);
  }

  if (vachak.handle) {
    const fromHandle = await resolveFromHandle(vachak.handle);
    if (fromHandle) {
      candidates.push(fromHandle);
    }
  }

  return [...new Set(candidates.filter(Boolean))];
}

async function resolveFromHandle(handle) {
  const url = `https://www.youtube.com/@${handle}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(HANDLE_TIMEOUT_MS),
  });

  if (!response.ok) return null;
  const html = await response.text();

  const patterns = [
    /"channelId":"(UC[\w-]{20,})"/,
    /https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{20,})/,
  ];

  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m) return m[1];
  }

  return null;
}

async function runWithConcurrency(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      // Queue is local and single-threaded in JS event loop, safe to shift here.
      await worker(item);
    }
  });
  await Promise.all(runners);
}

async function parseFeedWithTimeout(feedUrl) {
  return Promise.race([
    parser.parseURL(feedUrl),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Feed timeout: ${feedUrl}`)), FEED_TIMEOUT_MS);
    }),
  ]);
}


