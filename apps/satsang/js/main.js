import { createStore } from "./core/store.js";
import { createRouter } from "./core/router.js";
import { loadAppData } from "./core/data-service.js";
import { renderApp, renderDialog } from "./ui/renderers.js";
import { getCityCoords, haversineKm } from "./core/geo.js";

const STORAGE_KEY = "satsang_state_v3";

const refs = {
  root: document.getElementById("viewRoot"),
  filters: document.getElementById("filters"),
  filterPanel: document.getElementById("filterPanel"),
  filterToggleBtn: document.getElementById("filterToggleBtn"),
  filterCount: document.getElementById("filterCount"),
  quickFilters: document.querySelectorAll('[data-action="quick-filter"]'),
  tabs: document.getElementById("tabs"),
  search: document.getElementById("searchInput"),
  city: document.getElementById("cityFilter"),
  type: document.getElementById("typeFilter"),
  sort: document.getElementById("sortSelect"),
  dialog: document.getElementById("eventDialog"),
};

const store = createStore({
  view: "discover",
  loading: true,
  error: "",
  lastUpdated: "",
  cachedAt: "",
  report: null,
  query: "",
  city: "all",
  type: "all",
  sort: "soonest",
  filtersOpen: false,
  quickLive: false,
  quickWeek: false,
  quickFree: false,
  quickOnline: false,
  quickNear: false,
  calendarSelectedDate: "",
  calendarDayFilter: "all",
  persona: "",
  home: null, // { mode: 'geo'|'city', lat, lon, city, cityName, updatedAt }
  nearRadiusKm: 50,
  following: [],
  followingSet: new Set(),
  followingOnly: false,
  saved: [],
  reminders: [],
  savedSet: new Set(),
  remindersSet: new Set(),
  distanceById: {},
  speakers: [],
  events: [],
  filteredEvents: [],
  sortedEvents: [],
  cityOptions: [],
  typeOptions: [],
  selectedEventId: "",
});

const router = createRouter("discover");
let previousView = "discover";
let calendarObserver = null;

init();

async function init() {
  hydrateFromStorage();
  bindDomEvents();
  bindStateRendering();
  bindDeepLinks();
  router.subscribe((view) => {
    if (view !== store.getState().view) {
      store.setState({ view });
      persist();
      recompute();
    }
  });

  router.init();

  try {
    const { events, speakers, lastUpdated, report } = await loadAppData();
    store.setState({
      events,
      speakers,
      lastUpdated,
      report,
      loading: false,
      error: "",
      cityOptions: uniqueValues(events.map((event) => event.city)),
      typeOptions: uniqueValues(events.map((event) => event.type)),
    });
    recompute();
  } catch {
    store.setState({ loading: false, error: "Could not load events." });
    recompute();
  }

  setupPwa();
}

function bindStateRendering() {
  store.subscribe((state) => {
    renderApp(state, refs);
    syncQuickFiltersUi();
    setupCalendarObserver(state);
    previousView = state.view;
  });
}

function bindDomEvents() {
  refs.search.addEventListener("input", (e) => {
    store.setState({ query: e.target.value.trim().toLowerCase() });
    recompute();
  });

  refs.search.addEventListener("focus", () => {
    if (!store.getState().filtersOpen) {
      store.setState({ filtersOpen: true });
      persist();
      syncFilterPanelUi();
    }
  });

  refs.filterToggleBtn.addEventListener("click", () => {
    const next = !store.getState().filtersOpen;
    store.setState({ filtersOpen: next });
    persist();
    syncFilterPanelUi();
  });

  refs.filters.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="quick-filter"]');
    if (btn) {
      const key = String(btn.dataset.filter || "").toLowerCase();
      toggleQuickFilter(key);
      return;
    }
    const reset = e.target.closest('[data-action="clear-filters"]');
    if (reset) clearFilters();
  });

  refs.city.addEventListener("change", (e) => {
    store.setState({ city: e.target.value });
    persist();
    recompute();
  });

  refs.type.addEventListener("change", (e) => {
    store.setState({ type: e.target.value });
    persist();
    recompute();
  });

  refs.sort.addEventListener("change", (e) => {
    store.setState({ sort: e.target.value });
    persist();
    recompute();
  });

  refs.tabs.addEventListener("click", (e) => {
    const target = e.target.closest("button[data-view]");
    if (!target) return;
    router.push(target.dataset.view);
  });

  refs.root.addEventListener("click", handleActionClick);
  refs.dialog.addEventListener("click", handleActionClick);

  refs.dialog.addEventListener("click", (e) => {
    if (e.target === refs.dialog) refs.dialog.close();
  });
}

function handleActionClick(e) {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (action === "toggle-save" && id) {
    toggleSave(id);
    recompute();
    if (refs.dialog.open) openDialogById(id);
    return;
  }

  if (action === "set-reminder" && id) {
    toggleReminder(id);
    recompute();
    if (refs.dialog.open) openDialogById(id);
    return;
  }

  if (action === "add-calendar" && id) {
    const event = store.getState().events.find((item) => item.id === id);
    if (event) downloadReminderIcs(event);
    return;
  }

  if (action === "share-event") {
    const link = target.dataset.link || window.location.href;
    shareLink(link);
    return;
  }

  if (action === "open-event" && id) {
    openDialogById(id);
    return;
  }

  if (action === "calendar-jump") {
    const monthIndex = Number(target.dataset.monthIndex);
    if (Number.isFinite(monthIndex)) {
      jumpToCalendarMonth(monthIndex);
    }
    return;
  }

  if (action === "calendar-today") {
    focusCalendarToday();
    return;
  }

  if (action === "calendar-day") {
    const date = target.dataset.date;
    if (date) {
      store.setState({ calendarSelectedDate: date });
    }
    return;
  }

  if (action === "calendar-filter") {
    const filter = target.dataset.filter || "all";
    store.setState({ calendarDayFilter: filter });
    return;
  }

  if (action === "close-dialog") {
    refs.dialog.close();
    clearEventLink();
  }

  if (action === "clear-filters") {
    clearFilters();
  }

  if (action === "go-discover") {
    router.push("discover");
  }

  if (action === "refresh-data") {
    refreshData();
  }

  if (action === "open-vachak") {
    const speakerId = String(target.dataset.speakerId || "");
    if (speakerId) router.push(`vachak/${speakerId}`);
    return;
  }

  if (action === "set-persona") {
    const persona = String(target.dataset.persona || "").toLowerCase();
    if (persona) setPersona(persona);
  }

  if (action === "toggle-following-only") {
    store.update((state) => {
      const followingOnly = !state.followingOnly;
      persistWith({ followingOnly });
      return { ...state, followingOnly };
    });
    recompute();
  }

  if (action === "toggle-follow-speaker") {
    const speakerId = String(target.dataset.speakerId || "");
    if (speakerId) toggleFollowSpeaker(speakerId);
  }

  if (action === "set-home-city") {
    const city = String(target.dataset.city || "");
    if (city) setHomeCity(city);
  }

  if (action === "set-home-geo") {
    requestHomeGeolocation();
  }

  if (action === "near-radius") {
    const delta = Number(target.dataset.delta || 0);
    if (!Number.isFinite(delta) || !delta) return;
    store.update((state) => {
      const current = Number(state.nearRadiusKm) || 50;
      const next = clamp(Math.round(current + delta), 5, 500);
      persistWith({ nearRadiusKm: next });
      return { ...state, nearRadiusKm: next };
    });
    recompute();
  }
}

function recompute() {
  store.update((state) => {
    const filtered = state.events.filter((event) => {
      const cityOk = state.city === "all" || event.city === state.city;
      const typeOk = state.type === "all" || event.type === state.type;
      const q = state.query;
      const searchOk =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.cityName.toLowerCase().includes(q) ||
        event.speakerName.toLowerCase().includes(q);
      const quickActive = state.view === "discover";
      const liveOk = !quickActive || !state.quickLive || event.isLive;
      const freeOk = !quickActive || !state.quickFree || event.isFree;
      const onlineOk = !quickActive || !state.quickOnline || event.city === "online";
      const weekOk = !quickActive || !state.quickWeek || isWithinWeek(event.dateNum);
      const followingOk =
        !quickActive || !state.followingOnly || state.followingSet.has(event.speakerId);
      const nearOk = !quickActive || !state.quickNear || isNearHome(state, event);
      return cityOk && typeOk && searchOk && liveOk && freeOk && onlineOk && weekOk && followingOk && nearOk;
    });

    const distanceById = computeDistances(state, filtered);
    const sorted = [...filtered].sort((a, b) => {
      if (state.sort === "live") return Number(b.isLive) - Number(a.isLive) || a.dateNum - b.dateNum;
      if (state.sort === "city") return a.cityName.localeCompare(b.cityName);
      return a.dateNum - b.dateNum;
    });

    return {
      ...state,
      filteredEvents: filtered,
      sortedEvents: sorted,
      savedSet: new Set(state.saved),
      remindersSet: new Set(state.reminders),
      followingSet: new Set(state.following),
      distanceById,
    };
  });
}

function toggleSave(id) {
  store.update((state) => {
    const saved = state.saved.includes(id)
      ? state.saved.filter((item) => item !== id)
      : [...state.saved, id];

    persistWith({ saved });

    return {
      ...state,
      saved,
      savedSet: new Set(saved),
    };
  });
}

function toggleReminder(id) {
  store.update((state) => {
    const reminders = state.reminders.includes(id)
      ? state.reminders.filter((item) => item !== id)
      : [...state.reminders, id];

    const event = state.events.find((item) => item.id === id);
    if (event && !state.reminders.includes(id)) {
      downloadReminderIcs(event);
    }

    persistWith({ reminders });

    return {
      ...state,
      reminders,
      remindersSet: new Set(reminders),
    };
  });
}

function openDialogById(id) {
  const state = store.getState();
  const event = state.events.find((item) => item.id === id);
  if (!event) return;

  renderDialog(event, refs.dialog, state.savedSet.has(id), state.remindersSet.has(id), {
    distanceKm: state.distanceById[id],
  });
  if (!refs.dialog.open) refs.dialog.showModal();
  setEventLink(id);
}

function persist() {
  const state = store.getState();
  persistWith({
    view: state.view,
    filtersOpen: state.filtersOpen,
    city: state.city,
    type: state.type,
    sort: state.sort,
    quickLive: state.quickLive,
    quickWeek: state.quickWeek,
    quickFree: state.quickFree,
    quickOnline: state.quickOnline,
    quickNear: state.quickNear,
    saved: state.saved,
    reminders: state.reminders,
    persona: state.persona,
    home: state.home,
    nearRadiusKm: state.nearRadiusKm,
    following: state.following,
    followingOnly: state.followingOnly,
  });
}

function persistWith(partial) {
  const current = readStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial, cachedAt: new Date().toISOString() }));
}

function hydrateFromStorage() {
  const data = readStorage();
  const saved = Array.isArray(data.saved) ? data.saved : [];
  const reminders = Array.isArray(data.reminders) ? data.reminders : [];

  store.setState({
    view: data.view || "discover",
    filtersOpen: Boolean(data.filtersOpen),
    city: data.city || "all",
    type: data.type || "all",
    sort: data.sort || "soonest",
    quickLive: Boolean(data.quickLive),
    quickWeek: Boolean(data.quickWeek),
    quickFree: Boolean(data.quickFree),
    quickOnline: Boolean(data.quickOnline),
    quickNear: Boolean(data.quickNear),
    cachedAt: data.cachedAt || "",
    persona: data.persona || "",
    home: data.home || null,
    nearRadiusKm: Number.isFinite(Number(data.nearRadiusKm)) ? Number(data.nearRadiusKm) : 50,
    following: Array.isArray(data.following) ? data.following.filter(Boolean) : [],
    followingOnly: Boolean(data.followingOnly),
    saved,
    reminders,
    savedSet: new Set(saved),
    remindersSet: new Set(reminders),
  });

  syncFilterPanelUi();
  syncQuickFiltersUi();
}

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function uniqueValues(values) {
  return [...new Set(values)]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setupPwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
}

async function refreshData() {
  try {
    store.setState({ loading: true, error: "" });
    const { events, speakers, lastUpdated, report } = await loadAppData();
    store.setState({
      events,
      speakers,
      lastUpdated,
      report,
      loading: false,
      error: "",
      cityOptions: uniqueValues(events.map((event) => event.city)),
      typeOptions: uniqueValues(events.map((event) => event.type)),
      cachedAt: new Date().toISOString(),
    });
    recompute();
  } catch {
    store.setState({ loading: false, error: "Could not refresh events." });
  }
}

function syncFilterPanelUi() {
  const { filtersOpen } = store.getState();
  if (!refs.filterPanel || !refs.filterToggleBtn || !refs.filters) return;

  refs.filterPanel.hidden = !filtersOpen;
  refs.filterToggleBtn.setAttribute("aria-expanded", String(filtersOpen));
  refs.filters.classList.toggle("filters-open", filtersOpen);
}

function syncQuickFiltersUi() {
  const state = store.getState();
  if (!refs.quickFilters?.length) return;
  refs.quickFilters.forEach((btn) => {
    const key = String(btn.dataset.filter || "").toLowerCase();
    const active =
      (key === "live" && state.quickLive) ||
      (key === "week" && state.quickWeek) ||
      (key === "free" && state.quickFree) ||
      (key === "online" && state.quickOnline) ||
      (key === "near" && state.quickNear);
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

function toggleQuickFilter(key) {
  if (!key) return;
  store.update((state) => {
    const next = {
      quickLive: state.quickLive,
      quickWeek: state.quickWeek,
      quickFree: state.quickFree,
      quickOnline: state.quickOnline,
      quickNear: state.quickNear,
    };
    if (key === "live") next.quickLive = !state.quickLive;
    if (key === "week") next.quickWeek = !state.quickWeek;
    if (key === "free") next.quickFree = !state.quickFree;
    if (key === "online") next.quickOnline = !state.quickOnline;
    if (key === "near") next.quickNear = !state.quickNear;
    return { ...state, ...next };
  });
  persist();
  recompute();
  syncQuickFiltersUi();
}

function clearFilters() {
  store.setState({
    query: "",
    city: "all",
    type: "all",
    sort: "soonest",
    quickLive: false,
    quickWeek: false,
    quickFree: false,
    quickOnline: false,
    quickNear: false,
    followingOnly: false,
    filtersOpen: false,
  });
  persist();
  recompute();
  syncQuickFiltersUi();
  syncFilterPanelUi();
}

function setPersona(persona) {
  store.update((state) => {
    const patch = { persona };
    // Nudge defaults for the selected primary job.
    if (persona === "attend") {
      patch.quickWeek = true;
      if (state.home) patch.quickNear = true;
    }
    if (persona === "online") {
      patch.quickOnline = true;
      patch.quickNear = false;
    }
    if (persona === "follow") {
      patch.followingOnly = state.following.length > 0;
    }
    persistWith(patch);
    return { ...state, ...patch };
  });
  recompute();
  syncQuickFiltersUi();
}

function toggleFollowSpeaker(speakerId) {
  store.update((state) => {
    const following = state.following.includes(speakerId)
      ? state.following.filter((id) => id !== speakerId)
      : [...state.following, speakerId];
    const patch = { following };
    persistWith(patch);
    return { ...state, ...patch, followingSet: new Set(following) };
  });
  recompute();
}

function setHomeCity(city) {
  const coords = getCityCoords(city, city);
  const home = {
    mode: "city",
    city,
    cityName: city,
    lat: coords ? coords.lat : null,
    lon: coords ? coords.lon : null,
    updatedAt: new Date().toISOString(),
  };
  store.setState({ home });
  persistWith({ home });
  recompute();
}

function requestHomeGeolocation() {
  if (!("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const home = {
        mode: "geo",
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        city: "",
        cityName: "Current location",
        updatedAt: new Date().toISOString(),
      };
      store.setState({ home, quickNear: true });
      persistWith({ home, quickNear: true });
      recompute();
      syncQuickFiltersUi();
    },
    () => {}
  );
}

function isNearHome(state, event) {
  // If user turned it on but hasn't set a location yet, don't hide everything.
  if (!state.home) return true;
  if (event.city === "online") return false;

  const home = state.home;
  const radiusKm = Number(state.nearRadiusKm) || 50;

  // City fallback if we don't have coordinates.
  if (!Number.isFinite(home.lat) || !Number.isFinite(home.lon)) {
    return Boolean(home.city) && event.city === home.city;
  }

  if (!Number.isFinite(event.cityLat) || !Number.isFinite(event.cityLon)) return false;
  const km = haversineKm({ lat: home.lat, lon: home.lon }, { lat: event.cityLat, lon: event.cityLon });
  return Number.isFinite(km) && km <= radiusKm;
}

function computeDistances(state, list) {
  const byId = {};
  const home = state.home;
  if (!home) return byId;
  if (!Number.isFinite(home.lat) || !Number.isFinite(home.lon)) return byId;

  for (const event of list) {
    if (!Number.isFinite(event.cityLat) || !Number.isFinite(event.cityLon)) continue;
    const km = haversineKm({ lat: home.lat, lon: home.lon }, { lat: event.cityLat, lon: event.cityLon });
    if (Number.isFinite(km)) byId[event.id] = km;
  }
  return byId;
}

function isWithinWeek(dateNum) {
  if (!Number.isFinite(dateNum)) return false;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = start.getTime() + 7 * 24 * 60 * 60 * 1000;
  return dateNum >= start.getTime() && dateNum <= end;
}

function focusCalendarToday() {
  const todayCell = refs.root.querySelector('[data-calendar-today="true"]');
  if (todayCell) {
    todayCell.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const firstMonth = refs.root.querySelector('[data-calendar-month="0"]');
  if (firstMonth) {
    firstMonth.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setupCalendarObserver(state) {
  if (calendarObserver) {
    calendarObserver.disconnect();
    calendarObserver = null;
  }

  if (state.view !== "calendar") return;

  queueMicrotask(() => {
    const months = refs.root.querySelectorAll("[data-calendar-month]");
    if (!months.length) return;

    calendarObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(visible.target.dataset.calendarMonth);
        if (Number.isFinite(idx)) setActiveCalendarJump(idx);
      },
      { root: null, threshold: [0.4, 0.6, 0.75] }
    );

    months.forEach((month) => calendarObserver.observe(month));
  });
}

function jumpToCalendarMonth(monthIndex) {
  const month = refs.root.querySelector(`[data-calendar-month="${monthIndex}"]`);
  if (!month) return;
  setActiveCalendarJump(monthIndex);
  month.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveCalendarJump(monthIndex) {
  refs.root.querySelectorAll(".calendar-jump-btn").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.monthIndex) === monthIndex);
  });
}

function downloadReminderIcs(event) {
  const start = new Date(event.start);
  start.setHours(9, 0, 0, 0);
  const end = new Date(event.end || event.start);
  end.setHours(21, 0, 0, 0);

  const dtStamp = formatIcsDate(new Date());
  const dtStart = formatIcsDate(start);
  const dtEnd = formatIcsDate(end);
  const uid = `${event.id}@satsang.app`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SanatanOS//Satsang//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `LOCATION:${escapeIcs(`${event.venue}, ${event.cityName}`)}`,
    `DESCRIPTION:${escapeIcs(`${event.speakerName} | ${event.typeLabel} | ${event.timing}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFileName(event.title)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function shareLink(link) {
  try {
    if (navigator.share) {
      await navigator.share({ url: link });
      return;
    }
  } catch {
    // fall back to clipboard
  }

  try {
    await navigator.clipboard.writeText(link);
  } catch {
    const input = document.createElement("input");
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
}

function setEventLink(id) {
  const url = new URL(window.location.href);
  url.searchParams.set("event", id);
  window.history.replaceState(null, "", url.toString());
}

function clearEventLink() {
  const url = new URL(window.location.href);
  url.searchParams.delete("event");
  window.history.replaceState(null, "", url.toString());
}

function bindDeepLinks() {
  const openFromUrl = () => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("event");
    if (!id) return;
    const state = store.getState();
    const event = state.events.find((item) => item.id === id);
    if (event) {
      openDialogById(id);
    }
  };

  window.addEventListener("popstate", openFromUrl);
  store.subscribe(() => {
    if (!store.getState().loading) {
      openFromUrl();
    }
  });
}

function formatIcsDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeIcs(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

function sanitizeFileName(value) {
  return String(value || "satsang-reminder")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "satsang-reminder";
}
