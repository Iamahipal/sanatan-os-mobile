function pickVoice(lang) {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (!voices || !voices.length) return null;

  // Prefer matching language.
  const want = (lang === "hi") ? "hi" : "en";
  const exact = voices.find(v => String(v.lang || "").toLowerCase().startsWith(want));
  return exact || voices[0];
}

export function createVoice(getSettings) {
  let ready = false;

  function allowed() {
    const s = getSettings();
    return !!(s && s.voiceOn && window.speechSynthesis);
  }

  function ensureVoicesLoaded() {
    if (!window.speechSynthesis) return;
    // Some browsers populate voices asynchronously.
    window.speechSynthesis.getVoices();
    if (!ready) {
      window.speechSynthesis.onvoiceschanged = () => {
        ready = true;
      };
    }
  }

  function speak(text, lang) {
    if (!allowed()) return;
    const clean = String(text || "").trim();
    if (!clean) return;

    ensureVoicesLoaded();
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.lang = (lang === "hi") ? "hi-IN" : "en-US";
      u.rate = 0.95;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    } catch {
      // Ignore speech errors.
    }
  }

  function stop() {
    if (!window.speechSynthesis) return;
    try { window.speechSynthesis.cancel(); } catch {}
  }

  return { speak, stop, ensureVoicesLoaded };
}

