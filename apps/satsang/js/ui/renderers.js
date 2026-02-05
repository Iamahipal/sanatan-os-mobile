import { escapeHtml, formatDate, formatDateRange } from "../core/utils.js";

export function renderApp(state, refs) {
  renderHero(state, refs.hero);
  renderControls(state, refs);
  renderTabs(state, refs.tabs);
  renderView(state, refs.root);
}

export function renderDialog(event, dialog, isSaved, isReminderSet) {
  dialog.innerHTML = `
    <article class="modal">
      <div class="modal-top">
        <h2>${escapeHtml(event.title)}</h2>
        <button class="modal-close" data-action="close-dialog" aria-label="Close">
          <span class="material-symbols-rounded" aria-hidden="true">close</span>
        </button>
      </div>
      <p>${escapeHtml(event.cityName)} | ${escapeHtml(event.venue)}</p>
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
        <button class="action-btn ${isReminderSet ? "active" : ""}" data-action="set-reminder" data-id="${event.id}">
          ${isReminderSet ? "Reminder Set" : "Set Reminder"}
        </button>
        ${event.link ? `<a class="action-btn" style="text-decoration:none;" href="${event.link}" target="_blank" rel="noopener">Open Source</a>` : ""}
      </div>
      ${event.speakerBio ? `<p style="margin-top:12px; color:#6e5a49;">${escapeHtml(event.speakerBio)}</p>` : ""}
    </article>
  `;
}

function renderHero(state, hero) {
  const featured = state.sortedEvents.find((event) => event.isLive) || state.sortedEvents[0];
  if (!featured) {
    hero.innerHTML = "<h2>No events available</h2><p>Add or sync event data to get started.</p>";
    return;
  }

  const badge = featured.isLive ? "Live Now" : "Top Katha Vachak Event";

  hero.innerHTML = `
    <p class="hero-kicker">${badge}</p>
    <h2>${escapeHtml(featured.title)}</h2>
    <p>${escapeHtml(featured.speakerName)} | ${escapeHtml(featured.cityName)}</p>
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

  const liveNow = list.filter((event) => event.isLive);
  const upcoming = getUpcomingEvents(list);

  root.innerHTML = `
    <section class="live-section">
      <h2 class="section-title">Live Feed</h2>
      ${
        liveNow.length
          ? `<section class="live-rail">
              ${liveNow
                .map(
                  (event) => `
                    <article class="live-rail-card" data-action="open-event" data-id="${event.id}">
                      ${event.thumbnail ? `<img class="live-thumb" src="${escapeHtml(event.thumbnail)}" alt="${escapeHtml(event.title)}">` : ""}
                      <p class="live-label">Live Right Now</p>
                      <h3>${escapeHtml(event.title)}</h3>
                      <p>${escapeHtml(event.speakerName)} | ${escapeHtml(event.cityName)}</p>
                      <div class="chips">
                        <span class="chip live">Live</span>
                        ${isStartingSoon(event) ? '<span class="chip chip-soon">Starting Soon</span>' : ""}
                        <span class="chip">${formatDateRange(event.start, event.end)}</span>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </section>`
          : '<div class="empty">No live satsang at the moment. Upcoming events are listed below.</div>'
      }
    </section>
    <section>
      <h2 class="section-title">Upcoming Events</h2>
      <section class="grid">${upcoming.map((event) => eventCard(event, state.savedSet.has(event.id), state.remindersSet.has(event.id))).join("")}</section>
    </section>
  `;
}

function renderCalendar(state, root) {
  const { months, grouped } = getThreeMonthCalendar(state.sortedEvents);

  root.innerHTML = `
    <h2 class="section-title">3-Month Calendar</h2>
    <section class="timeline">
      ${months
        .map(
          (month) => `
            <article class="month">
              <h3>${escapeHtml(month)}</h3>
              ${
                grouped[month]?.length
                  ? grouped[month]
                      .map(
                        (event) => `
                          <div class="row" data-action="open-event" data-id="${event.id}">
                            <div class="date">${formatDate(event.start)}</div>
                            <div>
                              <strong>${escapeHtml(event.title)}</strong><br>
                              <span>${escapeHtml(event.cityName)} | ${escapeHtml(event.venue)}</span><br>
                              <span>${escapeHtml(event.speakerName)}</span>
                            </div>
                            <div class="row-actions">
                              <button class="action-btn ${state.savedSet.has(event.id) ? "active" : ""}" data-action="toggle-save" data-id="${event.id}">
                                ${state.savedSet.has(event.id) ? "Saved" : "Save"}
                              </button>
                              <button class="action-btn ${state.remindersSet.has(event.id) ? "active" : ""}" data-action="set-reminder" data-id="${event.id}">
                                ${state.remindersSet.has(event.id) ? "Reminder Set" : "Reminder"}
                              </button>
                            </div>
                          </div>
                        `
                      )
                      .join("")
                  : '<p class="month-empty">No events scheduled.</p>'
              }
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
    <section class="grid">${list.map((event) => eventCard(event, true, state.remindersSet.has(event.id))).join("")}</section>
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

function eventCard(event, saved, reminderSet) {
  const soon = isStartingSoon(event);

  return `
    <article class="card card-tight" data-action="open-event" data-id="${event.id}">
      ${
        event.thumbnail
          ? `<img class="event-thumb" src="${escapeHtml(event.thumbnail)}" alt="${escapeHtml(event.title)}">`
          : '<div class="event-thumb event-thumb-fallback" aria-hidden="true"></div>'
      }
      <div class="card-topline">
        <span class="card-speaker">${escapeHtml(event.speakerName)}</span>
        <span class="card-date">${formatDate(event.start)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(event.title)}</h3>
      <div class="meta">
        <span>${escapeHtml(event.cityName)} | ${escapeHtml(event.venue)}</span>
        <span>${escapeHtml(event.timing)} | ${formatDateRange(event.start, event.end)}</span>
      </div>
      <div class="chips">
        <span class="chip ${event.isLive ? "live" : ""}">${event.isLive ? "Live" : event.typeLabel}</span>
        ${soon ? '<span class="chip chip-soon">Starting Soon</span>' : ""}
        ${event.isFree ? '<span class="chip free">Free</span>' : ""}
      </div>
      <div class="card-actions">
        <button class="action-btn ${saved ? "active" : ""}" data-action="toggle-save" data-id="${event.id}">
          ${saved ? "Saved" : "Save"}
        </button>
        <button class="action-btn ${reminderSet ? "active" : ""}" data-action="set-reminder" data-id="${event.id}">
          ${reminderSet ? "Reminder Set" : "Set Reminder"}
        </button>
      </div>
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

function humanize(value) {
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getUpcomingEvents(list) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const threshold = today.getTime();

  const future = list.filter((event) => !event.isLive && event.dateNum >= threshold);
  if (future.length) return future;

  return list.filter((event) => !event.isLive);
}

function getThreeMonthCalendar(list) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 3, 0, 23, 59, 59, 999);

  const months = [0, 1, 2].map((offset) =>
    new Date(now.getFullYear(), now.getMonth() + offset, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  );

  const inWindow = list.filter((event) => {
    const date = new Date(event.start).getTime();
    return Number.isFinite(date) && date >= start.getTime() && date <= end.getTime();
  });

  const grouped = groupByMonth(inWindow);
  return { months, grouped };
}

function isStartingSoon(event) {
  if (!event?.start || event.isLive) return false;
  const now = Date.now();
  const start = new Date(event.start).setHours(0, 0, 0, 0);
  const diff = start - now;
  return diff >= 0 && diff <= 48 * 60 * 60 * 1000;
}
