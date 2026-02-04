function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statCards(stats = {}) {
  const cards = [];

  if (stats.age_years) {
    cards.push({ label: "Approx. Age", value: `${stats.age_years}+ years` });
  }
  if (stats.current_temple_built) {
    cards.push({ label: "Current Temple", value: `${stats.current_temple_built}` });
  }
  if (stats.daily_visitors) {
    cards.push({ label: "Daily Visitors", value: stats.daily_visitors });
  }
  if (stats.reconstructions) {
    cards.push({ label: "Rebuild Cycles", value: `${stats.reconstructions}` });
  }

  return cards.slice(0, 4)
    .map(
      (item) => `
      <article class="md3-stat">
        <p class="md3-label">${escapeHtml(item.label)}</p>
        <p class="md3-value">${escapeHtml(item.value)}</p>
      </article>
    `
    )
    .join("");
}

function factsList(facts = []) {
  if (!facts.length) {
    return "<p class=\"muted\">No facts available for this temple yet.</p>";
  }

  return facts
    .slice(0, 6)
    .map(
      (fact) => `
      <article class="md3-list-card">
        <p class="eyebrow">${escapeHtml(fact.category || "Insight")}</p>
        <h4>${escapeHtml(fact.title || "Untitled")}</h4>
        <p>${escapeHtml(fact.hook || fact.full_story || "")}</p>
      </article>
    `
    )
    .join("");
}

function mediaGrid(media = []) {
  if (!media.length) {
    return "<p class=\"muted\">No gallery media available.</p>";
  }

  return media
    .slice(0, 6)
    .map(
      (item) => `
      <figure class="media-item">
        <img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.caption || "Temple image")}" loading="lazy" />
        <figcaption>${escapeHtml(item.caption || "Temple view")}</figcaption>
      </figure>
    `
    )
    .join("");
}

export function renderShell(content, title = "Sanatan Temples") {
  return `
    <main class="app-shell" aria-live="polite">
      <header class="top-app-bar">
        <h1>${escapeHtml(title)}</h1>
      </header>
      ${content}
    </main>
  `;
}

export function renderHomeView({ query, category, temples, loading, error }) {
  const filters = [
    { key: "all", label: "All" },
    { key: "jyotirlinga", label: "Jyotirlinga" },
    { key: "other", label: "Other" },
  ];

  const chips = filters
    .map(
      (filter) => `
      <button class="chip ${category === filter.key ? "active" : ""}" data-action="filter" data-value="${filter.key}">
        ${escapeHtml(filter.label)}
      </button>`
    )
    .join("");

  const body = (() => {
    if (loading) {
      return `<section class="state-card"><p>Loading temple catalog...</p></section>`;
    }
    if (error) {
      return `<section class="state-card error"><p>${escapeHtml(error)}</p></section>`;
    }
    if (!temples.length) {
      return `<section class="state-card"><p>No temples match your current search.</p></section>`;
    }

    return temples
      .map(
        (temple) => `
        <article class="temple-card" data-action="open-temple" data-id="${escapeHtml(temple.id)}">
          <img src="${escapeHtml(temple.thumbnail)}" alt="${escapeHtml(temple.name)}" loading="lazy" />
          <div class="temple-card__content">
            <p class="eyebrow">${escapeHtml(temple.location || "India")}</p>
            <h3>${escapeHtml(temple.name)}</h3>
            <p class="local-name">${escapeHtml(temple.name_local || "")}</p>
            <p>${escapeHtml(temple.short_desc || "")}</p>
          </div>
        </article>
      `
      )
      .join("");
  })();

  return `
    <section class="search-panel">
      <label for="search" class="search-label">Search</label>
      <input id="search" data-action="search" type="search" value="${escapeHtml(query)}" placeholder="Search by temple, location, or deity" autocomplete="off" />
      <div class="chip-row">${chips}</div>
    </section>
    <section class="content-list">${body}</section>
  `;
}

export function renderTempleView({ temple, bundle, loading, error }) {
  if (loading) {
    return `
      <section class="state-card"><p>Loading temple details...</p></section>
    `;
  }

  if (error || !temple) {
    return `
      <section class="state-card error">
        <p>${escapeHtml(error || "Temple not found.")}</p>
        <button class="md3-button" data-action="go-home">Back to temples</button>
      </section>
    `;
  }

  const manifest = bundle?.manifest || {};
  const deity = bundle?.deity || {};
  const whyVisit = bundle?.whyVisit || {};

  const heroImage = manifest.hero_image || temple.thumbnail;
  const location = manifest?.location?.city
    ? `${manifest.location.city}, ${manifest.location.state || ""}`
    : temple.location || "India";

  const benefits = (whyVisit.spiritual_benefits || [])
    .slice(0, 3)
    .map(
      (benefit) => `
      <article class="md3-list-card">
        <h4>${escapeHtml(benefit.blessing || "Spiritual Benefit")}</h4>
        <p>${escapeHtml(benefit.significance || "")}</p>
      </article>
    `
    )
    .join("");

  return `
    <nav class="detail-actions">
      <button class="icon-button" data-action="go-home" aria-label="Back to temple list">arrow_back</button>
      <button class="icon-button" data-action="scroll-top" aria-label="Scroll to top">north</button>
    </nav>

    <article class="hero-card">
      <img src="${escapeHtml(heroImage)}" alt="${escapeHtml(temple.name)}" />
      <div class="hero-overlay">
        <p class="eyebrow">${escapeHtml(location)}</p>
        <h2>${escapeHtml(manifest.name || temple.name)}</h2>
        <p class="local-name">${escapeHtml(manifest.name_local || temple.name_local || "")}</p>
      </div>
    </article>

    <section class="section-card">
      <h3>Overview</h3>
      <p>${escapeHtml(manifest.description || temple.short_desc || "")}</p>
      <div class="md3-grid">${statCards(manifest.stats || {})}</div>
    </section>

    <section class="section-card">
      <h3>Deity and Meaning</h3>
      <p><strong>${escapeHtml(deity.name || manifest?.deity?.form || "Lord Shiva")}</strong></p>
      <p>${escapeHtml(deity.meaning || manifest?.deity?.mythology_link || "")}</p>
      <p>${escapeHtml(deity?.mythology?.origin_story || "")}</p>
    </section>

    <section class="section-card">
      <h3>Why Visit</h3>
      <p>${escapeHtml(whyVisit.spiritual_invitation || "")}</p>
      <div class="stack">${benefits || "<p class=\"muted\">No spiritual benefits listed.</p>"}</div>
    </section>

    <section class="section-card">
      <h3>Key Facts</h3>
      <div class="stack">${factsList(bundle?.facts)}</div>
    </section>

    <section class="section-card">
      <h3>Gallery</h3>
      <div class="media-grid">${mediaGrid(bundle?.media)}</div>
    </section>
  `;
}
