function weekdayIndex(dateKey) {
  // dateKey: YYYY-MM-DD
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  // 0=Sun..6=Sat
  return dt.getDay();
}

function pickRotation(items, idx, avoid) {
  if (!items.length) return null;
  for (let i = 0; i < items.length; i++) {
    const cand = items[(idx + i) % items.length];
    if (!avoid || cand.id !== avoid) return cand;
  }
  return items[idx % items.length];
}

function themeForDay(dayIdx) {
  // 0=Sun..6=Sat
  // Themes are stable and values-oriented. They never change the 3-task minimum.
  const themes = [
    "gratitude", // Sun
    "samay",     // Mon
    "seva",      // Tue
    "sports",    // Wed
    "naam",      // Thu
    "respect",   // Fri
    "clean"      // Sat
  ];
  return themes[dayIdx] || "seva";
}

function themeScore(task, theme) {
  // Light-weight biasing without changing the task schema.
  // Prefer category matches, then id keyword matches for special themes.
  if (!task) return -1e9;
  let s = 0;

  if (task.category === theme) s += 100;

  const id = String(task.id || "").toLowerCase();
  if (theme === "clean" && id.includes("clean")) s += 90;
  if (theme === "gratitude" && id.includes("gratitude")) s += 90;
  if (theme === "respect" && (id.includes("pranam") || id.includes("guru") || id.includes("vani"))) s += 30;
  if (theme === "naam" && id.includes("naam")) s += 20;
  if (theme === "samay" && id.includes("samay")) s += 20;
  if (theme === "sports" && id.includes("sports")) s += 20;
  if (theme === "seva" && id.includes("seva")) s += 20;

  return s;
}

function pickWithTheme(items, dayIdx, theme) {
  if (!items.length) return null;

  // Keep rotation stability while applying theme bias.
  const rotated = [];
  for (let i = 0; i < items.length; i++) rotated.push(items[(dayIdx + i) % items.length]);

  let best = rotated[0];
  let bestScore = themeScore(best, theme);
  for (let i = 1; i < rotated.length; i++) {
    const cand = rotated[i];
    const score = themeScore(cand, theme);
    if (score > bestScore) {
      best = cand;
      bestScore = score;
    }
  }
  return best;
}

function pickNextWithTheme(items, dayIdx, theme, excludeIds) {
  if (!items.length) return null;
  const exclude = excludeIds || new Set();

  // Rotate for stability, then choose best remaining by theme score.
  const rotated = [];
  for (let i = 0; i < items.length; i++) rotated.push(items[(dayIdx + i) % items.length]);

  let best = null;
  let bestScore = -1e9;
  for (const cand of rotated) {
    if (!cand || !cand.id || exclude.has(cand.id)) continue;
    const score = themeScore(cand, theme);
    if (score > bestScore) {
      best = cand;
      bestScore = score;
    }
  }
  return best;
}

export function buildDailyPlan({ dateKey, tasks, settings, historyToday }) {
  // Stable minimum: 3 tasks always.
  // Slot mapping:
  // - Morning: respect OR naam (rotates)
  // - Afternoon: samay (fixed for now)
  // - Evening: choice between seva OR sports

  const dayIdx = weekdayIndex(dateKey);
  const done = new Set(historyToday.doneTaskIds || []);
  const theme = themeForDay(dayIdx);

  const enabled = (settings && settings.enabledCategories) || {};
  const isEnabled = (t) => {
    const cat = t && t.category;
    if (!cat) return true;
    // Default to enabled if missing key.
    return enabled[cat] !== false;
  };

  const eligibleTasks = tasks.filter(isEnabled);

  const bySlot = {
    morning: eligibleTasks.filter(t => (t.slots || []).includes("morning")),
    afternoon: eligibleTasks.filter(t => (t.slots || []).includes("afternoon")),
    evening: eligibleTasks.filter(t => (t.slots || []).includes("evening"))
  };

  const morningRespect = bySlot.morning.filter(t => t.category === "respect");
  const morningNaam = bySlot.morning.filter(t => t.category === "naam");
  // Theme bias: if theme is respect/naam, prefer that category for the morning slot.
  const morningPool = (theme === "naam")
    ? [...morningNaam, ...morningRespect]
    : (theme === "respect" ? [...morningRespect, ...morningNaam] : ((dayIdx % 2 === 0) ? [...morningRespect, ...morningNaam] : [...morningNaam, ...morningRespect]));

  const morningAvail = morningPool.filter(t => !done.has(t.id));
  const morningTask = pickWithTheme(morningAvail.length ? morningAvail : morningPool, dayIdx, theme);

  // Afternoon rotates between samay and study (when available).
  const afternoonSamay = bySlot.afternoon.filter(t => t.category === "samay");
  const afternoonStudy = bySlot.afternoon.filter(t => t.category === "study");
  const afternoonPool = (theme === "samay")
    ? [...afternoonSamay, ...afternoonStudy]
    : ((dayIdx % 2 === 0) ? [...afternoonSamay, ...afternoonStudy] : [...afternoonStudy, ...afternoonSamay]);
  const afternoonAvail = afternoonPool.filter(t => !done.has(t.id));
  const afternoonTask = pickWithTheme(afternoonAvail.length ? afternoonAvail : afternoonPool, dayIdx, theme) || pickWithTheme(bySlot.afternoon, dayIdx, theme);

  const eveningSeva = bySlot.evening.filter(t => t.category === "seva");
  const eveningSports = bySlot.evening.filter(t => t.category === "sports");
  const doneIds = new Set(historyToday.doneTaskIds || []);
  const sevaPool = eveningSeva.filter(t => !doneIds.has(t.id));
  const sportsPool = eveningSports.filter(t => !doneIds.has(t.id));
  const sevaBase = sevaPool.length ? sevaPool : eveningSeva;
  const sportsBase = sportsPool.length ? sportsPool : eveningSports;
  const sevaOpt = pickWithTheme(sevaBase, dayIdx, theme);
  const sportsOpt = pickWithTheme(sportsBase, dayIdx, theme);

  // Ensure we offer two options when possible (fallback to other evening tasks).
  const allEveningBase = bySlot.evening.filter(t => !doneIds.has(t.id));
  const exclude = new Set();
  const options = [];

  const pushOpt = (t) => {
    if (!t || !t.id || exclude.has(t.id)) return;
    options.push(t);
    exclude.add(t.id);
  };

  if (theme === "sports") {
    pushOpt(sportsOpt);
    pushOpt(sevaOpt);
  } else {
    pushOpt(sevaOpt);
    pushOpt(sportsOpt);
  }

  if (options.length < 2) {
    // Try another from the same pools first.
    pushOpt(pickNextWithTheme(sportsBase, dayIdx + 1, theme, exclude));
    pushOpt(pickNextWithTheme(sevaBase, dayIdx + 1, theme, exclude));
  }
  if (options.length < 2) {
    // Final fallback: any evening task (still respects doneIds).
    pushOpt(pickNextWithTheme(allEveningBase.length ? allEveningBase : bySlot.evening, dayIdx + 2, theme, exclude));
  }

  const eveningChoice = {
    type: "choice",
    id: "evening_choice",
    titleKey: "evening_choice",
    options
  };

  const want = (settings && settings.minTasksPerDay === 2) ? 2 : 3;

  const base = [
    { type: "task", slot: "morning", task: morningTask },
    { type: "task", slot: "afternoon", task: afternoonTask },
    ...(eveningChoice.options && eveningChoice.options.length ? [{ type: "choice", slot: "evening", choice: eveningChoice }] : [])
  ].filter(x => (x.type === "choice") || (x.task && x.task.id));

  // If parent chooses 2, use morning + evening (skip afternoon).
  const minTasks = (want === 2)
    ? base.filter(x => x.slot !== "afternoon")
    : base;

  // Mark completion status for UI.
  const status = {
    flowers: historyToday.flowers || 0,
    doneTaskIds: [...done]
  };

  return { dateKey, minTasks, status, theme };
}
