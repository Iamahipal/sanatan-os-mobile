import { ui } from "../services/i18n.js";

function qs(id) { return document.getElementById(id); }

export async function modal({ title, body, buttons, choices }) {
  const backdrop = qs("modalBackdrop");
  const el = qs("modal");
  backdrop.classList.remove("hidden");
  el.classList.remove("hidden");

  const choiceButtons = (choices || []).map((c, idx) => {
    return `<button class="btn" data-choice="${idx}">${c}</button>`;
  }).join("");

  const btnHtml = (buttons || []).map(b => {
    const cls = b.kind === "primary" ? "btn btnPrimary" : (b.kind === "good" ? "btn btnGood" : "btn");
    return `<button class="${cls}" data-btn="${b.id}">${b.label}</button>`;
  }).join("");

  el.innerHTML = `
    <div class="bubble">
      <div class="bubbleTitle">${title || ""}</div>
      <div class="bubbleText" style="white-space:pre-line">${body || ""}</div>
    </div>
    ${choices && choices.length ? `<div style="height:10px"></div><div class="taskList">${choiceButtons}</div>` : ""}
    <div style="height:12px"></div>
    <div class="grid2">${btnHtml}</div>
  `;

  let pickedChoice = null;

  return new Promise((resolve) => {
    const cleanup = () => {
      backdrop.classList.add("hidden");
      el.classList.add("hidden");
      el.innerHTML = "";
      backdrop.onclick = null;
    };

    el.querySelectorAll("[data-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        pickedChoice = Number(btn.getAttribute("data-choice"));
        // Visual feedback
        el.querySelectorAll("[data-choice]").forEach(b2 => b2.classList.remove("btnPrimary"));
        btn.classList.add("btnPrimary");
      });
    });

    el.querySelectorAll("[data-btn]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-btn");
        cleanup();
        resolve({ id, choiceIdx: pickedChoice });
      });
    });

    backdrop.onclick = () => {
      // do nothing; modal must be explicit
    };
  });
}

export async function parentGateModal(lang) {
  const a = 7 + Math.floor(Math.random() * 4); // 7..10
  const b = 5 + Math.floor(Math.random() * 4); // 5..8
  const ans = a + b;

  const backdrop = qs("modalBackdrop");
  const el = qs("modal");
  backdrop.classList.remove("hidden");
  el.classList.remove("hidden");

  el.innerHTML = `
    <div class="bubble">
      <div class="bubbleTitle">${ui("gate_title", lang)}</div>
      <div class="bubbleText">${ui("gate_question", lang)} <strong>${a} + ${b}</strong></div>
    </div>
    <div style="height:12px"></div>
    <input class="input" id="gateInput" inputmode="numeric" placeholder="" />
    <div style="height:12px"></div>
    <div class="grid2">
      <button class="btn" id="gateCancel">${ui("cancel", lang)}</button>
      <button class="btn btnPrimary" id="gateOk">${ui("ok", lang)}</button>
    </div>
  `;

  const input = el.querySelector("#gateInput");
  input.focus();

  return new Promise((resolve) => {
    const cleanup = () => {
      backdrop.classList.add("hidden");
      el.classList.add("hidden");
      el.innerHTML = "";
    };

    el.querySelector("#gateCancel").onclick = () => { cleanup(); resolve(false); };
    el.querySelector("#gateOk").onclick = () => {
      const v = Number(String(input.value || "").trim());
      const ok = (v === ans);
      cleanup();
      resolve(ok);
    };
  });
}

export async function settingsModal({ app, content, lang }) {
  const backdrop = qs("modalBackdrop");
  const el = qs("modal");
  backdrop.classList.remove("hidden");
  el.classList.remove("hidden");

  const presets = (content.presets && content.presets.naamJap) || [];
  const options = presets.map(p => {
    const label = (p.label && (p.label[lang] || p.label.en)) || p.id;
    const selected = (app.settings.naamPresetId === p.id) ? "selected" : "";
    return `<option value="${p.id}" ${selected}>${label}</option>`;
  }).join("");

  el.innerHTML = `
    <div class="bubble">
      <div class="bubbleTitle">${ui("parent_mode", lang)}</div>
      <div class="bubbleText">Settings</div>
    </div>
    <div class="sep"></div>
    <div class="toggleRow">
      <div><strong>${ui("language", lang)}</strong><div class="small">English / Hindi</div></div>
      <select class="input" id="setLang" style="min-height:40px">
        <option value="en" ${app.settings.language === "en" ? "selected" : ""}>English</option>
        <option value="hi" ${app.settings.language === "hi" ? "selected" : ""}>Hindi</option>
      </select>
    </div>
    <div class="toggleRow">
      <div><strong>${ui("daily_cap", lang)}</strong><div class="small">0 = unlimited</div></div>
      <input class="input" id="setCap" inputmode="numeric" value="${app.settings.dailyCapMinutes || 0}" />
    </div>
    <div class="toggleRow">
      <div><strong>${ui("naam", lang)}</strong><div class="small">Default naam-jap</div></div>
      <select class="input" id="setNaam" style="min-height:40px">${options}</select>
    </div>
    <div class="sep"></div>
    <div class="toggleRow">
      <div><strong>Parent confirm: Pranam</strong><div class="small">Require gate to mark as done</div></div>
      <input type="checkbox" id="setConfirmPranam" ${app.settings.parentConfirm && app.settings.parentConfirm.pranam ? "checked" : ""} />
    </div>
    <div class="toggleRow">
      <div><strong>Parent confirm: Seva</strong><div class="small">Require gate to mark as done</div></div>
      <input type="checkbox" id="setConfirmSeva" ${app.settings.parentConfirm && app.settings.parentConfirm.seva ? "checked" : ""} />
    </div>
    <div class="sep"></div>
    <div class="grid2">
      <button class="btn" id="btnReset">${ui("reset", lang)}</button>
      <button class="btn btnPrimary" id="btnSave">${ui("ok", lang)}</button>
    </div>
    <div style="height:10px"></div>
    <button class="btn" id="btnCancel">${ui("cancel", lang)}</button>
  `;

  return new Promise((resolve) => {
    const cleanup = () => {
      backdrop.classList.add("hidden");
      el.classList.add("hidden");
      el.innerHTML = "";
    };

    el.querySelector("#btnCancel").onclick = () => { cleanup(); resolve({ action: "cancel" }); };
    el.querySelector("#btnReset").onclick = () => { cleanup(); resolve({ action: "reset" }); };
    el.querySelector("#btnSave").onclick = () => {
      const language = el.querySelector("#setLang").value;
      const cap = Number(String(el.querySelector("#setCap").value || "0").trim());
      const naamPresetId = el.querySelector("#setNaam").value;
      const confirmPranam = !!el.querySelector("#setConfirmPranam").checked;
      const confirmSeva = !!el.querySelector("#setConfirmSeva").checked;

      const next = structuredClone(app.settings);
      next.language = language;
      next.dailyCapMinutes = Number.isFinite(cap) ? cap : 0;
      next.naamPresetId = naamPresetId;
      next.parentConfirm = { ...(next.parentConfirm || {}) };
      next.parentConfirm.pranam = confirmPranam;
      next.parentConfirm.seva = confirmSeva;

      cleanup();
      resolve({ action: "save", settings: next });
    };
  });
}

export async function confirmModal(lang) {
  const res = await modal({
    title: ui("reset", lang),
    body: "This will reset local progress.",
    buttons: [
      { id: "cancel", label: ui("cancel", lang) },
      { id: "ok", label: ui("ok", lang), kind: "primary" }
    ]
  });
  return res.id === "ok";
}

export function closeModal() {
  qs("modalBackdrop").classList.add("hidden");
  const el = qs("modal");
  el.classList.add("hidden");
  el.innerHTML = "";
}
