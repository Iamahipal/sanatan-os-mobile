import { t, ui } from "../services/i18n.js";
import { ensureToday, getTodayKey, saveState } from "../services/storage.js";

function taskRow({ task, lang, done, onOpen }) {
  const wrap = document.createElement("div");
  wrap.className = "taskItem";

  const left = document.createElement("div");
  left.innerHTML = `
    <div class="taskName">${t(task.title, lang)}</div>
    <div class="taskMeta">${t(task.teachLine, lang)}</div>
  `;

  const right = document.createElement("div");
  right.className = `badge ${done ? "badgeDone" : ""}`;
  right.textContent = done ? ui("done_label", lang) : "";

  wrap.appendChild(left);
  wrap.appendChild(right);

  wrap.addEventListener("click", () => {
    if (done) return;
    onOpen(task.id);
  });

  return wrap;
}

function choiceCard({ choice, lang, onPick }) {
  const box = document.createElement("div");
  box.className = "card";
  const pad = document.createElement("div");
  pad.className = "cardPad";

  pad.innerHTML = `
    <div class="bubble">
      <div class="bubbleTitle">${ui("evening_choice", lang)}</div>
      <div class="bubbleText">${ui("choose_one", lang)}</div>
    </div>
    <div style="height:10px"></div>
    <div class="grid2" id="opts"></div>
  `;

  const opts = pad.querySelector("#opts");
  choice.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "btn btnPrimary";
    btn.textContent = t(opt.title, lang);
    btn.addEventListener("click", () => onPick(opt.id));
    opts.appendChild(btn);
  });

  box.appendChild(pad);
  return box;
}

export function renderToday({ main, store, content, plan, onOpenTask }) {
  const app = store.get();
  const lang = app.settings.language;
  const dateKey = plan.dateKey;
  const hist = ensureToday(app, dateKey);

  main.innerHTML = "";

  const header = document.createElement("div");
  header.className = "card";

  const pad = document.createElement("div");
  pad.className = "cardPad";

  const flowers = Math.max(0, Math.min(3, hist.flowers || 0));
  const garland = Array.from({ length: 3 }).map((_, i) => `<div class="flower ${i < flowers ? "flowerOn" : ""}"></div>`).join("");

	pad.innerHTML = `
	    <div class="krishnaWrap">
	      <img class="krishnaImg" src="assets/krishna.png" alt="Krishna" />
	      <div class="bubble">
	        <div class="bubbleTitle">${ui("pearls_today", lang)}</div>
	        <div class="bubbleText">${ui("three_small_habits", lang)}</div>
	      </div>
	    </div>
    <div class="sep"></div>
    <div class="kv">
      <div><strong>Garland</strong><div class="small">3 flowers completes the day</div></div>
      <div class="garland">${garland}</div>
    </div>
  `;

  header.appendChild(pad);
  main.appendChild(header);

  const listCard = document.createElement("div");
  listCard.className = "card";
  const listPad = document.createElement("div");
  listPad.className = "cardPad";

  const list = document.createElement("div");
  list.className = "taskList";

  // Resolve minTasks into actual task list. Evening is a choice.
  let eveningPickedId = hist.eveningPickedId || null;

  const rows = [];
  for (const item of plan.minTasks) {
    if (item.type === "task") {
      const task = item.task;
      const done = (hist.doneTaskIds || []).includes(task.id);
      rows.push(taskRow({ task, lang, done, onOpen: onOpenTask }));
    } else {
      // choice
      const choice = item.choice;
      if (eveningPickedId) {
        const task = content.tasks.find(tk => tk.id === eveningPickedId);
        if (task) {
          const done = (hist.doneTaskIds || []).includes(task.id);
          rows.push(taskRow({ task, lang, done, onOpen: onOpenTask }));
        }
      } else {
        rows.push(choiceCard({
          choice,
          lang,
          onPick: (id) => {
            store.update(s => {
              const h = ensureToday(s, dateKey);
              h.eveningPickedId = id;
              saveState(s);
            }, "pick_evening");
          }
        }));
      }
    }
  }

  rows.forEach(r => list.appendChild(r));

  if (hist.dayComplete) {
    const done = document.createElement("div");
    done.className = "bubble";
    done.innerHTML = `<div class="bubbleTitle">${ui("day_complete", lang)}</div><div class="bubbleText">See Progress to view your mala beads.</div>`;
    list.appendChild(done);

    const bonusMax = Number(app.settings.bonusMax || 0);
    if (bonusMax > 0) {
      const used = (hist.bonusLog || []).length;
      const left = Math.max(0, bonusMax - used);

      const bonus = document.createElement("div");
      bonus.className = "card";
      const p = document.createElement("div");
      p.className = "cardPad";

      const disabled = left <= 0;
      p.innerHTML = `
        <div class="bubble">
          <div class="bubbleTitle">${ui("bonus_seva", lang)}</div>
          <div class="bubbleText">${ui("bonus_seva_desc", lang)}</div>
        </div>
        <div class="sep"></div>
        <div class="kv">
          <div><strong>${ui("bonus_left", lang)}</strong><div class="small">${used}/${bonusMax} used</div></div>
          <div class="badge">${left}</div>
        </div>
        <div style="height:12px"></div>
        <button class="btn btnGood" id="btnBonus" ${disabled ? "disabled" : ""}>${ui("do_bonus", lang)}</button>
      `;

      bonus.appendChild(p);
      list.appendChild(bonus);

      const btn = p.querySelector("#btnBonus");
      if (!disabled) {
        btn.addEventListener("click", () => onOpenTask("bonus_seva"));
      }
    }
  }

  listPad.appendChild(list);
  listCard.appendChild(listPad);
  main.appendChild(listCard);
}
