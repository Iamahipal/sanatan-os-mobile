let waitingWorker = null;

export async function registerPwa(onUpdateReady) {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./sw.js", { scope: "./" });

    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;

      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          waitingWorker = worker;
          if (typeof onUpdateReady === "function") {
            onUpdateReady();
          } else {
            console.info("A new offline version is available. Reload to update.");
          }
        }
      });
    });
  } catch (error) {
    console.warn("PWA registration failed:", error);
  }
}

export function applyPwaUpdate() {
  if (!waitingWorker) return;

  waitingWorker.postMessage({ type: "SKIP_WAITING" });

  let refreshed = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshed) return;
    refreshed = true;
    window.location.reload();
  });
}
