import { safeDateNumber } from "./utils.js";

const speakerImageMap = {
  rajendradas: "assets/images/rajendradas.png",
  pundrik: "assets/images/pundrik.png",
  morari: "assets/images/morari.png",
  jayakishori: "assets/images/jayakishori.png",
  premanand: "assets/images/premanand.png",
  bageshwar: "assets/images/bageshwar.png",
  indresh: "assets/images/indresh.png",
  pradeep: "assets/images/pradeep.png",
  pradeepmishra: "assets/images/pradeep.png",
};

const typeLabelMap = {
  bhagwat: "Bhagwat",
  ramkatha: "Ram Katha",
  darbar: "Darbar",
  shivpuran: "Shiv Puran",
};

export async function loadAppData() {
  const [eventsRaw, speakersRaw, reportRaw] = await Promise.all([
    fetch("./js/data/scraped_events.json").then((r) => r.json()).catch(() => []),
    fetch("./js/data/vachaks.json").then((r) => r.json()).catch(() => []),
    fetch("./js/data/scrape_report.json").then((r) => r.json()).catch(() => ({})),
  ]);

  const speakers = speakersRaw.map((speaker) => ({
    ...speaker,
    shortName: speaker.shortName || speaker.name || "Unknown Speaker",
    bio: speaker.bio || "",
    image: speakerImageMap[speaker.id] || "assets/images/placeholder-vachak.png",
  }));

  const speakerById = new Map(speakers.map((speaker) => [speaker.id, speaker]));

  const events = eventsRaw.map((event) => {
    const start = event?.dates?.start || "2100-01-01";
    const end = event?.dates?.end || start;
    const type = String(event?.type || "other").toLowerCase();
    const speaker = speakerById.get(event.vachakId);
    const cityName = event?.location?.cityName || "Unknown City";

    return {
      id: event.id,
      title: event.title || "Untitled Event",
      start,
      end,
      type,
      typeLabel: typeLabelMap[type] || "Spiritual Event",
      city: event?.location?.city || cityName.toLowerCase().replace(/\s+/g, "-"),
      cityName,
      venue: event?.location?.venue || "Venue TBD",
      timing: event?.dates?.timing || "Time TBD",
      isLive: isLiveToday(start, end, Boolean(event?.features?.isLive)),
      isFree: Boolean(event?.features?.isFree),
      hasLiveStream: Boolean(event?.features?.hasLiveStream),
      thumbnail: event.thumbnail || "",
      link: event.link || "",
      source: event.source || "unknown",
      updatedAt: event.updatedAt || "",
      verifiedSource: Boolean(event.verifiedSource),
      speakerId: event?.vachakId || "",
      speakerName: speaker?.shortName || "Unknown Speaker",
      speakerBio: speaker?.bio || "",
      speakerImage: speaker?.image || "assets/images/placeholder-vachak.png",
      dateNum: safeDateNumber(start),
    };
  });

  const reportUpdatedAt = reportRaw?.generatedAt || "";
  const lastUpdated = reportUpdatedAt || newestUpdatedAt(events);

  return { events, speakers, lastUpdated };
}

function newestUpdatedAt(events) {
  let max = 0;
  for (const event of events) {
    if (!event?.updatedAt) continue;
    const ts = new Date(event.updatedAt).getTime();
    if (Number.isFinite(ts) && ts > max) max = ts;
  }
  return max ? new Date(max).toISOString() : "";
}

function isDateLive(start, end) {
  const now = Date.now();
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(23, 59, 59, 999);
  return now >= s && now <= e;
}

function isLiveToday(start, end, liveSignal) {
  if (!isDateLive(start, end)) return false;
  return liveSignal;
}
