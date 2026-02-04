export async function registerPwa() {
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
          console.info("A new offline version is available. Reload to update.");
        }
      });
    });
  } catch (error) {
    console.warn("PWA registration failed:", error);
  }
}
