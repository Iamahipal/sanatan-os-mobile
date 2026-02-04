import { loadTempleBundle, loadTempleIndex } from "./data-service.js";
import { registerPwa } from "./pwa.js";
import { navigateToHome, navigateToTemple, watchRouteChanges } from "./router.js";
import { renderHomeView, renderShell, renderTempleView } from "./ui.js";

const root = document.getElementById("root");

const state = {
  route: { name: "home" },
  index: [],
  indexLoading: true,
  indexError: "",
  query: "",
  category: "all",
  bundles: new Map(),
};

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function getFilteredTemples() {
  const query = normalizeText(state.query);
  return state.index.filter((temple) => {
    const categoryMatch = state.category === "all" || temple.category === state.category;
    if (!categoryMatch) return false;

    if (!query) return true;

    const haystack = [
      temple.name,
      temple.name_local,
      temple.location,
      temple.short_desc,
      temple.category,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

function getTempleById(templeId) {
  return state.index.find((temple) => temple.id === templeId) || null;
}

function homeContent() {
  return renderHomeView({
    query: state.query,
    category: state.category,
    temples: getFilteredTemples(),
    loading: state.indexLoading,
    error: state.indexError,
  });
}

function ensureBundleState(templeId) {
  if (!state.bundles.has(templeId)) {
    state.bundles.set(templeId, {
      loading: true,
      error: "",
      data: null,
    });

    loadTempleBundle(templeId)
      .then((data) => {
        state.bundles.set(templeId, { loading: false, error: "", data });
        render();
      })
      .catch((error) => {
        state.bundles.set(templeId, {
          loading: false,
          error: error?.message || "Failed to load temple details.",
          data: null,
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
  });
}

function renderNotFound() {
  return `
    <section class="state-card error">
      <p>Page not found.</p>
      <button class="md3-button" data-action="go-home">Go Home</button>
    </section>
  `;
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

  root.innerHTML = renderShell(pageHtml, route.name === "temple" ? "Temple Detail" : "Sanatan Temples");
}

function setupEvents() {
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    if (action === "open-temple" && button.dataset.id) {
      navigateToTemple(button.dataset.id);
      return;
    }

    if (action === "filter") {
      state.category = button.dataset.value || "all";
      render();
      return;
    }

    if (action === "go-home") {
      navigateToHome();
      return;
    }

    if (action === "scroll-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
  registerPwa();

  watchRouteChanges((route) => {
    state.route = route;
    render();
  });

  try {
    state.index = await loadTempleIndex();
    state.indexError = "";
  } catch (error) {
    state.index = [];
    state.indexError = error?.message || "Failed to load temple catalog.";
  } finally {
    state.indexLoading = false;
    render();
  }
}

bootstrap();
