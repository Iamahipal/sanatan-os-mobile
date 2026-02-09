let audioCtx = null;

function ensureCtx() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

function beep({ freq = 660, ms = 70, type = "sine", gain = 0.05 } = {}) {
  const ctx = ensureCtx();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(ctx.destination);
  const t0 = ctx.currentTime;
  o.start(t0);
  o.stop(t0 + (ms / 1000));
}

export function createAudio(getSettings) {
  function allowed() {
    const s = getSettings();
    return !!(s && s.soundOn);
  }

  return {
    tap() {
      if (!allowed()) return;
      beep({ freq: 640, ms: 35, type: "triangle", gain: 0.03 });
    },
    good() {
      if (!allowed()) return;
      beep({ freq: 740, ms: 80, type: "sine", gain: 0.05 });
      setTimeout(() => beep({ freq: 980, ms: 90, type: "sine", gain: 0.04 }), 90);
    },
    warn() {
      if (!allowed()) return;
      beep({ freq: 220, ms: 90, type: "square", gain: 0.03 });
    }
  };
}

