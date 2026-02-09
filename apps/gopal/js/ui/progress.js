import { ui } from "../services/i18n.js";
import { ensureToday, getTodayKey } from "../services/storage.js";

export function renderProgress({ main, store, content, plan }) {
  const app = store.get();
  const lang = app.settings.language;
  const dateKey = getTodayKey();
  const hist = ensureToday(app, dateKey);

  main.innerHTML = "";

  const card = document.createElement("div");
  card.className = "card";
  const pad = document.createElement("div");
  pad.className = "cardPad";

  const beadsOn = Math.max(0, Math.min(27, app.progress.malaBeads || 0));
  const beads = Array.from({ length: 27 }).map((_, i) => `<div class="bead ${i < beadsOn ? "beadOn" : ""}"></div>`).join("");

  const flowers = Math.max(0, Math.min(3, hist.flowers || 0));
  const garland = Array.from({ length: 3 }).map((_, i) => `<div class="flower ${i < flowers ? "flowerOn" : ""}"></div>`).join("");
  const bonus = Array.isArray(hist.bonusLog) ? hist.bonusLog : [];
  const bonusMax = Number(app.settings.bonusMax || 0);
  const bonusLines = bonus.length
    ? bonus.map(e => `<div class="taskItem"><div><div class="taskName">${e.label || "Seva"}</div><div class="taskMeta">${new Date(e.ts || Date.now()).toLocaleTimeString()}</div></div><div class="badge badgeDone">+</div></div>`).join("")
    : `<div class="small">${ui("none_yet", lang)}</div>`;

  pad.innerHTML = `
    <div class="bubble">
      <div class="bubbleTitle">${ui("progress", lang)}</div>
      <div class="bubbleText">Consistency makes sanskar.</div>
    </div>
    <div class="sep"></div>
    <div class="progressRow">
      <div class="kv">
        <div><strong>Today\'s garland</strong><div class="small">3 flowers = day complete</div></div>
        <div class="garland">${garland}</div>
      </div>
      <div class="kv">
        <div><strong>Mala beads</strong><div class="small">27 beads = milestone</div></div>
        <div class="badge">${beadsOn}/27</div>
      </div>
      <div class="mala">${beads}</div>
      <div class="sep"></div>
      <div class="kv">
        <div><strong>${ui("bonus_today", lang)}</strong><div class="small">${bonus.length}/${bonusMax || bonus.length}</div></div>
        <div class="badge">${bonus.length}</div>
      </div>
      <div class="taskList">${bonusLines}</div>
    </div>
  `;

  card.appendChild(pad);
  main.appendChild(card);
}
