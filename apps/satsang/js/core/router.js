export function createRouter(defaultView = "discover") {
  const listeners = new Set();

  function current() {
    const raw = window.location.hash.replace("#", "").trim();
    return raw || defaultView;
  }

  function notify() {
    const view = current();
    listeners.forEach((fn) => fn(view));
  }

  window.addEventListener("hashchange", notify);

  return {
    getView: current,
    push(view) {
      const next = `#${view}`;
      if (window.location.hash !== next) window.location.hash = next;
      notify();
    },
    init() {
      if (!window.location.hash) window.location.hash = `#${defaultView}`;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
