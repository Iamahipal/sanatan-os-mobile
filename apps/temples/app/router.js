export function parseRoute(hash) {
  const cleaned = (hash || "").replace(/^#/, "").trim();
  if (!cleaned || cleaned === "/") {
    return { name: "home" };
  }

  const templeMatch = cleaned.match(/^\/temple\/([a-z0-9-]+)$/i);
  if (templeMatch) {
    return { name: "temple", templeId: templeMatch[1] };
  }

  return { name: "notFound" };
}

export function navigateToHome() {
  if (window.location.hash !== "#/") {
    window.location.hash = "/";
  }
}

export function navigateToTemple(templeId) {
  window.location.hash = `/temple/${templeId}`;
}

export function watchRouteChanges(callback) {
  const handler = () => callback(parseRoute(window.location.hash));
  window.addEventListener("hashchange", handler);
  handler();
  return () => window.removeEventListener("hashchange", handler);
}
