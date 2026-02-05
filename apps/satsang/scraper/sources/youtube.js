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

const VERIFIED_CHANNEL_IDS = {
  jayakishori: 'UCWX7Y1JXgz8VGlyFQnlHqpA',
  bageshwar: 'UCp2Zqr_mGWq_WTZ2BKE9k_g',
  morari: 'UCnePvOdQ-uBSWSIgRoG55gA',
  pradeep: 'UCiWB2Ucdmkj4GqmWMrka1RA',
  rajendradas: 'UCJIVfJlBmvvGR-HMJBHx5Tw',
  pundrik: 'UCM2iwBjYlzFQ34wT0CqMCGg',
  premanand: 'UC5B9f9aZvpQV8MaKF6DWGRA',
  indresh: 'UCFmJwGt-o16mS5EWgMmZ3rA',
};

const resolvedCache = new Map();

export async function fetchAllChannels() {
  const allItems = [];

  console.log('Fetching YouTube RSS feeds...');

  for (const vachak of VACHAKS) {
    try {
      const items = await fetchChannel(vachak);
      allItems.push(...items);
      console.log(`OK ${vachak.shortName}: ${items.length}`);
    } catch (error) {
      console.error(`FAIL ${vachak.shortName}: ${error.message}`);
    }
  }

  console.log(`YouTube total items: ${allItems.length}`);
  return allItems;
}

export async function fetchChannel(vachak) {
  const candidates = await resolveChannelCandidates(vachak);
  if (candidates.length === 0) {
    throw new Error(`No channelId candidates for ${vachak.id}`);
  }

  let lastError = null;
  for (const channelId of candidates) {
    try {
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const feed = await parser.parseURL(feedUrl);

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


