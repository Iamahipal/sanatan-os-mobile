import { loadState, saveState, ensureToday, getTodayKey } from "./services/storage.js";
import { buildDailyPlan } from "./services/scheduler.js";
import { t, ui } from "./services/i18n.js";
import { createAudio } from "./services/audio.js";
import { createStore } from "./state/store.js";
import { renderToday } from "./ui/today.js";
import { renderProgress } from "./ui/progress.js";
import { modal, closeModal, parentGateModal, settingsModal, confirmModal } from "./ui/modals.js";
import content from "./content/quests.js";

// Content is imported as a module so the app works from file:// without fetch/CORS issues.
function loadContent() {
  return content;
}

function setTab(active) {
  const tabToday = document.getElementById("tabToday");
  const tabProgress = document.getElementById("tabProgress");
  tabToday.classList.toggle("tabActive", active === "today");
  tabProgress.classList.toggle("tabActive", active === "progress");
}

function setChip(dateKey) {
  document.getElementById("chipDay").textContent = dateKey;
}

function setI18nUI(lang) {
  document.getElementById("tabToday").textContent = ui("today", lang);
  document.getElementById("tabProgress").textContent = ui("progress", lang);
}

function flowersFromToday(historyToday) {
  const f = historyToday.flowers || 0;
  return Math.max(0, Math.min(3, f));
}

function addFlowerAndMaybeBead(app, dateKey) {
  const hist = ensureToday(app, dateKey);
  if (hist.flowers < 3) {
    hist.flowers++;
  }
  if (hist.flowers >= 3 && !hist.dayComplete) {
    hist.dayComplete = true;
    app.progress.malaBeads = Math.min(27, (app.progress.malaBeads || 0) + 1);
  }
}

function minutesPlayedToday(historyToday) {
  return historyToday.minutesPlayed || 0;
}

function addMinutes(app, dateKey, minutes) {
  const hist = ensureToday(app, dateKey);
  hist.minutesPlayed = (hist.minutesPlayed || 0) + minutes;
}

function withinDailyCap(app, dateKey) {
  const cap = app.settings.dailyCapMinutes || 0;
  if (!cap) return true;
  const hist = ensureToday(app, dateKey);
  return minutesPlayedToday(hist) < cap;
}

function pickTaskById(content, id) {
  return (content.tasks || []).find(tk => tk.id === id) || null;
}

function getTaskTitle(task, lang) {
  return t(task.title, lang);
}

function getTeachLine(task, lang) {
  return t(task.teachLine, lang);
}

function getRealWorld(task, lang) {
  return t(task.realWorld, lang);
}

function getReflectionPrompt(task, lang) {
  return t(task.reflection && task.reflection.prompt, lang);
}

function getReflectionChoices(task, lang) {
  const arr = (task.reflection && task.reflection.choices) || [];
  return arr.map(x => t(x, lang));
}

function taskIsDone(historyToday, taskId) {
  return (historyToday.doneTaskIds || []).includes(taskId);
}

function markTaskDone(app, dateKey, taskId) {
  const hist = ensureToday(app, dateKey);
  if (!hist.doneTaskIds.includes(taskId)) hist.doneTaskIds.push(taskId);
}

function setReflection(app, dateKey, taskId, choiceIdx) {
  const hist = ensureToday(app, dateKey);
  hist.reflections[taskId] = choiceIdx;
}

function currentNaamText(content, app) {
  const presetId = app.settings.naamPresetId || "hare_krishna";
  const preset = (content.presets && content.presets.naamJap || []).find(p => p.id === presetId);
  return preset ? preset.text : { en: "Hare Krishna", hi: "हरे कृष्ण" };
}

function buildPlayUI(task, lang, content, app) {
  const mode = task.play && task.play.mode;
  const cfg = (task.play && task.play.config) || {};

  if (mode === "tap_sequence") {
    const steps = (cfg.steps || []).map(s => t(s, lang));
    return { kind: "tap_sequence", steps };
  }

  if (mode === "tap_rhythm") {
    const beadsArr = cfg.beads || [9, 18, 27];
    // level -> choose beads count
    const level = app.progress.level || 1;
    const beads = level <= 1 ? beadsArr[0] : (level === 2 ? beadsArr[1] : beadsArr[2]);
    return { kind: "tap_rhythm", beads, naamText: t(currentNaamText(content, app), lang) };
  }

  if (mode === "schedule_blocks") {
    const blocks = (cfg.blocks || []).map(b => ({ id: b.id, mins: b.mins, label: t(b.label, lang) }));
    return { kind: "schedule_blocks", blocks };
  }

  if (mode === "sports_rhythm") {
    return {
      kind: "sports_rhythm",
      target: cfg.target || 20,
      label: t(cfg.label, lang) || ui("done", lang)
    };
  }

  if (mode === "seva_cards") {
    const cards = (cfg.cards || []).map(c => ({ id: c.id, label: t(c.label, lang) }));
    return { kind: "seva_cards", cards };
  }

  return { kind: "unknown" };
}

function renderTaskFlow({ content, store, dateKey, taskId, onFinish }) {
  const app = store.get();
  const lang = app.settings.language;
  const task = pickTaskById(content, taskId);
  if (!task) return;

  const main = document.getElementById("main");
  const playUI = buildPlayUI(task, lang, content, app);

  let playMinutesEstimate = 1; // simple cap accounting.

  main.innerHTML = "";

  const card = document.createElement("div");
  card.className = "card";

  const pad = document.createElement("div");
  pad.className = "cardPad";

  pad.innerHTML = `
    <div class="krishnaWrap">
      <img class="krishnaImg" src="assets/krishna.png" alt="Krishna" />
      <div class="bubble">
        <div class="bubbleTitle">${getTaskTitle(task, lang)}</div>
        <div class="bubbleText">${getTeachLine(task, lang)}</div>
      </div>
    </div>
    <div class="sep"></div>
    <div id="play"></div>
    <div class="sep"></div>
    <div class="grid2">
      <button class="btn btnWarn" id="btnBack">${ui("cancel", lang)}</button>
      <button class="btn btnPrimary" id="btnNext">${ui("continue", lang)}</button>
    </div>
    <div class="small" style="margin-top:10px">${ui("hold_settings", lang)}: ${ui("parent_mode", lang)}</div>
  `;

  card.appendChild(pad);
  main.appendChild(card);

  const playEl = pad.querySelector("#play");

  // Play implementations are intentionally simple but deterministic.
  let playState = { ok: false, data: null };

  const audio = createAudio(() => store.get().settings);

  function renderPlay() {
    if (playUI.kind === "tap_sequence") {
      const steps = playUI.steps;
      let idx = 0;
      playState.ok = false;
      playEl.innerHTML = `
        <div class="bubble">
          <div class="bubbleTitle">${ui("play_title", lang)}</div>
          <div class="bubbleText">${ui("play_tap_sequence", lang)}</div>
        </div>
        <div style="height:10px"></div>
        <div class="taskList" id="seq"></div>
        <div class="small" id="seqHint"></div>
      `;
      const seq = playEl.querySelector("#seq");
      const hint = playEl.querySelector("#seqHint");
      hint.textContent = `Step ${idx + 1} of ${steps.length}`;
      steps.forEach((label, i) => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = label;
        btn.addEventListener("click", () => {
          audio.tap();
          if (i !== idx) {
            hint.textContent = "Try again: start from the first step.";
            audio.warn();
            idx = 0;
            return;
          }
          idx++;
          hint.textContent = (idx >= steps.length) ? ui("play_good", lang) : `Step ${idx + 1} of ${steps.length}`;
          if (idx >= steps.length) playState.ok = true;
          if (playState.ok) audio.good();
        });
        seq.appendChild(btn);
      });
      return;
    }

    if (playUI.kind === "tap_rhythm") {
      const beads = playUI.beads;
      const naamText = playUI.naamText;
      let count = 0;
      let lastTap = 0;
      playState.ok = false;
      playEl.innerHTML = `
        <div class="bubble">
          <div class="bubbleTitle">${ui("naam", lang)}</div>
          <div class="bubbleText">${naamText}</div>
        </div>
        <div style="height:10px"></div>
        <button class="btn btnGood" id="tapBead">Tap bead (${count}/${beads})</button>
        <div class="small" id="tapHint" style="margin-top:10px"></div>
      `;
      const tapBtn = playEl.querySelector("#tapBead");
      const hint = playEl.querySelector("#tapHint");
      hint.textContent = ui("play_rhythm_hint", lang);
      tapBtn.addEventListener("click", () => {
        audio.tap();
        const now = Date.now();
        if (lastTap && (now - lastTap) < 180) {
          hint.textContent = ui("play_too_fast", lang);
          audio.warn();
          return;
        }
        lastTap = now;
        count++;
        tapBtn.textContent = `Tap bead (${count}/${beads})`;
        if (count >= beads) {
          hint.textContent = ui("play_good", lang);
          playState.ok = true;
          audio.good();
        }
      });
      return;
    }

    if (playUI.kind === "schedule_blocks") {
      // Very simple: drag ordering is simulated with tap-to-add sequence.
      const blocks = playUI.blocks;
      const chosen = [];
      playState.ok = false;

      const renderChosen = () => {
        const chosenEl = playEl.querySelector("#chosen");
        chosenEl.innerHTML = "";
        chosen.forEach(b => {
          const div = document.createElement("div");
          div.className = "taskItem";
          div.innerHTML = `<div><div class="taskName">${b.label}</div><div class="taskMeta">${b.mins} min</div></div><div class="badge">#${chosen.indexOf(b)+1}</div>`;
          chosenEl.appendChild(div);
        });
      };

      playEl.innerHTML = `
        <div class="bubble">
          <div class="bubbleTitle">${ui("play_title", lang)}</div>
          <div class="bubbleText">${ui("play_choose_order", lang)}</div>
        </div>
        <div style="height:10px"></div>
        <div class="grid2" id="blocks"></div>
        <div style="height:10px"></div>
        <div class="small">Your order:</div>
        <div class="taskList" id="chosen"></div>
        <div class="sep"></div>
        <button class="btn btnGood" id="btnClear">Clear</button>
      `;
      const blocksEl = playEl.querySelector("#blocks");
      blocks.forEach(b => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = `${b.label} (${b.mins}m)`;
        btn.addEventListener("click", () => {
          audio.tap();
          if (chosen.find(x => x.id === b.id)) return;
          chosen.push(b);
          renderChosen();
          if (chosen.length >= blocks.length) playState.ok = true;
          if (playState.ok) audio.good();
        });
        blocksEl.appendChild(btn);
      });
      playEl.querySelector("#btnClear").addEventListener("click", () => {
        audio.tap();
        chosen.length = 0;
        playState.ok = false;
        renderChosen();
      });
      renderChosen();
      return;
    }

    if (playUI.kind === "sports_rhythm") {
      let count = 0;
      playState.ok = false;
      playEl.innerHTML = `
        <div class="bubble">
          <div class="bubbleTitle">Move</div>
          <div class="bubbleText">Tap each time you do one ${playUI.label.toLowerCase()}.</div>
        </div>
        <div style="height:10px"></div>
        <button class="btn btnGood" id="btnCount">${playUI.label}: ${count}/${playUI.target}</button>
        <div class="small" id="moveHint" style="margin-top:10px"></div>
      `;
      const btn = playEl.querySelector("#btnCount");
      const hint = playEl.querySelector("#moveHint");
      hint.textContent = ui("play_move_hint", lang);
      btn.addEventListener("click", () => {
        audio.tap();
        count++;
        btn.textContent = `${playUI.label}: ${count}/${playUI.target}`;
        if (count >= playUI.target) {
          hint.textContent = ui("play_good", lang);
          playState.ok = true;
          audio.good();
        }
      });
      return;
    }

    if (playUI.kind === "seva_cards") {
      playState.ok = false;
      playEl.innerHTML = `
        <div class="bubble">
          <div class="bubbleTitle">${ui("play_title", lang)}</div>
          <div class="bubbleText">${ui("play_pick_seva", lang)}</div>
        </div>
        <div style="height:10px"></div>
        <div class="taskList" id="cards"></div>
        <div class="small" id="cardHint" style="margin-top:10px"></div>
      `;
      const cards = playEl.querySelector("#cards");
      const hint = playEl.querySelector("#cardHint");
      hint.textContent = "";
      playUI.cards.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = c.label;
        btn.addEventListener("click", () => {
          audio.tap();
          hint.textContent = `${ui("chosen_prefix", lang)}: ${c.label}`;
          playState.data = { cardId: c.id, label: c.label };
          playState.ok = true;
          audio.good();
        });
        cards.appendChild(btn);
      });
      return;
    }

    playEl.innerHTML = `<div class="bubble"><div class="bubbleTitle">Play</div><div class="bubbleText">(Not implemented)</div></div>`;
    playState.ok = true;
  }

  renderPlay();

  pad.querySelector("#btnBack").addEventListener("click", () => onFinish(false));

  pad.querySelector("#btnNext").addEventListener("click", async () => {
    if (!withinDailyCap(store.get(), dateKey)) {
      await modal({
        title: "Time",
        body: "Daily cap reached.",
        buttons: [{ id: "ok", label: ui("ok", lang), kind: "primary" }]
      });
      return;
    }

    if (!playState.ok) {
      await modal({
        title: "",
        body: ui("finish_play_first", lang),
        buttons: [{ id: "ok", label: ui("ok", lang), kind: "primary" }]
      });
      audio.warn();
      return;
    }

    // Real-world + reflection + reward
    const real = getRealWorld(task, lang);
    const reflectPrompt = getReflectionPrompt(task, lang);
    const choices = getReflectionChoices(task, lang);

    const ans = await modal({
      title: ui("real_world_title", lang),
      body: `${real}\n\n${reflectPrompt}`,
      choices,
      buttons: [{ id: "done", label: ui("done", lang), kind: "good", holdMs: task.bonusOnly ? 600 : 900 }]
    });

    // Optional parent confirmation for specific habits (Pranam / Seva).
    const confirmKey = task.confirmKey;
    if (confirmKey && store.get().settings.parentConfirm && store.get().settings.parentConfirm[confirmKey]) {
      const ok = await parentGateModal(lang);
      if (!ok) {
        await modal({
          title: ui("parent_mode", lang),
          body: ui("not_confirmed", lang),
          buttons: [{ id: "ok", label: ui("ok", lang), kind: "primary" }]
        });
        audio.warn();
        return;
      }
    }

    store.update(app2 => {
      const hist = ensureToday(app2, dateKey);
      addMinutes(app2, dateKey, playMinutesEstimate);
      if (task.bonusOnly) {
        hist.bonusLog.push({
          taskId,
          cardId: playState.data && playState.data.cardId ? playState.data.cardId : null,
          label: playState.data && playState.data.label ? playState.data.label : null,
          ts: Date.now()
        });
      } else {
        markTaskDone(app2, dateKey, taskId);
        if (typeof ans.choiceIdx === "number") setReflection(app2, dateKey, taskId, ans.choiceIdx);
        addFlowerAndMaybeBead(app2, dateKey);
      }
      saveState(app2);
    }, "task_complete");

    audio.good();
    onFinish(true);
  });
}

function wireSettings(store, content) {
  const btn = document.getElementById("btnSettings");
  let timer = null;

  const openSettings = async () => {
    const app = store.get();
    const lang = app.settings.language;

    const okGate = await parentGateModal(lang);
    if (!okGate) return;

    const result = await settingsModal({
      app,
      content,
      lang
    });

    if (result && result.action === "save") {
      store.update(s => {
        s.settings = result.settings;
        saveState(s);
      }, "settings_save");
      setI18nUI(store.get().settings.language);
    }

    if (result && result.action === "reset") {
      const confirm = await confirmModal(lang);
      if (!confirm) return;
      store.set(loadState(), "reset");
      saveState(store.get());
      setI18nUI(store.get().settings.language);
      renderApp({ store, content, tab: "today" });
    }
  };

  btn.addEventListener("pointerdown", () => {
    timer = setTimeout(openSettings, 700);
  });
  btn.addEventListener("pointerup", () => {
    if (timer) clearTimeout(timer);
    timer = null;
  });
  btn.addEventListener("pointercancel", () => {
    if (timer) clearTimeout(timer);
    timer = null;
  });
}

function renderApp({ store, content, tab }) {
  const app = store.get();
  const lang = app.settings.language;
  const dateKey = getTodayKey();
  setChip(dateKey);
  setI18nUI(lang);

  const hist = ensureToday(app, dateKey);
  const plan = buildDailyPlan({ dateKey, tasks: content.tasks, settings: app.settings, historyToday: hist });

  const main = document.getElementById("main");

  if (tab === "progress") {
    setTab("progress");
    renderProgress({ main, store, content, plan });
    return;
  }

  setTab("today");
  renderToday({
    main,
    store,
    content,
    plan,
    onOpenTask: (taskId) => {
      renderTaskFlow({
        content,
        store,
        dateKey,
        taskId,
        onFinish: () => renderApp({ store, content, tab: "today" })
      });
    }
  });
}

async function main() {
  const content = loadContent();
  const app = loadState();
  const store = createStore(app);

  // Ensure today exists.
  ensureToday(app, getTodayKey());
  saveState(app);

  // Wire UI
  wireSettings(store, content);

  document.getElementById("tabToday").addEventListener("click", () => renderApp({ store, content, tab: "today" }));
  document.getElementById("tabProgress").addEventListener("click", () => renderApp({ store, content, tab: "progress" }));

  store.subscribe(() => {
    // Re-render current tab based on active button.
    const isProgress = document.getElementById("tabProgress").classList.contains("tabActive");
    renderApp({ store, content, tab: isProgress ? "progress" : "today" });
  });

  renderApp({ store, content, tab: "today" });
}

main().catch(err => {
  const main = document.getElementById("main");
  main.innerHTML = `<div class="card"><div class="cardPad"><div class="bubble"><div class="bubbleTitle">Error</div><div class="bubbleText">${String(err)}</div></div></div></div>`;
});
