import { createStore } from "./core/store.js";
import { createRouter } from "./core/router.js";
import { loadAppData } from "./core/data-service.js";
import { renderApp, renderDialog } from "./ui/renderers.js";

const STORAGE_KEY = "satsang_state_v2";

const refs = {
  hero: document.getElementById("hero"),
  root: document.getElementById("viewRoot"),
  tabs: document.getElementById("tabs"),
  search: document.getElementById("searchInput"),
  city: document.getElementById("cityFilter"),
  type: document.getElementById("typeFilter"),
  sort: document.getElementById("sortSelect"),
  dialog: document.getElementById("eventDialog"),
  installBtn: document.getElementById("installBtn"),
};

const store = createStore({
  view: "discover",
  loading: true,
  error: "",
  query: "",
  city: "all",
  type: "all",
  sort: "soonest",
  saved: [],
  savedSet: new Set(),
  events: [],
  filteredEvents: [],
  sortedEvents: [],
  cityOptions: [],
  typeOptions: [],
  selectedEventId: "",
  deferredInstall: null,
});

const router = createRouter("discover");

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
    const { events } = await loadAppData();
    store.setState({
      events,
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
  });
}

function bindDomEvents() {
  refs.search.addEventListener("input", (e) => {
    store.setState({ query: e.target.value.trim().toLowerCase() });
    recompute();
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

  if (action === "open-event" && id) {
    openDialogById(id);
    return;
  }

  if (action === "close-dialog") {
    refs.dialog.close();
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
      return cityOk && typeOk && searchOk;
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

function openDialogById(id) {
  const state = store.getState();
  const event = state.events.find((item) => item.id === id);
  if (!event) return;

  renderDialog(event, refs.dialog, state.savedSet.has(id));
  if (!refs.dialog.open) refs.dialog.showModal();
}

function persist() {
  const state = store.getState();
  persistWith({
    view: state.view,
    city: state.city,
    type: state.type,
    sort: state.sort,
    saved: state.saved,
  });
}

function persistWith(partial) {
  const current = readStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
}

function hydrateFromStorage() {
  const data = readStorage();
  store.setState({
    view: data.view || "discover",
    city: data.city || "all",
    type: data.type || "all",
    sort: data.sort || "soonest",
    saved: Array.isArray(data.saved) ? data.saved : [],
    savedSet: new Set(Array.isArray(data.saved) ? data.saved : []),
  });
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
    .sort((a, b) => a.localeCompare(b))
;
}

function setupPwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    store.setState({ deferredInstall: e });
    refs.installBtn.style.display = "grid";
  });

  refs.installBtn.addEventListener("click", async () => {
    const prompt = store.getState().deferredInstall;
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    store.setState({ deferredInstall: null });
    refs.installBtn.style.display = "none";
  });
}

