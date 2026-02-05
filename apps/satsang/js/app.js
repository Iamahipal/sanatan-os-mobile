const STORAGE_KEY = "satsang_modern_state_v1";

const speakerImageMap = {
  rajendradas: "assets/images/rajendradas.png",
  pundrik: "assets/images/pundrik.png",
  morari: "assets/images/morari.png",
  jayakishori: "assets/images/jayakishori.png",
  premanand: "assets/images/premanand.png",
  bageshwar: "assets/images/bageshwar.png",
  indresh: "assets/images/indresh.png",
  pradeep: "assets/images/pradeep.png",
};

const appState = {
  view: "discover",
  query: "",
  city: "all",
  type: "all",
  sort: "soonest",
  saved: [],
  events: [],
  speakers: [],
  deferredInstall: null,
};

const els = {
  hero: document.getElementById("hero"),
  root: document.getElementById("viewRoot"),
  nav: document.getElementById("nav"),
  search: document.getElementById("searchInput"),
  city: document.getElementById("cityFilter"),
  type: document.getElementById("typeFilter"),
  sort: document.getElementById("sortBy"),
  dialog: document.getElementById("eventDialog"),
  installBtn: document.getElementById("installBtn"),
};

init();

async function init() {
  restoreState();
  await loadData();
  bindEvents();
  renderAll();
  setupPwa();
}

function bindEvents() {
  els.search.addEventListener("input", (e) => {
    appState.query = e.target.value.trim().toLowerCase();
    renderView();
  });

  els.city.addEventListener("change", (e) => {
    appState.city = e.target.value;
    saveState();
    renderView();
  });

  els.type.addEventListener("change", (e) => {
    appState.type = e.target.value;
    saveState();
    renderView();
  });

  els.sort.addEventListener("change", (e) => {
    appState.sort = e.target.value;
    saveState();
    renderView();
  });

  els.nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-view]");
    if (!btn) return;
    appState.view = btn.dataset.view;
    saveState();
    renderView();
    updateNav();
  });

  els.root.addEventListener("click", (e) => {
    const saveBtn = e.target.closest("button[data-save]");
    if (saveBtn) {
      toggleSave(saveBtn.dataset.save);
      renderView();
      return;
    }

    const card = e.target.closest("[data-open]");
    if (card) {
      const event = appState.events.find((item) => item.id === card.dataset.open);
      if (event) openEventDialog(event);
    }
  });

  els.installBtn.addEventListener("click", async () => {
    if (!appState.deferredInstall) return;
    appState.deferredInstall.prompt();
    await appState.deferredInstall.userChoice;
    appState.deferredInstall = null;
    els.installBtn.style.display = "none";
  });
}

function setupPwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    appState.deferredInstall = e;
    els.installBtn.style.display = "grid";
  });
}

async function loadData() {
  const [eventsRaw, speakersRaw] = await Promise.all([
    fetch("./js/data/scraped_events.json").then((r) => r.json()).catch(() => []),
    fetch("./js/data/vachaks.json").then((r) => r.json()).catch(() => []),
  ]);

  appState.speakers = speakersRaw.map((speaker) => ({
    ...speaker,
    shortName: speaker.shortName || speaker.name || "Unknown Speaker",
    image: speakerImageMap[speaker.id] || "assets/images/placeholder-vachak.png",
  }));

  appState.events = eventsRaw.map((event) => normalizeEvent(event));

  buildFilters();
}

function normalizeEvent(event) {
  const start = event?.dates?.start || "2030-01-01";
  const end = event?.dates?.end || start;
  const cityName = event?.location?.cityName || "Unknown city";
  const city = event?.location?.city || cityName.toLowerCase().replace(/\s+/g, "-");
  const type = (event?.type || "other").toLowerCase();
  const typeName = {
    bhagwat: "Bhagwat",
    ramkatha: "Ram Katha",
    darbar: "Darbar",
    shivpuran: "Shiv Puran",
  }[type] || "Spiritual Event";

  return {
    id: event.id,
    title: event.title || "Untitled Event",
    start,
    end,
    type,
    typeName,
    city,
    cityName,
    venue: event?.location?.venue || "Venue TBD",
    timing: event?.dates?.timing || "Time TBD",
    isLive: Boolean(event?.features?.isLive),
    isFree: Boolean(event?.features?.isFree),
    hasLiveStream: Boolean(event?.features?.hasLiveStream),
    link: event.link || "",
    speakerId: event.vachakId,
    speakerName: getSpeakerName(event.vachakId),
  };
}

function getSpeakerName(id) {
  const speaker = appState.speakers.find((item) => item.id === id);
  return speaker?.shortName || "Unknown Speaker";
}

function buildFilters() {
  const cities = ["all", ...new Set(appState.events.map((e) => e.city))];
  const types = ["all", ...new Set(appState.events.map((e) => e.type))];

  els.city.innerHTML = cities
    .map((city) => `<option value="${city}" ${city === appState.city ? "selected" : ""}>${city === "all" ? "All cities" : pretty(city)}</option>`)
    .join("");

  els.type.innerHTML = types
    .map((type) => `<option value="${type}" ${type === appState.type ? "selected" : ""}>${type === "all" ? "All types" : pretty(type)}</option>`)
    .join("");
}

function renderAll() {
  renderHero();
  updateNav();
  renderView();
  refreshIcons();
}

function renderHero() {
  const event = getSortedEvents(getFilteredEvents())[0];
  if (!event) {
    els.hero.innerHTML = `<h2>No events found</h2><p>Data source is empty.</p>`;
    return;
  }

  els.hero.innerHTML = `
    <h2>${escapeHtml(event.title)}</h2>
    <p>${escapeHtml(event.speakerName)} � ${escapeHtml(event.cityName)}</p>
    <div class="hero-meta">
      <span>${formatRange(event.start, event.end)}</span>
      <span>${escapeHtml(event.timing)}</span>
      <span>${event.isLive ? "Live now" : event.typeName}</span>
    </div>
  `;
}

function renderView() {
  renderHero();
  const events = getSortedEvents(getFilteredEvents());

  if (appState.view === "discover") {
    renderDiscover(events);
  } else if (appState.view === "calendar") {
    renderCalendar(events);
  } else if (appState.view === "saved") {
    renderSaved(events);
  } else {
    renderProfile();
  }

  refreshIcons();
}

function renderDiscover(events) {
  if (!events.length) {
    els.root.innerHTML = `<div class="empty">No matching events. Change filters or search text.</div>`;
    return;
  }

  els.root.innerHTML = `
    <h2 class="section-title">Upcoming & Live</h2>
    <section class="event-grid">
      ${events.map((event) => cardTemplate(event)).join("")}
    </section>
  `;
}

function renderCalendar(events) {
  const grouped = groupByMonth(events);
  const months = Object.keys(grouped);

  if (!months.length) {
    els.root.innerHTML = `<div class="empty">No upcoming events for the current filters.</div>`;
    return;
  }

  els.root.innerHTML = `
    <h2 class="section-title">Timeline</h2>
    <section class="timeline">
      ${months
        .map(
          (month) => `
            <article class="month-block">
              <h3>${month}</h3>
              ${grouped[month]
                .map(
                  (event) => `
                    <div class="row" data-open="${event.id}">
                      <div class="date">${formatShortDate(event.start)}</div>
                      <div>
                        <strong>${escapeHtml(event.title)}</strong><br>
                        <span>${escapeHtml(event.cityName)} � ${escapeHtml(event.speakerName)}</span>
                      </div>
                      <button class="save-btn ${isSaved(event.id) ? "active" : ""}" data-save="${event.id}">${isSaved(event.id) ? "Saved" : "Save"}</button>
                    </div>
                  `
                )
                .join("")}
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderSaved(events) {
  const savedSet = new Set(appState.saved);
  const savedEvents = events.filter((event) => savedSet.has(event.id));

  if (!savedEvents.length) {
    els.root.innerHTML = `<div class="empty">No saved events yet. Save from Discover or Calendar.</div>`;
    return;
  }

  els.root.innerHTML = `
    <h2 class="section-title">Saved Events</h2>
    <section class="event-grid">
      ${savedEvents.map((event) => cardTemplate(event)).join("")}
    </section>
  `;
}

function renderProfile() {
  const total = appState.events.length;
  const live = appState.events.filter((event) => event.isLive).length;
  const cities = new Set(appState.events.map((event) => event.city)).size;

  els.root.innerHTML = `
    <h2 class="section-title">Profile & Stats</h2>
    <section class="profile-grid">
      <article class="stat"><div class="label">Saved</div><div class="value">${appState.saved.length}</div></article>
      <article class="stat"><div class="label">Total Events</div><div class="value">${total}</div></article>
      <article class="stat"><div class="label">Live Now</div><div class="value">${live}</div></article>
      <article class="stat"><div class="label">Cities</div><div class="value">${cities}</div></article>
    </section>
  `;
}

function cardTemplate(event) {
  return `
    <article class="card" data-open="${event.id}">
      <h3>${escapeHtml(event.title)}</h3>
      <div class="meta">
        <span>${escapeHtml(event.speakerName)}</span>
        <span>${formatRange(event.start, event.end)} � ${escapeHtml(event.cityName)}</span>
        <span>${escapeHtml(event.timing)}</span>
      </div>
      <div class="chips">
        <span class="chip ${event.isLive ? "live" : ""}">${event.isLive ? "Live" : event.typeName}</span>
        ${event.isFree ? '<span class="chip free">Free</span>' : ""}
      </div>
      <div style="margin-top:12px;">
        <button class="save-btn ${isSaved(event.id) ? "active" : ""}" data-save="${event.id}">${isSaved(event.id) ? "Saved" : "Save"}</button>
      </div>
    </article>
  `;
}

function openEventDialog(event) {
  const speaker = appState.speakers.find((item) => item.id === event.speakerId);

  els.dialog.innerHTML = `
    <div class="modal">
      <button class="close" id="closeDialog" aria-label="Close"><i data-lucide="x"></i></button>
      <h2>${escapeHtml(event.title)}</h2>
      <p>${escapeHtml(event.cityName)} � ${escapeHtml(event.venue)}</p>
      <p><strong>Date:</strong> ${formatRange(event.start, event.end)}</p>
      <p><strong>Time:</strong> ${escapeHtml(event.timing)}</p>
      <p><strong>Speaker:</strong> ${escapeHtml(event.speakerName)}</p>
      <div class="chips">
        <span class="chip ${event.isLive ? "live" : ""}">${event.isLive ? "Live" : event.typeName}</span>
        ${event.isFree ? '<span class="chip free">Free Entry</span>' : ""}
        ${event.hasLiveStream ? '<span class="chip">Livestream</span>' : ""}
      </div>
      <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
        <button class="save-btn ${isSaved(event.id) ? "active" : ""}" data-save="${event.id}">${isSaved(event.id) ? "Saved" : "Save"}</button>
        ${event.link ? `<a class="save-btn" style="text-decoration:none;" href="${event.link}" target="_blank" rel="noopener">Open Source</a>` : ""}
      </div>
      ${speaker ? `<p style="margin-top:12px; color:#6f5a47;">${escapeHtml(speaker.bio || "")}</p>` : ""}
    </div>
  `;

  els.dialog.showModal();

  els.dialog.querySelector("#closeDialog")?.addEventListener("click", () => els.dialog.close());
  els.dialog.querySelector("[data-save]")?.addEventListener("click", (e) => {
    toggleSave(e.currentTarget.dataset.save);
    renderView();
    els.dialog.close();
    openEventDialog(event);
  });

  refreshIcons();
}

function getFilteredEvents() {
  return appState.events.filter((event) => {
    const matchesCity = appState.city === "all" || event.city === appState.city;
    const matchesType = appState.type === "all" || event.type === appState.type;
    const q = appState.query;
    const matchesQuery =
      !q ||
      event.title.toLowerCase().includes(q) ||
      event.cityName.toLowerCase().includes(q) ||
      event.speakerName.toLowerCase().includes(q);
    return matchesCity && matchesType && matchesQuery;
  });
}

function getSortedEvents(events) {
  const list = [...events];

  if (appState.sort === "live") {
    list.sort((a, b) => Number(b.isLive) - Number(a.isLive) || dateNum(a.start) - dateNum(b.start));
    return list;
  }

  if (appState.sort === "city") {
    list.sort((a, b) => a.cityName.localeCompare(b.cityName));
    return list;
  }

  list.sort((a, b) => dateNum(a.start) - dateNum(b.start));
  return list;
}

function groupByMonth(events) {
  return events.reduce((acc, event) => {
    const key = new Date(event.start).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});
}

function toggleSave(id) {
  if (isSaved(id)) {
    appState.saved = appState.saved.filter((item) => item !== id);
  } else {
    appState.saved = [...appState.saved, id];
  }
  saveState();
}

function isSaved(id) {
  return appState.saved.includes(id);
}

function updateNav() {
  els.nav.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === appState.view);
  });
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      view: appState.view,
      city: appState.city,
      type: appState.type,
      sort: appState.sort,
      saved: appState.saved,
    })
  );
}

function restoreState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed) return;
    appState.view = parsed.view || appState.view;
    appState.city = parsed.city || appState.city;
    appState.type = parsed.type || appState.type;
    appState.sort = parsed.sort || appState.sort;
    appState.saved = Array.isArray(parsed.saved) ? parsed.saved : [];
  } catch {
    appState.saved = [];
  }
}

function refreshIcons() {
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function formatRange(start, end) {
  const s = formatShortDate(start);
  const e = formatShortDate(end);
  return s === e ? s : `${s} - ${e}`;
}

function formatShortDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function dateNum(date) {
  return new Date(date).getTime();
}

function pretty(raw) {
  return raw
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


