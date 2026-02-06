import { createStore } from "./core/store.js";
import { createRouter } from "./core/router.js";
import { loadAppData } from "./core/data-service.js";
import { renderApp, renderDialog } from "./ui/renderers.js";

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
  query: "",
  city: "all",
  type: "all",
  sort: "soonest",
  filtersOpen: false,
  quickLive: false,
  quickWeek: false,
  quickFree: false,
  quickOnline: false,
  calendarSelectedDate: "",
  saved: [],
  reminders: [],
  savedSet: new Set(),
  remindersSet: new Set(),
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
  router.subscribe((view) => {
    if (view !== store.getState().view) {
      store.setState({ view });
      persist();
      recompute();
    }
  });

  router.init();

  try {
    const { events, lastUpdated } = await loadAppData();
    store.setState({
      events,
      lastUpdated,
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

  if (action === "close-dialog") {
    refs.dialog.close();
  }

  if (action === "clear-filters") {
    clearFilters();
  }

  if (action === "go-discover") {
    router.push("discover");
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
      return cityOk && typeOk && searchOk && liveOk && freeOk && onlineOk && weekOk;
    });

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

  renderDialog(event, refs.dialog, state.savedSet.has(id), state.remindersSet.has(id));
  if (!refs.dialog.open) refs.dialog.showModal();
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
    saved: state.saved,
    reminders: state.reminders,
  });
}

function persistWith(partial) {
  const current = readStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
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

function setupPwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
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
      (key === "online" && state.quickOnline);
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
    };
    if (key === "live") next.quickLive = !state.quickLive;
    if (key === "week") next.quickWeek = !state.quickWeek;
    if (key === "free") next.quickFree = !state.quickFree;
    if (key === "online") next.quickOnline = !state.quickOnline;
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
    filtersOpen: false,
  });
  persist();
  recompute();
  syncQuickFiltersUi();
  syncFilterPanelUi();
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
