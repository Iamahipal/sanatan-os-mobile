const STORAGE_KEY = "temples.preferences.v2";

const defaultPreferences = {
  language: "en",
  savedTempleIds: [],
  visitedTempleIds: [],
  textScale: "normal",
  highContrast: false
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
      highContrast: Boolean(parsed.highContrast)
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
    highContrast: Boolean(preferences.highContrast)
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
