import { escapeHtml, formatDate, formatDateRange } from "../core/utils.js";

export function renderApp(state, refs) {
  renderHero(state, refs.hero);
  renderControls(state, refs);
  renderTabs(state, refs.tabs);
  renderView(state, refs.root);
  refreshIcons();
}

export function renderDialog(event, dialog, isSaved) {
  dialog.innerHTML = `
    <article class="modal">
      <div class="modal-top">
        <h2>${escapeHtml(event.title)}</h2>
        <button class="modal-close" data-action="close-dialog" aria-label="Close">
          <i data-lucide="x"></i>
        </button>
      </div>
      <p>${escapeHtml(event.cityName)} · ${escapeHtml(event.venue)}</p>
      <p><strong>Date:</strong> ${formatDateRange(event.start, event.end)}</p>
      <p><strong>Time:</strong> ${escapeHtml(event.timing)}</p>
      <p><strong>Speaker:</strong> ${escapeHtml(event.speakerName)}</p>
      <div class="chips">
        <span class="chip ${event.isLive ? "live" : ""}">${event.isLive ? "Live" : event.typeLabel}</span>
        ${event.isFree ? '<span class="chip free">Free</span>' : ""}
        ${event.hasLiveStream ? '<span class="chip">Livestream</span>' : ""}
      </div>
      <div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px;">
        <button class="action-btn ${isSaved ? "active" : ""}" data-action="toggle-save" data-id="${event.id}">
          ${isSaved ? "Saved" : "Save"}
        </button>
        ${event.link ? `<a class="action-btn" style="text-decoration:none;" href="${event.link}" target="_blank" rel="noopener">Open Source</a>` : ""}
      </div>
      ${event.speakerBio ? `<p style="margin-top:12px; color:#6e5a49;">${escapeHtml(event.speakerBio)}</p>` : ""}
    </article>
  `;
  refreshIcons();
}

function renderHero(state, hero) {
  const featured = state.sortedEvents[0];
  if (!featured) {
    hero.innerHTML = "<h2>No events available</h2><p>Add or sync event data to get started.</p>";
    return;
  }

  hero.innerHTML = `
    <h2>${escapeHtml(featured.title)}</h2>
    <p>${escapeHtml(featured.speakerName)} · ${escapeHtml(featured.cityName)}</p>
    <div class="hero-tags">
      <span>${formatDateRange(featured.start, featured.end)}</span>
      <span>${escapeHtml(featured.timing)}</span>
      <span>${featured.isLive ? "Live now" : featured.typeLabel}</span>
    </div>
  `;
}

function renderControls(state, refs) {
  refs.search.value = state.query;
  refs.sort.value = state.sort;
  refs.city.innerHTML = optionsHtml(state.cityOptions, state.city, "All cities");
  refs.type.innerHTML = optionsHtml(state.typeOptions, state.type, "All types");
}

function renderTabs(state, tabs) {
  tabs.querySelectorAll("button[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === state.view);
  });
}

function renderView(state, root) {
  if (state.loading) {
    root.innerHTML = '<div class="empty">Loading events...</div>';
    return;
  }

  if (state.error) {
    root.innerHTML = `<div class="empty">${escapeHtml(state.error)}</div>`;
    return;
  }

  if (state.view === "discover") {
    renderDiscover(state, root);
    return;
  }

  if (state.view === "calendar") {
    renderCalendar(state, root);
    return;
  }

  if (state.view === "saved") {
    renderSaved(state, root);
    return;
  }

  renderProfile(state, root);
}

function renderDiscover(state, root) {
  const list = state.sortedEvents;
  if (!list.length) {
    root.innerHTML = '<div class="empty">No results for the current filters.</div>';
    return;
  }

  root.innerHTML = `
    <h2 class="section-title">Upcoming and Live</h2>
    <section class="grid">${list.map((event) => eventCard(event, state.savedSet.has(event.id))).join("")}</section>
  `;
}

function renderCalendar(state, root) {
  const list = state.sortedEvents;
  if (!list.length) {
    root.innerHTML = '<div class="empty">No events to show in timeline.</div>';
    return;
  }

  const grouped = groupByMonth(list);

  root.innerHTML = `
    <h2 class="section-title">Timeline</h2>
    <section class="timeline">
      ${Object.entries(grouped)
        .map(
          ([month, events]) => `
            <article class="month">
              <h3>${escapeHtml(month)}</h3>
              ${events
                .map(
                  (event) => `
                    <div class="row" data-action="open-event" data-id="${event.id}">
                      <div class="date">${formatDate(event.start)}</div>
                      <div>
                        <strong>${escapeHtml(event.title)}</strong><br>
                        <span>${escapeHtml(event.cityName)} · ${escapeHtml(event.speakerName)}</span>
                      </div>
                      <button class="action-btn ${state.savedSet.has(event.id) ? "active" : ""}" data-action="toggle-save" data-id="${event.id}">
                        ${state.savedSet.has(event.id) ? "Saved" : "Save"}
                      </button>
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

function renderSaved(state, root) {
  const list = state.sortedEvents.filter((event) => state.savedSet.has(event.id));

  if (!list.length) {
    root.innerHTML = '<div class="empty">No saved events yet.</div>';
    return;
  }

  root.innerHTML = `
    <h2 class="section-title">Saved Events</h2>
    <section class="grid">${list.map((event) => eventCard(event, true)).join("")}</section>
  `;
}

function renderProfile(state, root) {
  const live = state.events.filter((event) => event.isLive).length;
  const cities = new Set(state.events.map((event) => event.city)).size;

  root.innerHTML = `
    <h2 class="section-title">Profile</h2>
    <section class="stats">
      <article class="stat"><div class="label">Saved</div><div class="value">${state.saved.length}</div></article>
      <article class="stat"><div class="label">Total Events</div><div class="value">${state.events.length}</div></article>
      <article class="stat"><div class="label">Live Now</div><div class="value">${live}</div></article>
      <article class="stat"><div class="label">Cities</div><div class="value">${cities}</div></article>
    </section>
  `;
}

function eventCard(event, saved) {
  return `
    <article class="card" data-action="open-event" data-id="${event.id}">
      <h3>${escapeHtml(event.title)}</h3>
      <div class="meta">
        <span>${escapeHtml(event.speakerName)}</span>
        <span>${formatDateRange(event.start, event.end)} · ${escapeHtml(event.cityName)}</span>
        <span>${escapeHtml(event.timing)}</span>
      </div>
      <div class="chips">
        <span class="chip ${event.isLive ? "live" : ""}">${event.isLive ? "Live" : event.typeLabel}</span>
        ${event.isFree ? '<span class="chip free">Free</span>' : ""}
      </div>
      <button class="action-btn ${saved ? "active" : ""}" data-action="toggle-save" data-id="${event.id}">
        ${saved ? "Saved" : "Save"}
      </button>
    </article>
  `;
}

function optionsHtml(list, selected, allLabel) {
  return ["all", ...list]
    .map((value) => {
      const label = value === "all" ? allLabel : humanize(value);
      const selectedAttr = value === selected ? "selected" : "";
      return `<option value="${escapeHtml(value)}" ${selectedAttr}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

function groupByMonth(list) {
  return list.reduce((acc, event) => {
    const key = new Date(event.start).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});
}

function refreshIcons() {
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function humanize(value) {
  return String(value).split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

