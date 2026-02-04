import { loadTempleBundle, loadTempleIndex, prefetchImages, prefetchTempleBundle } from "./data-service.js";
import { nextLanguage, t } from "./i18n.js";
import { loadPreferences, savePreferences } from "./preferences.js";
import { applyPwaUpdate, registerPwa } from "./pwa.js";
import { navigateToHome, navigateToTemple, watchRouteChanges } from "./router.js";
import { renderHomeView, renderShell, renderTempleView } from "./ui.js";

const root = document.getElementById("root");

const userPreferences = loadPreferences();

const state = {
  route: { name: "home" },
  index: [],
  indexLoading: true,
  indexError: "",
  indexWarnings: [],
  query: "",
  category: "all",
  locale: userPreferences.language,
  textScale: userPreferences.textScale,
  highContrast: userPreferences.highContrast,
  savedTempleIds: new Set(userPreferences.savedTempleIds),
  visitedTempleIds: new Set(userPreferences.visitedTempleIds),
  bundles: new Map(),
  prefetched: new Set(),
  pwaUpdateReady: false
};

function persistPreferences() {
  savePreferences({
    language: state.locale,
    savedTempleIds: [...state.savedTempleIds],
    visitedTempleIds: [...state.visitedTempleIds],
    textScale: state.textScale,
    highContrast: state.highContrast
  });
}

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function getFilteredTemples() {
  const query = normalizeText(state.query);

  return state.index.filter((temple) => {
    const categoryMatch = state.category === "all"
      || temple.category === state.category
      || (state.category === "saved" && state.savedTempleIds.has(temple.id));

    if (!categoryMatch) return false;

    if (!query) return true;

    const haystack = [
      temple.name,
      temple.name_local,
      temple.location,
      temple.short_desc,
      temple.category
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

function getTempleById(templeId) {
  return state.index.find((temple) => temple.id === templeId) || null;
}

function getPlanner() {
  const total = state.index.length;
  const visited = state.visitedTempleIds.size;
  const nextTemple = state.index.find((temple) => !state.visitedTempleIds.has(temple.id)) || null;
  return { total, visited, nextTemple };
}

function homeContent() {
  return renderHomeView({
    locale: state.locale,
    query: state.query,
    category: state.category,
    temples: getFilteredTemples(),
    loading: state.indexLoading,
    error: state.indexError,
    savedTempleIds: state.savedTempleIds,
    visitedTempleIds: state.visitedTempleIds,
    planner: getPlanner()
  });
}

function prefetchLikelyNextTemple(currentTempleId, bundle) {
  const currentIndex = state.index.findIndex((item) => item.id === currentTempleId);
  if (currentIndex === -1) return;

  const next = state.index[currentIndex + 1] || state.index[0];
  if (next && !state.prefetched.has(next.id)) {
    state.prefetched.add(next.id);
    prefetchTempleBundle(next.id);
  }

  const mediaUrls = (bundle?.media || []).slice(0, 2).map((item) => item.url);
  prefetchImages(mediaUrls);
}

function ensureBundleState(templeId) {
  if (!state.bundles.has(templeId)) {
    state.bundles.set(templeId, {
      loading: true,
      error: "",
      data: null
    });

    loadTempleBundle(templeId)
      .then((data) => {
        state.bundles.set(templeId, { loading: false, error: "", data });
        prefetchLikelyNextTemple(templeId, data);
        render();
      })
      .catch((error) => {
        state.bundles.set(templeId, {
          loading: false,
          error: error?.message || "Failed to load temple details.",
          data: null
        });
        render();
      });
  }

  return state.bundles.get(templeId);
}

function detailContent(templeId) {
  const temple = getTempleById(templeId);
  const bundleState = ensureBundleState(templeId);

  return renderTempleView({
    temple,
    bundle: bundleState?.data,
    loading: bundleState?.loading,
    error: bundleState?.error,
    locale: state.locale,
    isSaved: state.savedTempleIds.has(templeId),
    isVisited: state.visitedTempleIds.has(templeId)
  });
}

function renderNotFound() {
  return `
    <section class="state-card error">
      <p>${t(state.locale, "pageNotFound")}</p>
      <button class="md3-button" data-action="go-home">${t(state.locale, "goHome")}</button>
    </section>
  `;
}

function toggleMembership(setRef, value) {
  if (!value) return;
  if (setRef.has(value)) {
    setRef.delete(value);
  } else {
    setRef.add(value);
  }
  persistPreferences();
}

function resetProgress() {
  state.visitedTempleIds.clear();
  persistPreferences();
}

function toggleLanguage() {
  state.locale = nextLanguage(state.locale);
  persistPreferences();
}

function toggleTextSize() {
  state.textScale = state.textScale === "large" ? "normal" : "large";
  persistPreferences();
}

function toggleContrast() {
  state.highContrast = !state.highContrast;
  persistPreferences();
}

function prefetchStartupContent() {
  const firstTemple = state.index[0];
  if (!firstTemple) return;
  prefetchTempleBundle(firstTemple.id);
  prefetchImages(state.index.slice(0, 3).map((item) => item.thumbnail));
}

function render() {
  const route = state.route;
  let pageHtml = "";

  if (route.name === "home") {
    pageHtml = homeContent();
  } else if (route.name === "temple") {
    pageHtml = detailContent(route.templeId);
  } else {
    pageHtml = renderNotFound();
  }

  const title = route.name === "temple" ? t(state.locale, "appTitleDetail") : t(state.locale, "appTitleHome");

  root.innerHTML = renderShell(pageHtml, {
    title,
    locale: state.locale,
    textScale: state.textScale,
    highContrast: state.highContrast,
    pwaUpdateReady: state.pwaUpdateReady
  });
}

function setupEvents() {
  root.addEventListener("click", (event) => {
    const element = event.target.closest("[data-action]");
    if (!element) return;

    const action = element.dataset.action;

    if (action === "open-temple" && element.dataset.id) {
      navigateToTemple(element.dataset.id);
      return;
    }

    if (action === "continue-yatra" && element.dataset.id) {
      navigateToTemple(element.dataset.id);
      return;
    }

    if (action === "toggle-save") {
      event.stopPropagation();
      toggleMembership(state.savedTempleIds, element.dataset.id);
      render();
      return;
    }

    if (action === "toggle-visited") {
      event.stopPropagation();
      toggleMembership(state.visitedTempleIds, element.dataset.id);
      render();
      return;
    }

    if (action === "filter") {
      state.category = element.dataset.value || "all";
      render();
      return;
    }

    if (action === "reset-progress") {
      resetProgress();
      render();
      return;
    }

    if (action === "toggle-language") {
      toggleLanguage();
      render();
      return;
    }

    if (action === "toggle-text-size") {
      toggleTextSize();
      render();
      return;
    }

    if (action === "toggle-contrast") {
      toggleContrast();
      render();
      return;
    }

    if (action === "go-home") {
      navigateToHome();
      return;
    }

    if (action === "scroll-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (action === "dismiss-update") {
      state.pwaUpdateReady = false;
      render();
      return;
    }

    if (action === "apply-update") {
      applyPwaUpdate();
    }
  });

  root.addEventListener("input", (event) => {
    const input = event.target.closest("[data-action='search']");
    if (!input) return;

    state.query = input.value || "";
    render();
  });
}

async function bootstrap() {
  setupEvents();
  registerPwa(() => {
    state.pwaUpdateReady = true;
    render();
  });

  watchRouteChanges((route) => {
    state.route = route;
    render();
  });

  try {
    const loaded = await loadTempleIndex();
    state.index = loaded.items;
    state.indexWarnings = loaded.warnings;
    state.indexError = "";
    prefetchStartupContent();
  } catch (error) {
    state.index = [];
    state.indexWarnings = [];
    state.indexError = error?.message || "Failed to load temple catalog.";
  } finally {
    state.indexLoading = false;
    render();
  }
}

bootstrap();
