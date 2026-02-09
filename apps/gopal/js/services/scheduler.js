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

export function buildDailyPlan({ dateKey, tasks, settings, historyToday }) {
  // Stable minimum: 3 tasks always.
  // Slot mapping:
  // - Morning: respect OR naam (rotates)
  // - Afternoon: samay (fixed for now)
  // - Evening: choice between seva OR sports

  const dayIdx = weekdayIndex(dateKey);
  const done = new Set(historyToday.doneTaskIds || []);

  const bySlot = {
    morning: tasks.filter(t => (t.slots || []).includes("morning")),
    afternoon: tasks.filter(t => (t.slots || []).includes("afternoon")),
    evening: tasks.filter(t => (t.slots || []).includes("evening"))
  };

  const morningRespect = bySlot.morning.filter(t => t.category === "respect");
  const morningNaam = bySlot.morning.filter(t => t.category === "naam");
  const morningPool = (dayIdx % 2 === 0) ? [...morningRespect, ...morningNaam] : [...morningNaam, ...morningRespect];
  const morningTask = pickRotation(morningPool, dayIdx, null);

  // Afternoon rotates between samay and study (when available).
  const afternoonSamay = bySlot.afternoon.filter(t => t.category === "samay");
  const afternoonStudy = bySlot.afternoon.filter(t => t.category === "study");
  const afternoonPool = (dayIdx % 2 === 0) ? [...afternoonSamay, ...afternoonStudy] : [...afternoonStudy, ...afternoonSamay];
  const afternoonTask = pickRotation(afternoonPool, dayIdx, null) || pickRotation(bySlot.afternoon, dayIdx, null);

  const eveningSeva = bySlot.evening.filter(t => t.category === "seva");
  const eveningSports = bySlot.evening.filter(t => t.category === "sports");
  const doneIds = new Set(historyToday.doneTaskIds || []);
  const sevaPool = eveningSeva.filter(t => !doneIds.has(t.id));
  const sportsPool = eveningSports.filter(t => !doneIds.has(t.id));
  const sevaOpt = pickRotation(sevaPool.length ? sevaPool : eveningSeva, dayIdx, null);
  const sportsOpt = pickRotation(sportsPool.length ? sportsPool : eveningSports, dayIdx, null);

  const eveningChoice = {
    type: "choice",
    id: "evening_choice",
    titleKey: "evening_choice",
    options: [
      sevaOpt,
      sportsOpt
    ].filter(Boolean)
  };

  const minTasks = [
    { type: "task", slot: "morning", task: morningTask },
    { type: "task", slot: "afternoon", task: afternoonTask },
    { type: "choice", slot: "evening", choice: eveningChoice }
  ].filter(x => (x.type === "choice") || (x.task && x.task.id));

  // Mark completion status for UI.
  const status = {
    flowers: historyToday.flowers || 0,
    doneTaskIds: [...done]
  };

  return { dateKey, minTasks, status };
}
