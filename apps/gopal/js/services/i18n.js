export function t(objOrString, lang) {
  if (objOrString == null) return "";
  if (typeof objOrString === "string") return objOrString;
  if (typeof objOrString === "object") {
    return objOrString[lang] || objOrString.en || "";
  }
  return "";
}

export const UI_STRINGS = {
  en: {
    today: "Today",
    progress: "Progress",
    pearls_today: "Today\'s 3 pearls",
    start: "Start",
    continue: "Continue",
    done: "Done",
    choose_one: "Choose one",
    real_world: "Real life",
    reflect: "Reflection",
    reward: "Reward",
    parent_mode: "Parent mode",
    hold_settings: "Hold settings",
    gate_title: "Parent gate",
    gate_question: "Answer to open settings:",
    language: "Language",
    daily_cap: "Daily cap (minutes)",
    naam: "Naam",
    reset: "Reset progress",
    cancel: "Cancel",
    ok: "OK",
    day_complete: "Garland complete",
    evening_choice: "Evening choice",
    done_label: "Done",
    three_small_habits: "3 small habits. Daily consistency.",
    bonus_seva: "Bonus Seva",
    bonus_seva_desc: "Optional extra good deed. Does not change today’s flowers.",
    bonus_left: "Bonuses left today",
    do_bonus: "Do Bonus Seva"
    ,
    bonus_today: "Bonus Seva today",
    none_yet: "None yet"
  },
  hi: {
    today: "आज",
    progress: "प्रगति",
    pearls_today: "आज की 3 आदतें",
    start: "शुरू",
    continue: "आगे",
    done: "हो गया",
    choose_one: "एक चुनो",
    real_world: "असल जीवन",
    reflect: "चिंतन",
    reward: "इनाम",
    parent_mode: "अभिभावक मोड",
    hold_settings: "सेटिंग दबाए रखें",
    gate_title: "अभिभावक गेट",
    gate_question: "सेटिंग खोलने के लिए उत्तर दें:",
    language: "भाषा",
    daily_cap: "दैनिक सीमा (मिनट)",
    naam: "नाम",
    reset: "प्रगति रीसेट",
    cancel: "रद्द",
    ok: "ठीक",
    day_complete: "माला पूरी",
    evening_choice: "शाम का चयन",
    done_label: "हो गया",
    three_small_habits: "3 छोटी आदतें। रोज़ की निरंतरता।",
    bonus_seva: "बोनस सेवा",
    bonus_seva_desc: "वैकल्पिक अतिरिक्त सेवा। आज के फूल नहीं बढ़ेंगे।",
    bonus_left: "आज बचे बोनस",
    do_bonus: "बोनस सेवा करो"
    ,
    bonus_today: "आज की बोनस सेवा",
    none_yet: "अभी नहीं"
  }
};

export function ui(key, lang) {
  return (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || UI_STRINGS.en[key] || key;
}
