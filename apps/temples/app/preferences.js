const STORAGE_KEY = "temples.preferences.v3";

const defaultPreferences = {
  language: "en",
  savedTempleIds: [],
  visitedTempleIds: [],
  textScale: "normal",
  highContrast: false,
  updateReminderAfter: 0,
  installReminderAfter: 0
};

function uniqueStringArray(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === "string" && item.trim()))];
}

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultPreferences };
    const parsed = JSON.parse(raw);

    return {
      language: parsed.language === "hi" ? "hi" : "en",
      savedTempleIds: uniqueStringArray(parsed.savedTempleIds),
      visitedTempleIds: uniqueStringArray(parsed.visitedTempleIds),
      textScale: parsed.textScale === "large" ? "large" : "normal",
      highContrast: Boolean(parsed.highContrast),
      updateReminderAfter: Number.isFinite(parsed.updateReminderAfter) ? parsed.updateReminderAfter : 0,
      installReminderAfter: Number.isFinite(parsed.installReminderAfter) ? parsed.installReminderAfter : 0
    };
  } catch {
    return { ...defaultPreferences };
  }
}

export function savePreferences(preferences) {
  const payload = {
    language: preferences.language === "hi" ? "hi" : "en",
    savedTempleIds: uniqueStringArray(preferences.savedTempleIds),
    visitedTempleIds: uniqueStringArray(preferences.visitedTempleIds),
    textScale: preferences.textScale === "large" ? "large" : "normal",
    highContrast: Boolean(preferences.highContrast),
    updateReminderAfter: Number.isFinite(preferences.updateReminderAfter) ? preferences.updateReminderAfter : 0,
    installReminderAfter: Number.isFinite(preferences.installReminderAfter) ? preferences.installReminderAfter : 0
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
