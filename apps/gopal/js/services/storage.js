const KEY = "gopal_v1";

const DEFAULTS = {
  storageVersion: 1,
  settings: {
    language: "en",
    minTasksPerDay: 3,
    bonusMax: 2,
    dailyCapMinutes: 15,
    soundOn: true,
    voiceOn: false,
    parentConfirm: {
      pranam: false,
      seva: false
    },
    naamPresetId: "hare_krishna"
  },
  progress: {
    malaBeads: 0, // 0..27
    level: 1
  },
  historyByDate: {
    // "YYYY-MM-DD": { doneTaskIds: [], reflections: {taskId: idx}, dayComplete: bool, flowers: number }
  }
};

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}

function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function migrate(data) {
  if (!data || typeof data !== "object") return structuredClone(DEFAULTS);
  if (!data.storageVersion) data.storageVersion = 1;

  // Merge defaults to avoid missing keys.
  const merged = structuredClone(DEFAULTS);
  merged.storageVersion = data.storageVersion;
  merged.settings = { ...merged.settings, ...(data.settings || {}) };
  merged.settings.parentConfirm = {
    ...merged.settings.parentConfirm,
    ...((data.settings && data.settings.parentConfirm) || {})
  };
  merged.progress = { ...merged.progress, ...(data.progress || {}) };
  merged.historyByDate = { ...(data.historyByDate || {}) };
  return merged;
}

export function loadState() {
  const raw = localStorage.getItem(KEY);
  const parsed = safeParse(raw);
  return migrate(parsed);
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function ensureToday(state, dateKey = todayKey()) {
  if (!state.historyByDate[dateKey]) {
    state.historyByDate[dateKey] = {
      doneTaskIds: [],
      reflections: {},
      dayComplete: false,
      flowers: 0,
      minutesPlayed: 0,
      eveningPickedId: null,
      bonusLog: [] // [{ taskId, cardId, label, ts }]
    };
  }
  if (!Array.isArray(state.historyByDate[dateKey].bonusLog)) {
    state.historyByDate[dateKey].bonusLog = [];
  }
  return state.historyByDate[dateKey];
}

export function getTodayKey() {
  return todayKey();
}
