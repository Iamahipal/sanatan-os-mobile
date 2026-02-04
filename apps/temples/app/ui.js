import { t, templeDisplayName } from "./i18n.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statCards(stats = {}, locale = "en") {
  const cards = [];

  if (stats.age_years) cards.push({ label: t(locale, "approxAge"), value: `${stats.age_years}+ ${t(locale, "years")}` });
  if (stats.current_temple_built) cards.push({ label: t(locale, "currentTemple"), value: `${stats.current_temple_built}` });
  if (stats.daily_visitors) cards.push({ label: t(locale, "dailyVisitors"), value: stats.daily_visitors });
  if (stats.reconstructions) cards.push({ label: t(locale, "rebuildCycles"), value: `${stats.reconstructions}` });

  return cards.slice(0, 4).map((item) => `
    <article class="md3-stat">
      <p class="md3-label">${escapeHtml(item.label)}</p>
      <p class="md3-value">${escapeHtml(item.value)}</p>
    </article>
  `).join("");
}

function factsList(facts = [], locale = "en") {
  if (!facts.length) {
    return `<p class="muted">${escapeHtml(t(locale, "noFacts"))}</p>`;
  }

  return facts.slice(0, 6).map((fact) => `
    <article class="md3-list-card">
      <p class="eyebrow">${escapeHtml(fact.category || t(locale, "insight"))}</p>
      <h4>${escapeHtml(fact.title || "Untitled")}</h4>
      <p>${escapeHtml(fact.hook || fact.full_story || "")}</p>
    </article>
  `).join("");
}

function mediaGrid(media = [], locale = "en") {
  if (!media.length) {
    return `<p class="muted">${escapeHtml(t(locale, "noMedia"))}</p>`;
  }

  return media.slice(0, 8).map((item, index) => `
    <figure class="media-item">
      <img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.caption || t(locale, "templeImage"))}" loading="lazy" decoding="async" fetchpriority="${index < 2 ? "high" : "low"}" />
      <figcaption>${escapeHtml(item.caption || t(locale, "templeView"))}</figcaption>
    </figure>
  `).join("");
}

function plannerCard(planner, locale) {
  if (!planner || !planner.total) return "";

  const progressPercent = Math.round((planner.visited / planner.total) * 100);
  const nextTempleName = planner.nextTemple ? templeDisplayName(planner.nextTemple, locale) : "-";

  return `
    <section class="planner-card" aria-label="${escapeHtml(t(locale, "plannerTitle"))}">
      <div class="planner-top">
        <div>
          <p class="eyebrow">${escapeHtml(t(locale, "plannerTitle"))}</p>
          <h2>${escapeHtml(t(locale, "progress"))}: ${planner.visited}/${planner.total}</h2>
        </div>
        <span class="progress-pill">${progressPercent}%</span>
      </div>
      <p class="planner-next">${escapeHtml(t(locale, "nextTemple"))}: ${escapeHtml(nextTempleName)}</p>
      <div class="planner-actions">
        ${planner.nextTemple ? `<button class="md3-button tonal" data-action="continue-yatra" data-id="${escapeHtml(planner.nextTemple.id)}">${escapeHtml(t(locale, "continueYatra"))}</button>` : ""}
        <button class="md3-button text" data-action="reset-progress">${escapeHtml(t(locale, "resetProgress"))}</button>
      </div>
      <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPercent}">
        <span style="width: ${progressPercent}%"></span>
      </div>
    </section>
  `;
}

function heroShowcase(temples, locale) {
  const featured = temples[0];
  if (!featured) return "";

  return `
    <section class="hero-showcase ui-enter" data-action="open-temple" data-id="${escapeHtml(featured.id)}" aria-label="${escapeHtml(templeDisplayName(featured, locale))}">
      <img src="${escapeHtml(featured.thumbnail)}" alt="${escapeHtml(templeDisplayName(featured, locale))}" fetchpriority="high" />
      <div class="hero-mask"></div>
      <div class="hero-content">
        <p class="eyebrow">2026 Curated Pilgrimage</p>
        <h2>${escapeHtml(templeDisplayName(featured, locale))}</h2>
        <p>${escapeHtml(featured.short_desc || "")}</p>
      </div>
    </section>
  `;
}

export function renderShell(content, options) {
  const {
    title = "Sanatan Temples",
    locale = "en",
    textScale = "normal",
    highContrast = false,
    pwaUpdateReady = false,
    installPromptAvailable = false
  } = options || {};

  return `
    <a href="#main-content" class="skip-link">Skip to content</a>
    <main class="app-shell ${textScale === "large" ? "text-large" : ""} ${highContrast ? "high-contrast" : ""}" aria-live="polite">
      <div class="bg-orb bg-orb-one"></div>
      <div class="bg-orb bg-orb-two"></div>
      <header class="top-app-bar">
        <div>
          <p class="title-overline">SanatanOS</p>
          <h1>${escapeHtml(title)}</h1>
        </div>
        <div class="quick-controls" aria-label="Accessibility and language controls">
          <button class="tiny-btn" data-action="toggle-language" aria-label="${escapeHtml(t(locale, "language"))}">${locale.toUpperCase()}</button>
          <button class="tiny-btn" data-action="toggle-text-size" aria-label="${escapeHtml(t(locale, "textSize"))}">${escapeHtml(t(locale, textScale === "large" ? "textLarge" : "textNormal"))}</button>
          <button class="tiny-btn" data-action="toggle-contrast" aria-label="${escapeHtml(t(locale, "contrast"))}">${highContrast ? escapeHtml(t(locale, "contrastHigh")) : escapeHtml(t(locale, "contrastNormal"))}</button>
        </div>
      </header>
      ${installPromptAvailable ? `
      <section class="install-banner ui-enter" role="status" aria-live="polite">
        <p class="install-title">${escapeHtml(t(locale, "installApp"))}</p>
        <p class="install-copy">${escapeHtml(t(locale, "installAppHint"))}</p>
        <div class="update-actions">
          <button class="md3-button" data-action="prompt-install">${escapeHtml(t(locale, "installNow"))}</button>
          <button class="md3-button text" data-action="dismiss-install">${escapeHtml(t(locale, "installLater"))}</button>
        </div>
      </section>
      ` : ""}
      ${pwaUpdateReady ? `
      <section class="update-banner" role="status" aria-live="polite">
        <p>${escapeHtml(t(locale, "updateAvailable"))}</p>
        <div class="update-actions">
          <button class="md3-button" data-action="apply-update">${escapeHtml(t(locale, "updateNow"))}</button>
          <button class="md3-button text" data-action="dismiss-update">${escapeHtml(t(locale, "updateLater"))}</button>
        </div>
      </section>
      ` : ""}
      <div id="main-content">${content}</div>
    </main>
  `;
}

export function renderHomeView({
  locale = "en",
  query,
  category,
  temples,
  loading,
  error,
  savedTempleIds,
  visitedTempleIds,
  planner
}) {
  const filters = [
    { key: "all", label: t(locale, "filterAll") },
    { key: "jyotirlinga", label: t(locale, "filterJyotirlinga") },
    { key: "other", label: t(locale, "filterOther") },
    { key: "saved", label: t(locale, "filterSaved") }
  ];

  const chips = filters.map((filter) => `
    <button class="chip ${category === filter.key ? "active" : ""}" data-action="filter" data-value="${filter.key}" aria-pressed="${category === filter.key}">
      ${escapeHtml(filter.label)}
    </button>`).join("");

  const body = (() => {
    if (loading) return `<section class="state-card"><p>${escapeHtml(t(locale, "loadingCatalog"))}</p></section>`;
    if (error) return `<section class="state-card error"><p>${escapeHtml(error)}</p></section>`;
    if (!temples.length) {
      const emptyText = category === "saved" ? t(locale, "emptySaved") : t(locale, "noResults");
      return `<section class="state-card"><p>${escapeHtml(emptyText)}</p></section>`;
    }

    return temples.map((temple, index) => {
      const isSaved = savedTempleIds.has(temple.id);
      const isVisited = visitedTempleIds.has(temple.id);

      return `
      <article class="temple-card ui-enter" data-action="open-temple" data-id="${escapeHtml(temple.id)}" aria-label="${escapeHtml(templeDisplayName(temple, locale))}">
        <img src="${escapeHtml(temple.thumbnail)}" alt="${escapeHtml(templeDisplayName(temple, locale))}" loading="lazy" decoding="async" fetchpriority="${index === 0 ? "high" : "low"}" />
        <div class="temple-card__content">
          <p class="eyebrow">${escapeHtml(temple.location || "India")}</p>
          <h3>${escapeHtml(templeDisplayName(temple, locale))}</h3>
          <p>${escapeHtml(temple.short_desc || "")}</p>
          <div class="card-actions">
            <button class="mini-chip ${isSaved ? "active" : ""}" data-action="toggle-save" data-id="${escapeHtml(temple.id)}">${escapeHtml(t(locale, isSaved ? "bookmarked" : "save"))}</button>
            <button class="mini-chip ${isVisited ? "active" : ""}" data-action="toggle-visited" data-id="${escapeHtml(temple.id)}">${escapeHtml(t(locale, isVisited ? "visited" : "markVisited"))}</button>
          </div>
        </div>
      </article>
    `;
    }).join("");
  })();

  return `
    ${heroShowcase(temples, locale)}
    <section class="home-layout">
      <div class="home-sidebar">
        ${plannerCard(planner, locale)}
        <section class="search-panel ui-enter">
          <label for="search" class="search-label">${escapeHtml(t(locale, "searchLabel"))}</label>
          <input id="search" data-action="search" type="search" value="${escapeHtml(query)}" placeholder="${escapeHtml(t(locale, "searchPlaceholder"))}" autocomplete="off" />
          <div class="chip-row">${chips}</div>
        </section>
      </div>
      <section class="content-list">${body}</section>
    </section>
  `;
}

export function renderTempleView({ temple, bundle, loading, error, locale = "en", isSaved = false, isVisited = false }) {
  if (loading) return `<section class="state-card"><p>${escapeHtml(t(locale, "loadingTemple"))}</p></section>`;

  if (error || !temple) {
    return `
      <section class="state-card error">
        <p>${escapeHtml(error || t(locale, "notFoundTemple"))}</p>
        <button class="md3-button" data-action="go-home">${escapeHtml(t(locale, "backToTemples"))}</button>
      </section>
    `;
  }

  const manifest = bundle?.manifest || {};
  const deity = bundle?.deity || {};
  const whyVisit = bundle?.whyVisit || {};
  const qualityWarnings = Array.isArray(bundle?.qualityWarnings) ? bundle.qualityWarnings : [];

  const heroImage = manifest.hero_image || temple.thumbnail;
  const location = manifest?.location?.city ? `${manifest.location.city}, ${manifest.location.state || ""}` : temple.location || "India";

  const mapQuery = manifest?.location?.coords
    ? `${manifest.location.coords[0]},${manifest.location.coords[1]}`
    : `${manifest.name || temple.name}, ${location}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const benefits = (whyVisit.spiritual_benefits || []).slice(0, 3).map((benefit) => `
    <article class="md3-list-card">
      <h4>${escapeHtml(benefit.blessing || t(locale, "spiritualBenefit"))}</h4>
      <p>${escapeHtml(benefit.significance || "")}</p>
    </article>
  `).join("");

  return `
    <nav class="detail-actions" aria-label="Temple detail actions">
      <button class="icon-button" data-action="go-home" aria-label="${escapeHtml(t(locale, "backToTemples"))}">arrow_back</button>
      <button class="icon-button" data-action="scroll-top" aria-label="Scroll to top">north</button>
    </nav>

    <article class="hero-card">
      <img src="${escapeHtml(heroImage)}" alt="${escapeHtml(templeDisplayName(temple, locale))}" decoding="async" fetchpriority="high" />
      <div class="hero-mask"></div>
      <div class="hero-overlay">
        <p class="eyebrow">${escapeHtml(location)}</p>
        <h2>${escapeHtml(templeDisplayName({ ...temple, name: manifest.name || temple.name }, locale))}</h2>
        <p class="local-name">${escapeHtml(manifest.name_local || temple.name_local || "")}</p>
      </div>
    </article>

    <section class="section-card action-row">
      <button class="md3-button tonal ${isSaved ? "active" : ""}" data-action="toggle-save" data-id="${escapeHtml(temple.id)}">${escapeHtml(t(locale, isSaved ? "bookmarked" : "save"))}</button>
      <button class="md3-button tonal ${isVisited ? "active" : ""}" data-action="toggle-visited" data-id="${escapeHtml(temple.id)}">${escapeHtml(t(locale, isVisited ? "visited" : "markVisited"))}</button>
      <a class="md3-button" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener" data-action="open-map">${escapeHtml(t(locale, "mapDirections"))}</a>
    </section>

    ${qualityWarnings.length ? `<section class="state-card"><p>${escapeHtml(t(locale, "qualityNotice"))}</p></section>` : ""}

    <div class="detail-grid">
      <section class="section-card detail-span">
        <h3>${escapeHtml(t(locale, "overview"))}</h3>
        <p>${escapeHtml(manifest.description || temple.short_desc || "")}</p>
        <div class="md3-grid">${statCards(manifest.stats || {}, locale)}</div>
      </section>

      <section class="section-card">
        <h3>${escapeHtml(t(locale, "deityMeaning"))}</h3>
        <p><strong>${escapeHtml(deity.name || manifest?.deity?.form || t(locale, "deityFallback"))}</strong></p>
        <p>${escapeHtml(deity.meaning || manifest?.deity?.mythology_link || "")}</p>
        <p>${escapeHtml(deity?.mythology?.origin_story || "")}</p>
      </section>

      <section class="section-card">
        <h3>${escapeHtml(t(locale, "whyVisit"))}</h3>
        <p>${escapeHtml(whyVisit.spiritual_invitation || "")}</p>
        <div class="stack">${benefits || `<p class="muted">${escapeHtml(t(locale, "noResults"))}</p>`}</div>
      </section>

      <section class="section-card">
        <h3>${escapeHtml(t(locale, "keyFacts"))}</h3>
        <div class="stack">${factsList(bundle?.facts, locale)}</div>
      </section>

      <section class="section-card detail-span">
        <h3>${escapeHtml(t(locale, "gallery"))}</h3>
        <div class="media-grid">${mediaGrid(bundle?.media, locale)}</div>
      </section>
    </div>
  `;
}
