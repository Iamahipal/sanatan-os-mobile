import { escapeHtml, formatDate, formatDateRange } from "../core/utils.js";

export function renderApp(state, refs) {
  renderControls(state, refs);
  if (refs.filters) {
    refs.filters.hidden = state.view !== "discover";
  }
  renderTabs(state, refs.tabs);
  renderView(state, refs.root);
}

export function renderDialog(event, dialog, isSaved, isReminderSet) {
  const mapsQuery = encodeURIComponent(`${event.venue}, ${event.cityName}`);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

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
        <a class="action-btn" style="text-decoration:none;" href="${mapsLink}" target="_blank" rel="noopener">Open in Maps</a>
        ${event.link ? `<a class="action-btn" style="text-decoration:none;" href="${event.link}" target="_blank" rel="noopener">Open Source</a>` : ""}
      </div>
      ${event.speakerBio ? `<p style="margin-top:12px; color:#6e5a49;">${escapeHtml(event.speakerBio)}</p>` : ""}
    </article>
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
    root.innerHTML = '<div class="empty">No matches. Try clearing filters or search.</div>';
    return;
  }

  const { liveToday, upcoming, past } = splitEventBuckets(list);

  root.innerHTML = `
    <section class="live-section">
      <h2 class="section-title">Live Now</h2>
      ${
        liveToday.length
          ? `<section class="live-rail">
              ${liveToday
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
          : '<div class="empty">No live satsang right now.</div>'
      }
    </section>
    <section>
      <h2 class="section-title">Upcoming</h2>
      <section class="grid">${upcoming.map((event) => eventCard(event, state.savedSet.has(event.id), state.remindersSet.has(event.id))).join("")}</section>
    </section>
    ${
      past.length
        ? `<section>
            <h2 class="section-title">Past</h2>
            <section class="grid">${past.map((event) => eventCard(event, state.savedSet.has(event.id), state.remindersSet.has(event.id))).join("")}</section>
          </section>`
        : ""
    }
  `;
}

function renderCalendar(state, root) {
  const list = state.calendarSavedOnly
    ? state.sortedEvents.filter((event) => state.savedSet.has(event.id))
    : state.sortedEvents;
  const months = getThreeMonthCalendar(list);

  root.innerHTML = `
    <h2 class="section-title">Calendar</h2>
    <p class="calendar-subtitle">Rolling 3‑month view: this month and the next two.</p>
    <div class="calendar-toolbar">
      <button class="calendar-tool" data-action="calendar-today" type="button">Today</button>
      <button class="calendar-tool ${state.calendarSavedOnly ? "active" : ""}" data-action="calendar-saved" type="button">
        ${state.calendarSavedOnly ? "Saved Only" : "All Events"}
      </button>
    </div>
    <p class="calendar-help">Tip: tap an event for details. Use Saved Only to focus.</p>
    <div class="calendar-jump">
      ${months
        .map(
          (month, index) =>
            `<button class="calendar-jump-btn ${index === 0 ? "active" : ""}" data-action="calendar-jump" data-month-index="${index}">${escapeHtml(month.shortLabel)}</button>`
        )
        .join("")}
    </div>
    <section class="calendar-stack">
      ${months.map((month, index) => monthCard(month, index, state.savedSet, state.remindersSet)).join("")}
    </section>
  `;
}

function renderSaved(state, root) {
  const list = state.sortedEvents.filter((event) => state.savedSet.has(event.id));

  if (!list.length) {
    root.innerHTML = '<div class="empty">No saved events yet. Save from Discover.</div>';
    return;
  }

  root.innerHTML = `
    <h2 class="section-title">Saved</h2>
    <section class="grid">${list.map((event) => eventCard(event, true, state.remindersSet.has(event.id))).join("")}</section>
  `;
}

function renderProfile(state, root) {
  const live = state.events.filter((event) => event.isLive).length;
  const cities = new Set(state.events.map((event) => event.city)).size;

  root.innerHTML = `
    <h2 class="section-title">Profile</h2>
    <p class="calendar-subtitle">Your activity snapshot.</p>
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

function getThreeMonthCalendar(list) {
  const now = new Date();
  return [0, 1, 2].map((offset) => buildMonthView(now, offset, list));
}

function isStartingSoon(event) {
  if (!event?.start || event.isLive) return false;
  const now = Date.now();
  const start = new Date(event.start).setHours(0, 0, 0, 0);
  const diff = start - now;
  return diff >= 0 && diff <= 48 * 60 * 60 * 1000;
}

function splitEventBuckets(list) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartNum = todayStart.getTime();

  const liveToday = list.filter((event) => event.isLive);
  const nonLive = list.filter((event) => !event.isLive);
  const upcoming = nonLive.filter((event) => event.dateNum >= todayStartNum);
  const past = nonLive.filter((event) => event.dateNum < todayStartNum).sort((a, b) => b.dateNum - a.dateNum);

  return {
    liveToday,
    upcoming,
    past,
  };
}

function monthCard(month, monthIndex, savedSet, remindersSet) {
  return `
    <article class="month-card" data-calendar-month="${monthIndex}">
      <div class="month-card-head">
        <h3>${escapeHtml(month.label)}</h3>
        <span class="month-count">${month.events.length ? `${month.events.length} events` : "No events"}</span>
      </div>
      <div class="weekday-row">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<span>${d}</span>`).join("")}</div>
      <div class="month-grid">
        ${month.days.map((day) => dayCell(day)).join("")}
      </div>
      <div class="month-agenda">
        ${
          month.events.length
            ? month.events
                .map((event) => {
                  const day = new Date(event.start).getDate();
                  return `
                    <div class="agenda-row" data-action="open-event" data-id="${event.id}">
                      <div class="agenda-day">${day}</div>
                      <div class="agenda-main">
                        <strong>${escapeHtml(event.title)}</strong>
                        <span>${escapeHtml(event.cityName)} | ${escapeHtml(event.venue)}</span>
                      </div>
                      <div class="agenda-actions">
                        <button class="action-btn ${savedSet.has(event.id) ? "active" : ""}" data-action="toggle-save" data-id="${event.id}">
                          ${savedSet.has(event.id) ? "Saved" : "Save"}
                        </button>
                        <button class="action-btn ${remindersSet.has(event.id) ? "active" : ""}" data-action="set-reminder" data-id="${event.id}">
                          ${remindersSet.has(event.id) ? "Reminder Set" : "Set Reminder"}
                        </button>
                      </div>
                    </div>
                  `;
                })
                .join("")
            : '<p class="month-empty">No events scheduled.</p>'
        }
      </div>
    </article>
  `;
}

function dayCell(day) {
  if (!day.inMonth) return '<div class="day-cell day-out"></div>';
  const classes = ["day-cell"];
  if (day.hasEvents) classes.push("day-has-events");
  if (day.isToday) classes.push("day-today");
  return `
    <div class="${classes.join(" ")}" ${day.isToday ? 'data-calendar-today="true"' : ""}>
      <span class="day-num">${day.date.getDate()}</span>
      ${day.eventCount > 0 ? `<span class="day-dot">${day.eventCount}</span>` : ""}
    </div>
  `;
}

function buildMonthView(now, offset, events) {
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const monthStart = new Date(first.getFullYear(), first.getMonth(), 1);
  const monthEnd = new Date(first.getFullYear(), first.getMonth() + 1, 0, 23, 59, 59, 999);
  const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const monthEvents = events
    .filter((event) => event.dateNum >= monthStart.getTime() && event.dateNum <= monthEnd.getTime())
    .sort((a, b) => a.dateNum - b.dateNum);

  const eventCountByDay = new Map();
  monthEvents.forEach((event) => {
    const key = new Date(event.start).getDate();
    eventCountByDay.set(key, (eventCountByDay.get(key) || 0) + 1);
  });

  const today = new Date();
  const daysInMonth = monthEnd.getDate();
  const leading = monthStart.getDay();
  const days = [];

  for (let i = 0; i < leading; i += 1) {
    days.push({ inMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(first.getFullYear(), first.getMonth(), d);
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    const eventCount = eventCountByDay.get(d) || 0;
    days.push({
      inMonth: true,
      date,
      hasEvents: eventCount > 0,
      eventCount,
      isToday,
    });
  }

  while (days.length % 7 !== 0) {
    days.push({ inMonth: false });
  }

  return {
    label,
    shortLabel: first.toLocaleDateString("en-US", { month: "short" }),
    events: monthEvents,
    days,
  };
}
